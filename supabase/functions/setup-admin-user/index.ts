import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SetupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body: SetupRequest = await req.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers();

    if (checkError) {
      throw checkError;
    }

    const userExists = existingUser?.users?.some((u) => u.email === email);

    if (userExists) {
      return new Response(
        JSON.stringify({ message: "Admin user already exists" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw authError;
    }

    if (!authUser?.user?.id) {
      throw new Error("Failed to create user");
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: authUser.user.id,
      email,
      first_name: firstName || "Admin",
      last_name: lastName || "User",
      phone_number: "",
      role: "admin",
    });

    if (insertError) {
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        userId: authUser.user.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
