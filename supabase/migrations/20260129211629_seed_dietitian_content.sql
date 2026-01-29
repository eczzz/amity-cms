-- Seed Dietitian page content model and entry for amity-warme frontend
-- Sections: NutritionHero, CanYouRelate, ScrollingText, Services, NutritionBackgroundSeparator, HowItWorks

-- ============================================================
-- 1. CONTENT MODEL
-- ============================================================

INSERT INTO content_models (id, name, api_identifier, description, icon, fields) VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Dietitian',
  'dietitian',
  'All editable content for the Dietitian page',
  'faAppleWhole',
  $fields$[
    {
      "id": "field_5000000000001",
      "name": "Hero Title",
      "api_identifier": "hero_title",
      "field_type": "short_text",
      "required": true,
      "help_text": "Main heading in the hero section",
      "options": { "placeholder": "Registered Dietitian" }
    },
    {
      "id": "field_5000000000002",
      "name": "Hero Subheading 1",
      "api_identifier": "hero_subheading_1",
      "field_type": "long_text",
      "required": false,
      "help_text": "First paragraph below the hero title"
    },
    {
      "id": "field_5000000000003",
      "name": "Hero Subheading 2",
      "api_identifier": "hero_subheading_2",
      "field_type": "long_text",
      "required": false,
      "help_text": "Second paragraph below the hero title (credentials)"
    },
    {
      "id": "field_5000000000004",
      "name": "Hero CTA",
      "api_identifier": "hero_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button in the hero section"
    },
    {
      "id": "field_5000000000005",
      "name": "Hero Image",
      "api_identifier": "hero_image",
      "field_type": "media",
      "required": true,
      "help_text": "Hero background image"
    },
    {
      "id": "field_5000000000006",
      "name": "Relate Title",
      "api_identifier": "relate_title",
      "field_type": "short_text",
      "required": false,
      "help_text": "Heading for the 'Can You Relate' section",
      "options": { "placeholder": "SOUND FAMILIAR?" }
    },
    {
      "id": "field_5000000000007",
      "name": "Relate Subtitle",
      "api_identifier": "relate_subtitle",
      "field_type": "long_text",
      "required": false,
      "help_text": "Introductory text for the challenges/transformations section"
    },
    {
      "id": "field_5000000000008",
      "name": "Relate Background Image",
      "api_identifier": "relate_background_image",
      "field_type": "media",
      "required": false,
      "help_text": "Background image for the Can You Relate section"
    },
    {
      "id": "field_5000000000009",
      "name": "Challenges",
      "api_identifier": "challenges",
      "field_type": "array",
      "required": false,
      "help_text": "List of challenge items shown with X marks",
      "options": {
        "item_fields": [
          { "name": "Text", "api_identifier": "text", "field_type": "short_text", "required": true }
        ]
      }
    },
    {
      "id": "field_5000000000010",
      "name": "Transformations",
      "api_identifier": "transformations",
      "field_type": "array",
      "required": false,
      "help_text": "List of transformation items shown with check marks",
      "options": {
        "item_fields": [
          { "name": "Text", "api_identifier": "text", "field_type": "short_text", "required": true }
        ]
      }
    },
    {
      "id": "field_5000000000011",
      "name": "Scrolling Prefix",
      "api_identifier": "scrolling_prefix",
      "field_type": "short_text",
      "required": false,
      "help_text": "Static text before the scrolling words (e.g. 'you can')",
      "options": { "placeholder": "you can " }
    },
    {
      "id": "field_5000000000012",
      "name": "Scrolling Items",
      "api_identifier": "scrolling_items",
      "field_type": "array",
      "required": false,
      "help_text": "Words that scroll through one at a time",
      "options": {
        "item_fields": [
          { "name": "Text", "api_identifier": "text", "field_type": "short_text", "required": true }
        ]
      }
    },
    {
      "id": "field_5000000000013",
      "name": "Scrolling Tagline",
      "api_identifier": "scrolling_tagline",
      "field_type": "short_text",
      "required": false,
      "help_text": "Tagline that appears after the scrolling section",
      "options": { "placeholder": "and i'll show you how." }
    },
    {
      "id": "field_5000000000014",
      "name": "Scrolling Background Image",
      "api_identifier": "scrolling_background_image",
      "field_type": "media",
      "required": false,
      "help_text": "Background image for the scrolling text section"
    },
    {
      "id": "field_5000000000015",
      "name": "Services Heading",
      "api_identifier": "services_heading",
      "field_type": "short_text",
      "required": false,
      "help_text": "Heading for the services section",
      "options": { "placeholder": "COUNSELING SERVICES" }
    },
    {
      "id": "field_5000000000016",
      "name": "Services",
      "api_identifier": "services",
      "field_type": "array",
      "required": false,
      "help_text": "Service cards with pricing info. Set featured to 'true' for the highlighted card.",
      "options": {
        "item_fields": [
          { "name": "Title", "api_identifier": "title", "field_type": "short_text", "required": true },
          { "name": "Time", "api_identifier": "time", "field_type": "short_text" },
          { "name": "Price", "api_identifier": "price", "field_type": "short_text", "required": true },
          { "name": "Description", "api_identifier": "description", "field_type": "long_text", "required": true },
          { "name": "Featured", "api_identifier": "featured", "field_type": "short_text" },
          { "name": "Badge Text", "api_identifier": "badge_text", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_5000000000017",
      "name": "Services Image",
      "api_identifier": "services_image",
      "field_type": "media",
      "required": false,
      "help_text": "Image displayed alongside the service cards"
    },
    {
      "id": "field_5000000000018",
      "name": "Services CTA",
      "api_identifier": "services_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button below the service cards"
    },
    {
      "id": "field_5000000000019",
      "name": "REDs Logo",
      "api_identifier": "reds_logo",
      "field_type": "media",
      "required": false,
      "help_text": "REDs Informed Provider badge logo"
    },
    {
      "id": "field_5000000000020",
      "name": "REDs Tooltip",
      "api_identifier": "reds_tooltip",
      "field_type": "long_text",
      "required": false,
      "help_text": "Tooltip text that appears when hovering the REDs badge"
    },
    {
      "id": "field_5000000000021",
      "name": "Separator Image",
      "api_identifier": "separator_image",
      "field_type": "media",
      "required": false,
      "help_text": "Full-width parallax background image between sections"
    },
    {
      "id": "field_5000000000022",
      "name": "How Heading",
      "api_identifier": "how_heading",
      "field_type": "short_text",
      "required": false,
      "help_text": "Heading for the How It Works section",
      "options": { "placeholder": "WANT TO WORK WITH AMITY?" }
    },
    {
      "id": "field_5000000000023",
      "name": "Process Steps",
      "api_identifier": "process_steps",
      "field_type": "array",
      "required": false,
      "help_text": "Numbered steps describing the process to work with Amity",
      "options": {
        "item_fields": [
          { "name": "Description", "api_identifier": "description", "field_type": "long_text", "required": true }
        ]
      }
    },
    {
      "id": "field_5000000000024",
      "name": "Process Image",
      "api_identifier": "process_image",
      "field_type": "media",
      "required": false,
      "help_text": "Image displayed below the process steps"
    },
    {
      "id": "field_5000000000025",
      "name": "Testimonials Subtitle",
      "api_identifier": "testimonials_subtitle",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "WHAT OUR CLIMBERS SAY" }
    },
    {
      "id": "field_5000000000026",
      "name": "Testimonials Title",
      "api_identifier": "testimonials_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "TESTIMONIALS" }
    },
    {
      "id": "field_5000000000027",
      "name": "Testimonials",
      "api_identifier": "testimonials",
      "field_type": "array",
      "required": false,
      "help_text": "Client testimonials with photo, name, title, and quote",
      "options": {
        "item_fields": [
          { "name": "Name", "api_identifier": "name", "field_type": "short_text", "required": true },
          { "name": "Title", "api_identifier": "title", "field_type": "short_text" },
          { "name": "Quote", "api_identifier": "quote", "field_type": "long_text", "required": true },
          { "name": "Photo", "api_identifier": "photo", "field_type": "media" }
        ]
      }
    }
  ]$fields$::jsonb
);

-- ============================================================
-- 2. CONTENT ENTRY
-- ============================================================

INSERT INTO content_entries (content_model_id, title, status, published_at, fields) VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Dietitian',
  'published',
  now(),
  $entry${
    "hero_title": "Registered Dietitian",
    "hero_subheading_1": "Amity is passionate about helping fellow athletes understand their fueling needs and how to use nutrition to maximize performance and promote long-term health.",
    "hero_subheading_2": "She is a board-certified Registered Dietitian (RDN), with a Master's in Sports Nutrition, and a Certified REDs Informed Provider.",
    "hero_cta": { "text": "Learn More", "url": "#philosophy-services", "target": "_self" },
    "hero_image": "https://media.amitywarme.com/media/amity-nutrition-page-hero.webp",
    "relate_title": "SOUND FAMILIAR?",
    "relate_subtitle": "Many athletes struggle with these common challenges. The good news? Proper nutrition is the key to unlocking your full potential.",
    "relate_background_image": "https://media.amitywarme.com/media/comparison-bg.webp",
    "challenges": [
      { "text": "Confused about what to eat" },
      { "text": "Unsure how to fuel properly" },
      { "text": "Chronic fatigue & low energy" },
      { "text": "Frequent injuries or illness" },
      { "text": "Stomach & gut discomfort" },
      { "text": "Difficulty building muscle" },
      { "text": "Training hard, poor results" },
      { "text": "Complicated food relationship" }
    ],
    "transformations": [
      { "text": "Boost energy levels" },
      { "text": "Faster recovery times" },
      { "text": "Build strength effectively" },
      { "text": "Enhanced power & endurance" },
      { "text": "Better sleep quality" },
      { "text": "Fewer injuries & illness" },
      { "text": "Improved mental health" },
      { "text": "Healthy food relationship" }
    ],
    "scrolling_prefix": "you can ",
    "scrolling_items": [
      { "text": "fuel properly." },
      { "text": "recover faster." },
      { "text": "build strength." },
      { "text": "boost energy." },
      { "text": "perform better." },
      { "text": "feel confident." },
      { "text": "achieve goals." }
    ],
    "scrolling_tagline": "and i'll show you how.",
    "scrolling_background_image": "https://media.amitywarme.com/media/about-page-separator-2.webp",
    "services_heading": "COUNSELING SERVICES",
    "services": [
      {
        "title": "Initial Call",
        "time": "10 min",
        "price": "FREE",
        "description": "Not ready to book a full appointment? Contact Amity to schedule a brief conversation to ask any questions you have and make sure she is the right dietitian for you.",
        "featured": "false",
        "badge_text": ""
      },
      {
        "title": "Intake Session",
        "time": "60 min",
        "price": "$175",
        "description": "Amity provides individualized counseling tailored specifically to each client by taking a deep dive into their current dietary habits, food preferences, activity level, and upcoming goals.",
        "featured": "false",
        "badge_text": ""
      },
      {
        "title": "Follow-ups",
        "time": "45 min",
        "price": "$125",
        "description": "Amity fine tunes her approach, troubleshoots any issues that have come up since the initial session, assesses progress and adjusts as needed.",
        "featured": "false",
        "badge_text": ""
      },
      {
        "title": "Athlete Package",
        "time": "",
        "price": "$450",
        "description": "Nutrition is an important part of the performance puzzle! Amity helps clients cater their fueling toward their specific goals over the course of the intake session and three follow-up sessions.",
        "featured": "true",
        "badge_text": "MOST POPULAR"
      }
    ],
    "services_image": "https://media.amitywarme.com/media/amity-nutrition-image-1.webp",
    "services_cta": { "text": "get started", "url": "/Contact", "target": "_self" },
    "reds_logo": "https://media.amitywarme.com/media/red-s-provider-logo.png",
    "reds_tooltip": "Amity is a board-certified Registered Dietitian (RDN), with a Master's in Sports Nutrition from the University of Colorado, and a Certified RED-S Informed Provider.",
    "separator_image": "https://media.amitywarme.com/media/nutrition-background-1.webp",
    "how_heading": "WANT TO WORK WITH AMITY?",
    "process_steps": [
      { "description": "Send me a message, including a brief description of who you are and your main goals with nutrition counseling." },
      { "description": "I will send a link to the HIPAA-compliant online platform, Healthie, with a checklist including a New Client Questionnaire and Consent to Nutrition Services." },
      { "description": "I will schedule a time to meet via video call for intake session." },
      { "description": "Follow-up sessions can be scheduled as needed." }
    ],
    "process_image": "https://media.amitywarme.com/media/amity-dietitian-image-1.webp",
    "testimonials_subtitle": "WHAT OUR CLIMBERS SAY",
    "testimonials_title": "TESTIMONIALS",
    "testimonials": [
      {
        "name": "Anna Hazelnutt",
        "title": "Climber & Athlete",
        "quote": "When I reached out to Amity, I was struggling. I didn't understand how to properly fuel my workouts, and I was also developing a pretty negative relationship with food and my body. Together, we built a game plan that made sense for my training, adjusting it based on how much energy I was putting out each day. For maybe the first time in my climbing career, I felt confident that I was fueling my body with the right foods, in the right amounts, at the right times. But it went beyond performance: Amity helped me reframe my relationship with food in a more holistic way, sharing her expertise and perspective as a fellow female athlete and supporting me with regular check-ins. Her guidance has been invaluable to me as an athlete, and I'm so grateful I reached out!",
        "photo": "https://media.amitywarme.com/media/anna-hazelnutt-photo.webp"
      },
      {
        "name": "Eugene Kwan",
        "title": "Climber & Scientist",
        "quote": "You may have heard that Amity is a pro crusher who has put down huge routes on El Cap and elsewhere, but what you may not know is that she is also an awesome dietitian who works with people of all backgrounds to optimize their health and performance.  I'm an all-around rock/ice/alpine climber in my 40s and Amity has helped me optimize my macros, meal timing, and glucose control/lipid profile.  The results have been awesome: I just sent my first sport 13a and trad 12a, I'm closing in on a 20 minute 5K, and my LDL has dropped by 25% without any drugs. I'm also a scientist and I can confirm that Amity's advice is well-grounded in science and evidence-based nutrition.  She's also extremely humble, has great psychological advice about diet, climbing, and life, and has helped a friend of mine tremendously.  If you listen to her on any podcast, you'll get a sense of what a great person she is.  She's really responsive to messages and generally kind.  I highly recommend you work with her!",
        "photo": "https://media.amitywarme.com/media/eugene-kwan-photo.webp"
      },
      {
        "name": "Leslie Brandt",
        "title": "Multi-pitch Climber",
        "quote": "Working with Amity was really helpful planning for a big multi-pitch objective in RMNP. She helped me fuel properly for the morning and during the climb. I finished the big day still having energy instead of feeling ravenous and low energy.",
        "photo": "https://media.amitywarme.com/media/leslie-brandt.webp"
      }
    ]
  }$entry$::jsonb
);
