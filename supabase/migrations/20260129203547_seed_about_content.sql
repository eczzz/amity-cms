-- Seed About page content model and entry for amity-warme frontend
-- Sections: Hero, Climbing, Background Separator, Nutrition, Contact

-- ============================================================
-- 1. CONTENT MODEL
-- ============================================================

INSERT INTO content_models (id, name, api_identifier, description, icon, fields) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'About',
  'about',
  'All editable content for the About page',
  'faUser',
  $fields$[
    {
      "id": "field_3000000000001",
      "name": "Hero Title",
      "api_identifier": "hero_title",
      "field_type": "short_text",
      "required": true,
      "help_text": "Main heading in the hero section",
      "options": { "placeholder": "About Amity" }
    },
    {
      "id": "field_3000000000002",
      "name": "Hero Subheading",
      "api_identifier": "hero_subheading",
      "field_type": "long_text",
      "required": false,
      "help_text": "Paragraph below the hero title"
    },
    {
      "id": "field_3000000000003",
      "name": "Hero CTA",
      "api_identifier": "hero_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button in the hero section"
    },
    {
      "id": "field_3000000000004",
      "name": "Hero Image",
      "api_identifier": "hero_image",
      "field_type": "media",
      "required": true,
      "help_text": "Hero background image"
    },
    {
      "id": "field_3000000000005",
      "name": "Climbing Heading",
      "api_identifier": "climbing_heading",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "CLIMBING" }
    },
    {
      "id": "field_3000000000006",
      "name": "Climbing Content Blocks",
      "api_identifier": "climbing_content_blocks",
      "field_type": "array",
      "required": false,
      "help_text": "Content blocks for the climbing section (subheading + copy)",
      "options": {
        "item_fields": [
          { "name": "Subheading", "api_identifier": "subheading", "field_type": "short_text", "required": true },
          { "name": "Copy", "api_identifier": "copy", "field_type": "long_text", "required": true }
        ]
      }
    },
    {
      "id": "field_3000000000007",
      "name": "Climbing Images",
      "api_identifier": "climbing_images",
      "field_type": "array",
      "required": false,
      "help_text": "Carousel images for the climbing section",
      "options": {
        "item_fields": [
          { "name": "Image", "api_identifier": "image", "field_type": "media", "required": true },
          { "name": "Alt Text", "api_identifier": "alt_text", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_3000000000008",
      "name": "Separator Image",
      "api_identifier": "separator_image",
      "field_type": "media",
      "required": false,
      "help_text": "Full-width parallax background image between sections"
    },
    {
      "id": "field_3000000000009",
      "name": "Nutrition Heading",
      "api_identifier": "nutrition_heading",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "NUTRITION" }
    },
    {
      "id": "field_3000000000010",
      "name": "Nutrition Content Blocks",
      "api_identifier": "nutrition_content_blocks",
      "field_type": "array",
      "required": false,
      "help_text": "Content blocks for the nutrition section (subheading + copy)",
      "options": {
        "item_fields": [
          { "name": "Subheading", "api_identifier": "subheading", "field_type": "short_text", "required": true },
          { "name": "Copy", "api_identifier": "copy", "field_type": "long_text", "required": true }
        ]
      }
    },
    {
      "id": "field_3000000000011",
      "name": "Nutrition Images",
      "api_identifier": "nutrition_images",
      "field_type": "array",
      "required": false,
      "help_text": "Carousel images for the nutrition section",
      "options": {
        "item_fields": [
          { "name": "Image", "api_identifier": "image", "field_type": "media", "required": true },
          { "name": "Alt Text", "api_identifier": "alt_text", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_3000000000012",
      "name": "Contact Heading",
      "api_identifier": "contact_heading",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "READY TO ROCK?" }
    },
    {
      "id": "field_3000000000013",
      "name": "Contact Subheading",
      "api_identifier": "contact_subheading",
      "field_type": "long_text",
      "required": false,
      "help_text": "Paragraph below the contact form heading"
    },
    {
      "id": "field_3000000000014",
      "name": "Contact Email",
      "api_identifier": "contact_email",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "amity.warme@gmail.com" }
    },
    {
      "id": "field_3000000000015",
      "name": "Contact Info Items",
      "api_identifier": "contact_info_items",
      "field_type": "array",
      "required": false,
      "help_text": "Info blocks displayed next to the contact form",
      "options": {
        "item_fields": [
          { "name": "Title", "api_identifier": "title", "field_type": "short_text", "required": true },
          { "name": "Description", "api_identifier": "description", "field_type": "long_text" }
        ]
      }
    },
    {
      "id": "field_3000000000016",
      "name": "Contact Services",
      "api_identifier": "contact_services",
      "field_type": "array",
      "required": false,
      "help_text": "Service checkbox labels on the contact form",
      "options": {
        "item_fields": [
          { "name": "Label", "api_identifier": "label", "field_type": "short_text", "required": true }
        ]
      }
    },
    {
      "id": "field_3000000000017",
      "name": "Facebook URL",
      "api_identifier": "facebook_url",
      "field_type": "short_text",
      "required": false,
      "help_text": "Facebook profile URL"
    },
    {
      "id": "field_3000000000018",
      "name": "Instagram URL",
      "api_identifier": "instagram_url",
      "field_type": "short_text",
      "required": false,
      "help_text": "Instagram profile URL"
    },
    {
      "id": "field_3000000000019",
      "name": "Location Description",
      "api_identifier": "location_description",
      "field_type": "short_text",
      "required": false,
      "help_text": "Where Amity is based",
      "options": { "placeholder": "Western US" }
    }
  ]$fields$::jsonb
);

-- ============================================================
-- 2. CONTENT ENTRY
-- ============================================================

INSERT INTO content_entries (content_model_id, title, status, published_at, fields) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'About',
  'published',
  now(),
  $entry${
    "hero_title": "About Amity",
    "hero_subheading": "Driven to explore her potential on and off the rock, Amity finds joy in setting ambitious goals and seeking progression through each new adventure.",
    "hero_cta": { "text": "learn more", "url": "#why-climbing", "target": "_self" },
    "hero_image": "https://media.amitywarme.com/media/about-amity-hero1.webp",
    "climbing_heading": "CLIMBING",
    "climbing_content_blocks": [
      {
        "subheading": "Challenge & Exploration",
        "copy": "Amity finds climbing compelling because it provides the opportunity to explore her limits while immersed in incredible landscapes. She values effort and thrives when an objective pushes her to the brink, physically and mentally, demanding her all to accomplish her goals."
      },
      {
        "subheading": "Community & Empowerment",
        "copy": "Amity enjoys connecting with the climbing community and values the power of mutual stoke and shared experiences with her climbing partners. She appreciates learning from those around her and finds great joy in empowering others to believe in themselves and their ability to achieve something great."
      },
      {
        "subheading": "Multidiscipline",
        "copy": "Amity enjoys a variety of climbing disciplines but is most recognized for her multipitch and big wall ascents. She finds these objectives intriguing in the way they require a combination of every skill in her repertoire to pull off a successful ascent."
      }
    ],
    "climbing_images": [
      { "image": "https://media.amitywarme.com/media/amity-climbing-about-section-v2.webp", "alt_text": "Amity climbing in mountain landscape" },
      { "image": "https://media.amitywarme.com/media/amity-climbing-about-section-2.jpg", "alt_text": "Amity climbing on rock wall" },
      { "image": "https://media.amitywarme.com/media/amity-climbing-about-section-3.jpg", "alt_text": "Amity climbing on red rock formation" }
    ],
    "separator_image": "https://media.amitywarme.com/media/amity-about-background-separator.webp",
    "nutrition_heading": "NUTRITION",
    "nutrition_content_blocks": [
      {
        "subheading": "Weight-Sensitive Sports",
        "copy": "Amity has been immersed in weight-sensitive sports her entire life and is acutely aware of the harmful mental and physical effects of underfueling on athletic performance and long-term health."
      },
      {
        "subheading": "Personal Journey",
        "copy": "Growing up doing competitive gymnastics, she witnessed the negative ramifications of underfueling in others and suffered a career-ending back injury that may have been partly related to unintentional nutritional deficiencies. After finding climbing, she became more aware of a pervasive attitude around weight and diet that encouraged underfueling, experiencing the negative effects firsthand."
      },
      {
        "subheading": "The Mission",
        "copy": "Having long had an interest in sports performance and physiology, along with a passion for food and cooking, integrating both aspects into a career seemed like a natural connection. Now, her goal is to help athletes use nutrition to maximize their performance while protecting long-term health."
      }
    ],
    "nutrition_images": [
      { "image": "https://media.amitywarme.com/media/nutrition-on-about-page-2.webp", "alt_text": "Sports nutrition preparation" },
      { "image": "https://media.amitywarme.com/media/nutrition-on-about-page-3.webp", "alt_text": "Recovery nutrition smoothie" },
      { "image": "https://media.amitywarme.com/media/nutrition-on-about-page.webp", "alt_text": "Healthy nutrition bowl" }
    ],
    "contact_heading": "READY TO ROCK?",
    "contact_subheading": "Let's work together to optimize your performance and long-term health through nutrition.",
    "contact_email": "amity.warme@gmail.com",
    "contact_info_items": [
      { "title": "CHAT WITH AMITY", "description": "Ready to optimize your performance nutrition?" },
      { "title": "BASED IN", "description": "Western US but living the nomadic lifestyle and following wherever the stoke leads." },
      { "title": "SCHEDULE A CALL", "description": "Now accepting new clients for virtual nutrition coaching." }
    ],
    "contact_services": [
      { "label": "Nutrition consulting" },
      { "label": "Meal planning" },
      { "label": "Performance optimization" },
      { "label": "Expedition planning" },
      { "label": "Weight management" },
      { "label": "Sponsorship Inquiry" },
      { "label": "Other" }
    ],
    "facebook_url": "",
    "instagram_url": "",
    "location_description": "Western US"
  }$entry$::jsonb
);
