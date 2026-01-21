#!/bin/bash

# Extract project ref from Supabase URL
PROJECT_REF="ivlepliufkwfoiecivfy"

echo "🚀 Opening Supabase SQL Editor..."
echo ""
echo "The migration SQL will be copied to your clipboard."
echo "Simply paste it in the SQL Editor and click 'Run'."
echo ""

# Copy migration SQL to clipboard
cat supabase/migrations/20260121072500_create_content_models.sql | pbcopy

echo "✅ Migration SQL copied to clipboard!"
echo ""
echo "Opening SQL Editor in your browser..."
sleep 1

# Open SQL Editor in browser
open "https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new"

echo ""
echo "📋 Steps:"
echo "1. The SQL Editor should now be open in your browser"
echo "2. Paste (Cmd+V) the migration SQL"
echo "3. Click the 'Run' button"
echo "4. You should see 'Success. No rows returned'"
echo ""
echo "That's it! Your Content Models tables will be created."
