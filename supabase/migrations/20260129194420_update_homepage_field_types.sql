-- Update homepage content model and entry to use new field types:
--   media   – image fields now use media type (stores URLs directly)
--   button  – CTA pairs (text+link) collapsed into single button fields
--   array   – repeating content stored as typed arrays with item_fields
--
-- Since the previous migration already pushed the old schema, we delete
-- the old entry and model, then re-insert with the updated definitions.

-- ============================================================
-- 1. DELETE OLD DATA
-- ============================================================

DELETE FROM content_entries WHERE content_model_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM content_models  WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- ============================================================
-- 2. CONTENT MODEL (updated field types)
-- ============================================================

INSERT INTO content_models (id, name, api_identifier, description, icon, fields) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Homepage',
  'homepage',
  'All editable content for the homepage',
  'faHome',
  $fields$[
    {
      "id": "field_2000000000001",
      "name": "Hero First Name",
      "api_identifier": "hero_first_name",
      "field_type": "short_text",
      "required": true,
      "help_text": "Large hero first name",
      "options": { "placeholder": "AMITY" }
    },
    {
      "id": "field_2000000000002",
      "name": "Hero Last Name",
      "api_identifier": "hero_last_name",
      "field_type": "short_text",
      "required": false,
      "help_text": "Large hero last name",
      "options": { "placeholder": "WARME" }
    },
    {
      "id": "field_2000000000003",
      "name": "Hero Subtitle",
      "api_identifier": "hero_subtitle",
      "field_type": "short_text",
      "required": true,
      "options": { "placeholder": "PRO CLIMBER • DIETITIAN" }
    },
    {
      "id": "field_2000000000004",
      "name": "Hero Image",
      "api_identifier": "hero_image",
      "field_type": "media",
      "required": true,
      "help_text": "Hero background image"
    },
    {
      "id": "field_2000000000005",
      "name": "Sponsors",
      "api_identifier": "sponsors",
      "field_type": "array",
      "required": false,
      "help_text": "Partner brands and sponsors",
      "options": {
        "item_fields": [
          { "name": "Name", "api_identifier": "name", "field_type": "short_text", "required": true },
          { "name": "Logo", "api_identifier": "logo_url", "field_type": "media" }
        ]
      }
    },
    {
      "id": "field_2000000000006",
      "name": "About Heading",
      "api_identifier": "about_heading",
      "field_type": "short_text",
      "required": true,
      "options": { "placeholder": "THE STOKE IS REAL." }
    },
    {
      "id": "field_2000000000007",
      "name": "About Image",
      "api_identifier": "about_image",
      "field_type": "media",
      "required": true,
      "help_text": "Main about section background image"
    },
    {
      "id": "field_2000000000008",
      "name": "About Grid Image 1",
      "api_identifier": "about_grid_image_1",
      "field_type": "media",
      "required": false
    },
    {
      "id": "field_2000000000009",
      "name": "About Grid Image 2",
      "api_identifier": "about_grid_image_2",
      "field_type": "media",
      "required": false
    },
    {
      "id": "field_2000000000010",
      "name": "About Motto Line 1",
      "api_identifier": "about_motto_line_1",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "Life is short." }
    },
    {
      "id": "field_2000000000011",
      "name": "About Motto Line 2",
      "api_identifier": "about_motto_line_2",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "Send it." }
    },
    {
      "id": "field_2000000000012",
      "name": "About CTA",
      "api_identifier": "about_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action linking to the About page"
    },
    {
      "id": "field_2000000000013",
      "name": "Accomplishments",
      "api_identifier": "accomplishments",
      "field_type": "array",
      "required": false,
      "help_text": "Notable climbing accomplishments",
      "options": {
        "item_fields": [
          { "name": "Route Name", "api_identifier": "route_name", "field_type": "short_text", "required": true },
          { "name": "Route Details", "api_identifier": "route_details", "field_type": "short_text" },
          { "name": "Category", "api_identifier": "category", "field_type": "short_text" },
          { "name": "Link URL", "api_identifier": "link_url", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_2000000000014",
      "name": "Dietician Headline",
      "api_identifier": "dietician_headline",
      "field_type": "short_text",
      "required": true,
      "options": { "placeholder": "FUEL YOUR POTENTIAL." }
    },
    {
      "id": "field_2000000000015",
      "name": "Dietician Image",
      "api_identifier": "dietician_image",
      "field_type": "media",
      "required": true,
      "help_text": "Dietician section hero image"
    },
    {
      "id": "field_2000000000016",
      "name": "Dietician CTA",
      "api_identifier": "dietician_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action linking to the Contact page"
    },
    {
      "id": "field_2000000000017",
      "name": "Nutrition Heading",
      "api_identifier": "nutrition_heading",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "PERFORMANCE NUTRITION" }
    },
    {
      "id": "field_2000000000018",
      "name": "Nutrition Body",
      "api_identifier": "nutrition_body",
      "field_type": "long_text",
      "required": false,
      "help_text": "Performance nutrition description paragraphs"
    },
    {
      "id": "field_2000000000019",
      "name": "Nutrition Services",
      "api_identifier": "nutrition_services",
      "field_type": "array",
      "required": false,
      "help_text": "Nutrition service offerings",
      "options": {
        "item_fields": [
          { "name": "Title", "api_identifier": "title", "field_type": "short_text", "required": true },
          { "name": "Description", "api_identifier": "description", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_2000000000020",
      "name": "Meals Section Title",
      "api_identifier": "meals_section_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "REAL FUEL FOR REAL ATHLETES" }
    },
    {
      "id": "field_2000000000021",
      "name": "Meals CTA",
      "api_identifier": "meals_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action linking to the Contact page"
    },
    {
      "id": "field_2000000000022",
      "name": "Meal Showcase",
      "api_identifier": "meal_showcase",
      "field_type": "array",
      "required": false,
      "help_text": "Featured meal images with labels",
      "options": {
        "item_fields": [
          { "name": "Label", "api_identifier": "label", "field_type": "short_text", "required": true },
          { "name": "Image", "api_identifier": "image_url", "field_type": "media" },
          { "name": "Alt Text", "api_identifier": "alt_text", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_2000000000023",
      "name": "Testimonials Subtitle",
      "api_identifier": "testimonials_subtitle",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "WHAT OUR CLIMBERS SAY" }
    },
    {
      "id": "field_2000000000024",
      "name": "Testimonials Title",
      "api_identifier": "testimonials_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "TESTIMONIALS" }
    },
    {
      "id": "field_2000000000025",
      "name": "Testimonials",
      "api_identifier": "testimonials",
      "field_type": "array",
      "required": false,
      "help_text": "Customer testimonials with photos",
      "options": {
        "item_fields": [
          { "name": "Name", "api_identifier": "person_name", "field_type": "short_text", "required": true },
          { "name": "Title", "api_identifier": "person_title", "field_type": "short_text" },
          { "name": "Photo", "api_identifier": "photo_url", "field_type": "media" },
          { "name": "Quote", "api_identifier": "quote", "field_type": "long_text", "required": true }
        ]
      }
    }
  ]$fields$::jsonb
);

-- ============================================================
-- 3. CONTENT ENTRY (updated to use new field types)
-- ============================================================

INSERT INTO content_entries (content_model_id, title, status, published_at, fields) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Homepage',
  'published',
  now(),
  $entry${
    "hero_first_name": "AMITY",
    "hero_last_name": "",
    "hero_subtitle": "PRO CLIMBER • DIETITIAN",
    "hero_image": "https://media.amitywarme.com/media/amity-warme-hero.webp",
    "sponsors": [
      { "name": "Arc'teryx", "logo_url": "https://media.amitywarme.com/media/arc.png" },
      { "name": "Camp", "logo_url": "https://media.amitywarme.com/media/camp.png" },
      { "name": "Scarpa", "logo_url": "https://media.amitywarme.com/media/scarpa.png" },
      { "name": "Sterling", "logo_url": "https://media.amitywarme.com/media/sterling.png" },
      { "name": "Totem", "logo_url": "https://media.amitywarme.com/media/totem.png" },
      { "name": "G7", "logo_url": "https://media.amitywarme.com/media/g7.png" },
      { "name": "Climb Strong", "logo_url": "https://media.amitywarme.com/media/climb-strong.png" },
      { "name": "Rhino", "logo_url": "https://media.amitywarme.com/media/rhino.webp" },
      { "name": "Send", "logo_url": "https://media.amitywarme.com/media/send.webp" }
    ],
    "about_heading": "THE STOKE IS REAL.",
    "about_image": "https://media.amitywarme.com/media/amity-warme-about.webp",
    "about_grid_image_1": "https://media.amitywarme.com/media/golden-gate.webp",
    "about_grid_image_2": "https://media.amitywarme.com/media/cousin-of-death.webp",
    "about_motto_line_1": "Life is short.",
    "about_motto_line_2": "Send it.",
    "about_cta": { "text": "about amity", "url": "/About", "target": "_self" },
    "accomplishments": [
      { "route_name": "PreMuir", "route_details": "5.13c/d, 33 pitches, ground-up", "category": "Big Wall", "link_url": "/Media#premuir-repeat" },
      { "route_name": "El Nino - Pineapple Express", "route_details": "5.13c, 25 pitches, ground-up", "category": "Big Wall", "link_url": "/Media#el-nino" },
      { "route_name": "El Corazon", "route_details": "5.13b, 32 pitches, ground-up", "category": "Big Wall", "link_url": "" },
      { "route_name": "FRIAD: Freerider In A Day", "route_details": "5.13a, 32 pitches, self-supported, no rehearsal or stashing", "category": "Big Wall", "link_url": "/Media#friad-freerider" },
      { "route_name": "Father Time", "route_details": "5.13b, 20 pitches, ground-up", "category": "Big Wall", "link_url": "" },
      { "route_name": "Golden Gate", "route_details": "5.13a, 33 pitches, ground-up", "category": "Big Wall", "link_url": "/Media#golden-gate" },
      { "route_name": "Real Ultimate Power", "route_details": "5.14a, 5 pitches, first in-a-day ascent", "category": "Multipitch", "link_url": "/Media#real-ultimate-power" },
      { "route_name": "Sendero Luminoso", "route_details": "5.13d, 13 pitches, first female ascent", "category": "Multipitch", "link_url": "" },
      { "route_name": "Cousin of Death", "route_details": "5.13d, 5 pitches", "category": "Multipitch", "link_url": "" },
      { "route_name": "Cult Leader", "route_details": "5.13d, 5 pitches", "category": "Multipitch", "link_url": "" },
      { "route_name": "The Honeymoon is Over", "route_details": "5.13c, 8 pitches", "category": "Multipitch", "link_url": "/Media#the-honeymoon" },
      { "route_name": "Barnacle Scars", "route_details": "5.13, 3 pitches, first ascent", "category": "Multipitch", "link_url": "" },
      { "route_name": "Book of Hate", "route_details": "5.13d", "category": "Trad", "link_url": "/Media#book-of-hate" },
      { "route_name": "Stingray", "route_details": "5.13d", "category": "Trad", "link_url": "/Media#stingray" },
      { "route_name": "Tainted Love", "route_details": "5.13d R", "category": "Trad", "link_url": "/Media#tainted-love" },
      { "route_name": "Enter the Dragon", "route_details": "5.13+ R, first female ascent", "category": "Trad", "link_url": "" },
      { "route_name": "Sarchasm", "route_details": "5.14a", "category": "Sport", "link_url": "" },
      { "route_name": "The Rainbow", "route_details": "5.14a", "category": "Sport", "link_url": "" },
      { "route_name": "Vesper", "route_details": "5.13d/14a", "category": "Sport", "link_url": "" },
      { "route_name": "Third Millenium", "route_details": "5.13d", "category": "Sport", "link_url": "" }
    ],
    "dietician_headline": "FUEL YOUR POTENTIAL.",
    "dietician_image": "https://media.amitywarme.com/media/dietician.webp",
    "dietician_cta": { "text": "get started", "url": "/Contact", "target": "_self" },
    "nutrition_heading": "PERFORMANCE NUTRITION",
    "nutrition_body": "Proper fueling supports optimal performance. Your body is your most important piece of gear and the right nutrition can help you perform your best when it matters most.\n\nWhether you are a climber projecting a limit route, an endurance athlete training for a big race, or simply striving to feel strong in every day life — proper nutrition is an important piece of the puzzle.",
    "nutrition_services": [
      { "title": "CUSTOMIZED NUTRITION SUPPORT", "description": "Fueling strategies tailored to your individual goals and lifestyle" },
      { "title": "PRE & POST TRAINING NUTRITION", "description": "Maximize your energy and recovery for peak performance" },
      { "title": "TRIPS AND BIG OBJECTIVES", "description": "Plan ahead to fuel your biggest goals" }
    ],
    "meals_section_title": "REAL FUEL FOR REAL ATHLETES",
    "meals_cta": { "text": "contact amity", "url": "/Contact", "target": "_self" },
    "meal_showcase": [
      { "label": "Power Breakfast", "image_url": "https://media.amitywarme.com/media/real-fuel-for-real-athletes-1.webp", "alt_text": "Healthy breakfast bowl" },
      { "label": "Trail Mix & Snacks", "image_url": "https://media.amitywarme.com/media/real-fuel-for-real-athletes-2.webp", "alt_text": "Energy snacks" },
      { "label": "Endurance Fuel", "image_url": "https://media.amitywarme.com/media/real-fuel-for-real-athletes-4.webp", "alt_text": "Endurance fuel" },
      { "label": "Balanced Dinner", "image_url": "https://media.amitywarme.com/media/real-fuel-for-real-athletes-3.webp", "alt_text": "Balanced dinner" }
    ],
    "testimonials_subtitle": "WHAT OUR CLIMBERS SAY",
    "testimonials_title": "TESTIMONIALS",
    "testimonials": [
      { "person_name": "Anna Hazelnutt", "person_title": "Climber & Athlete", "photo_url": "https://media.amitywarme.com/media/anna-hazelnutt-photo.webp", "quote": "When I reached out to Amity, I was struggling with fueling my workouts and had a complicated relationship with food. Amity helped me understand my nutritional needs and develop a healthier approach to eating that supported my climbing goals. I feel stronger and more energized than ever." },
      { "person_name": "Eugene Kwan", "person_title": "Climber & Scientist", "photo_url": "https://media.amitywarme.com/media/eugene-kwan-photo.webp", "quote": "You may have heard that Amity is a pro crusher — but she is also an incredible dietitian. She helped me dial in my macros, meal timing, and overall nutrition strategy. My glucose and lipid results improved significantly, and I noticed a real difference in my climbing performance and recovery." },
      { "person_name": "Leslie Brandt", "person_title": "Multi-pitch Climber", "photo_url": "https://media.amitywarme.com/media/leslie-brandt.webp", "quote": "Working with Amity was really helpful planning for a big multi-pitch objective in RMNP. She helped me figure out what to eat before, during, and after long days on the wall. Her advice was practical and tailored to the unique demands of multi-pitch climbing." }
    ]
  }$entry$::jsonb
);
