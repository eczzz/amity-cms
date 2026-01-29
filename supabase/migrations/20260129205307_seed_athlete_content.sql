-- Seed Athlete page content model and entry for amity-warme frontend
-- Sections: Hero, Accomplishments (Notable Ascents), Sponsors

-- ============================================================
-- 1. CONTENT MODEL
-- ============================================================

INSERT INTO content_models (id, name, api_identifier, description, icon, fields) VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Athlete',
  'athlete',
  'All editable content for the Athlete page',
  'faMountain',
  $fields$[
    {
      "id": "field_4000000000001",
      "name": "Hero Title",
      "api_identifier": "hero_title",
      "field_type": "short_text",
      "required": true,
      "help_text": "Main heading in the hero section",
      "options": { "placeholder": "Professional Climber" }
    },
    {
      "id": "field_4000000000002",
      "name": "Hero Subheading",
      "api_identifier": "hero_subheading",
      "field_type": "long_text",
      "required": false,
      "help_text": "Paragraph below the hero title"
    },
    {
      "id": "field_4000000000003",
      "name": "Hero CTA",
      "api_identifier": "hero_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button in the hero section"
    },
    {
      "id": "field_4000000000004",
      "name": "Hero Image",
      "api_identifier": "hero_image",
      "field_type": "media",
      "required": true,
      "help_text": "Hero background image"
    },
    {
      "id": "field_4000000000005",
      "name": "Accomplishments Title",
      "api_identifier": "accomplishments_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "NOTABLE ASCENTS" }
    },
    {
      "id": "field_4000000000006",
      "name": "Accomplishments Categories",
      "api_identifier": "accomplishments_categories",
      "field_type": "array",
      "required": false,
      "help_text": "Climbing categories with their routes. Each category has a name and a routes_json field containing a JSON string of route objects.",
      "options": {
        "item_fields": [
          { "name": "Category Name", "api_identifier": "category_name", "field_type": "short_text", "required": true },
          { "name": "Routes JSON", "api_identifier": "routes_json", "field_type": "long_text", "required": true }
        ]
      }
    },
    {
      "id": "field_4000000000007",
      "name": "Accomplishments Images",
      "api_identifier": "accomplishments_images",
      "field_type": "array",
      "required": false,
      "help_text": "Images that rotate in the accomplishments section sidebar",
      "options": {
        "item_fields": [
          { "name": "Image", "api_identifier": "image", "field_type": "media", "required": true },
          { "name": "Alt Text", "api_identifier": "alt_text", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_4000000000008",
      "name": "Sponsors Heading",
      "api_identifier": "sponsors_heading",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "SPONSORS" }
    },
    {
      "id": "field_4000000000009",
      "name": "Sponsors Description",
      "api_identifier": "sponsors_description",
      "field_type": "long_text",
      "required": false,
      "help_text": "Paragraph describing the sponsor partnerships"
    },
    {
      "id": "field_4000000000010",
      "name": "Sponsors Image",
      "api_identifier": "sponsors_image",
      "field_type": "media",
      "required": false,
      "help_text": "Image displayed in the sponsors section left column"
    },
    {
      "id": "field_4000000000011",
      "name": "Sponsors List",
      "api_identifier": "sponsors_list",
      "field_type": "array",
      "required": false,
      "help_text": "Sponsor logos and links",
      "options": {
        "item_fields": [
          { "name": "Name", "api_identifier": "name", "field_type": "short_text", "required": true },
          { "name": "Logo", "api_identifier": "logo", "field_type": "media", "required": true },
          { "name": "URL", "api_identifier": "url", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_4000000000012",
      "name": "Sponsor Pitch",
      "api_identifier": "sponsor_pitch",
      "field_type": "long_text",
      "required": false,
      "help_text": "Partnership pitch text displayed below the sponsor grid"
    },
    {
      "id": "field_4000000000013",
      "name": "Sponsor CTA",
      "api_identifier": "sponsor_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button in the sponsors section"
    }
  ]$fields$::jsonb
);

-- ============================================================
-- 2. CONTENT ENTRY
-- ============================================================

INSERT INTO content_entries (content_model_id, title, status, published_at, fields) VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Athlete',
  'published',
  now(),
  $entry${
    "hero_title": "Professional Climber",
    "hero_subheading": "Amity specializes in big wall free climbing and technical trad, with notable ascents including ground-up free climbs of El Capitan and challenging trad routes throughout North America.",
    "hero_cta": { "text": "View Notable Ascents", "url": "#accomplishments", "target": "_self" },
    "hero_image": "https://media.amitywarme.com/media/athlete-hero-image.webp",
    "accomplishments_title": "NOTABLE ASCENTS",
    "accomplishments_categories": [
      {
        "category_name": "Big Wall",
        "routes_json": "[{\"route_name\":\"PreMuir\",\"route_details\":\"5.13c/d, 33 pitches, ground-up\",\"link_url\":\"/Media#premuir-repeat\",\"tooltip\":\"Click to read article\"},{\"route_name\":\"El Niño - Pineapple Express\",\"route_details\":\"5.13c, 25 pitches, ground-up\",\"link_url\":\"/Media#el-nino\",\"tooltip\":\"Click to view video\"},{\"route_name\":\"El Corazon\",\"route_details\":\"5.13b, 32 pitches, ground-up\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"FRIAD: Freerider In A Day\",\"route_details\":\"5.13a, 32 pitches, self-supported, no rehearsal or stashing\",\"link_url\":\"/Media#friad-freerider\",\"tooltip\":\"Click to read article\"},{\"route_name\":\"Father Time\",\"route_details\":\"5.13b, 20 pitches, ground-up\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"Golden Gate\",\"route_details\":\"5.13a, 33 pitches, ground-up\",\"link_url\":\"/Media#golden-gate\",\"tooltip\":\"Click to view video\"}]"
      },
      {
        "category_name": "Multipitch",
        "routes_json": "[{\"route_name\":\"Real Ultimate Power\",\"route_details\":\"5.14a, 5 pitches, first in-a-day ascent\",\"link_url\":\"/Media#real-ultimate-power\",\"tooltip\":\"Click to view video\"},{\"route_name\":\"Sendero Luminoso\",\"route_details\":\"5.13d, 13 pitches, first female ascent\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"Cousin of Death\",\"route_details\":\"5.13d, 5 pitches\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"Cult Leader\",\"route_details\":\"5.13d, 5 pitches\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"The Honeymoon is Over\",\"route_details\":\"5.13c, 8 pitches\",\"link_url\":\"/Media#the-honeymoon\",\"tooltip\":\"Click to read article\"},{\"route_name\":\"Barnacle Scars\",\"route_details\":\"5.13, 3 pitches, first ascent\",\"link_url\":\"\",\"tooltip\":\"\"}]"
      },
      {
        "category_name": "Trad",
        "routes_json": "[{\"route_name\":\"Book of Hate\",\"route_details\":\"5.13d\",\"link_url\":\"/Media#book-of-hate\",\"tooltip\":\"Click to view video\"},{\"route_name\":\"Stingray\",\"route_details\":\"5.13d\",\"link_url\":\"/Media#stingray\",\"tooltip\":\"Click to view video\"},{\"route_name\":\"Tainted Love\",\"route_details\":\"5.13d R\",\"link_url\":\"/Media#tainted-love\",\"tooltip\":\"Click to read article\"},{\"route_name\":\"Enter the Dragon\",\"route_details\":\"5.13+ R, first female ascent\",\"link_url\":\"\",\"tooltip\":\"\"}]"
      },
      {
        "category_name": "Sport",
        "routes_json": "[{\"route_name\":\"Sarchasm\",\"route_details\":\"5.14a\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"The Rainbow\",\"route_details\":\"5.14a\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"Vesper\",\"route_details\":\"5.13d/14a\",\"link_url\":\"\",\"tooltip\":\"\"},{\"route_name\":\"Third Millenium\",\"route_details\":\"5.13d\",\"link_url\":\"\",\"tooltip\":\"\"}]"
      }
    ],
    "accomplishments_images": [
      { "image": "https://media.amitywarme.com/media/elnino.webp", "alt_text": "El Niño - Pineapple Express climb" },
      { "image": "https://media.amitywarme.com/media/goldengate.webp", "alt_text": "Golden Gate climb" },
      { "image": "https://media.amitywarme.com/media/elcap.webp", "alt_text": "El Capitan climb" }
    ],
    "sponsors_heading": "SPONSORS",
    "sponsors_description": "Amity is proud to partner with leading brands in the climbing industry who share her commitment to excellence and innovation. These partnerships enable her to push the boundaries of what's possible on rock faces around the world.",
    "sponsors_image": "https://media.amitywarme.com/media/amity-sponsors.webp",
    "sponsors_list": [
      { "name": "Arc'teryx", "logo": "https://media.amitywarme.com/media/arc.png", "url": "https://arcteryx.com/us/en" },
      { "name": "Camp", "logo": "https://media.amitywarme.com/media/camp.png", "url": "https://www.camp.it/m/ot/en/work/" },
      { "name": "Scarpa", "logo": "https://media.amitywarme.com/media/scarpa.png", "url": "https://us.scarpa.com/" },
      { "name": "Sterling", "logo": "https://media.amitywarme.com/media/sterling.png", "url": "https://sterlingrope.com/" },
      { "name": "Totem", "logo": "https://media.amitywarme.com/media/totem.png", "url": "https://www.totemmt.com/" },
      { "name": "G7", "logo": "https://media.amitywarme.com/media/g7.png", "url": "https://www.grade7.com/" },
      { "name": "Climb Strong", "logo": "https://media.amitywarme.com/media/climb-strong.png", "url": "https://www.climbstrong.com/" },
      { "name": "Rhino", "logo": "https://media.amitywarme.com/media/rhino.webp", "url": "https://rhinoskinsolutions.com/" },
      { "name": "Send", "logo": "https://media.amitywarme.com/media/send.webp", "url": "https://www.sendclimbing.com/" }
    ],
    "sponsor_pitch": "Interested in partnering with Amity? As a professional climber and registered dietitian, Amity offers unique opportunities for brand collaboration, product testing, and authentic representation in both the climbing and nutrition spaces. Her multidisciplinary expertise and genuine connection with the outdoor community make her an ideal ambassador for brands committed to excellence and innovation.",
    "sponsor_cta": { "text": "Request to Sponsor", "url": "/Contact", "target": "_self" }
  }$entry$::jsonb
);
