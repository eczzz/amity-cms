-- Seed Contact page content model and entry for amity-warme frontend
-- Sections: ContactHero, DieticianTestimonials (FAQ portion)
-- Note: ContactAmity is already wired via the About model.
-- Note: Testimonials are stored in the Dietitian model.

-- ============================================================
-- 1. CONTENT MODEL
-- ============================================================

INSERT INTO content_models (id, name, api_identifier, description, icon, fields) VALUES (
  'a0000000-0000-0000-0000-000000000006',
  'Contact',
  'contact',
  'All editable content for the Contact page (hero and FAQ)',
  'faEnvelope',
  $fields$[
    {
      "id": "field_7000000000001",
      "name": "Hero Title",
      "api_identifier": "hero_title",
      "field_type": "short_text",
      "required": true,
      "help_text": "Main heading in the hero section",
      "options": { "placeholder": "Let's Connect" }
    },
    {
      "id": "field_7000000000002",
      "name": "Hero Subheading",
      "api_identifier": "hero_subheading",
      "field_type": "long_text",
      "required": false,
      "help_text": "Paragraph below the hero title"
    },
    {
      "id": "field_7000000000003",
      "name": "Hero CTA",
      "api_identifier": "hero_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button in the hero section"
    },
    {
      "id": "field_7000000000004",
      "name": "Hero Image",
      "api_identifier": "hero_image",
      "field_type": "media",
      "required": true,
      "help_text": "Hero background image"
    },
    {
      "id": "field_7000000000005",
      "name": "FAQ Title",
      "api_identifier": "faq_title",
      "field_type": "short_text",
      "required": false,
      "help_text": "Heading for the FAQ section",
      "options": { "placeholder": "FAQ" }
    },
    {
      "id": "field_7000000000006",
      "name": "FAQ Items",
      "api_identifier": "faq_items",
      "field_type": "array",
      "required": false,
      "help_text": "Frequently asked questions with expandable answers",
      "options": {
        "item_fields": [
          { "name": "Question", "api_identifier": "question", "field_type": "short_text", "required": true },
          { "name": "Answer", "api_identifier": "answer", "field_type": "long_text", "required": true }
        ]
      }
    },
    {
      "id": "field_7000000000007",
      "name": "FAQ Image",
      "api_identifier": "faq_image",
      "field_type": "media",
      "required": false,
      "help_text": "Portrait image displayed alongside the FAQ accordion"
    }
  ]$fields$::jsonb
);

-- ============================================================
-- 2. CONTENT ENTRY
-- ============================================================

INSERT INTO content_entries (content_model_id, title, status, published_at, fields) VALUES (
  'a0000000-0000-0000-0000-000000000006',
  'Contact',
  'published',
  now(),
  $entry${
    "hero_title": "Let's Connect",
    "hero_subheading": "Ready to optimize your performance and take your climbing to the next level? Let's talk about how nutrition can help you reach your goals.",
    "hero_cta": { "text": "Contact Amity", "url": "#contact-form", "target": "_self" },
    "hero_image": "https://media.amitywarme.com/media/amity-contact-page-hero.webp",
    "faq_title": "FAQ",
    "faq_items": [
      {
        "question": "Who do you work with?",
        "answer": "Athletes of all levels - recreational to elite. My primary area of expertise is in working with climbers (any discipline, from bouldering to big wall to alpine) but if you are looking to improve energy, recovery, or body-comp outcomes without sacrificing performance, don't hesitate to reach out!"
      },
      {
        "question": "What happens in the first session?",
        "answer": "We review your goals, training, health history, nutrition habits, labs (if any), and primary reasons for meeting. We will troubleshoot any obstacles and you will leave with 2–4 targeted actions to implement for the following weeks and establish a clear plan for follow-up."
      },
      {
        "question": "Will you tell me exactly what to eat?",
        "answer": "If you want to work together to build structured meal plans, we can. More often though, we will create flexible, real-world templates that hit your macro and micronutrient goals without rigid rules."
      },
      {
        "question": "Can you help with body composition without hurting performance?",
        "answer": "We will talk in depth about where you are at in a performance versus training phase and discuss if and when recomposition goals are appropriate. My goal is to help you align your nutrition with your training and performance so that strength, power, and recovery are not compromised. There are methods we can implement to target body composition changes while maintaining strength but we will be strategic about when these are applied during your year and monitor closely for any negative health or performance effects of under fueling."
      },
      {
        "question": "I'm new to nutrition. Is this overkill?",
        "answer": "Nope. My goal is to meet you wherever you are at with your nutrition knowledge. Simple changes can make a big difference to start. As you implement the basics, we will get more detailed to continue progressing and meeting your goals."
      },
      {
        "question": "Do you make trip/comp fueling plans?",
        "answer": "We can work together to create a plan tailored to your individual needs - whether that involves travel logistics, timing around complex competition schedules, or specific trip objectives."
      },
      {
        "question": "Do you meet online or in person?",
        "answer": "Sessions are almost always virtual via the HIPAA compliant platform, Healthie. You'll get a link and reminders before sessions and can use this platform for food tracking and communication with me."
      },
      {
        "question": "What are your credentials?",
        "answer": "I am a board-certified Registered Dietitian (RDN), with a Master's in Sports Nutrition, and a Certified RED-S Informed Provider. I am also an athlete myself and have first hand experience in understanding the demands of fueling for and performing in a gravitational sport like climbing."
      },
      {
        "question": "What should I prepare for my first session?",
        "answer": "Contact me to get started! I will send you a link to set up an account on Healthie where you will fill out a couple of intake forms including a New Client Questionnaire which will provide me with an overview of your current eating patterns, training schedule, health history, and goals in meeting with me. After that, we will coordinate a time to meet for an initial session."
      }
    ],
    "faq_image": "https://media.amitywarme.com/media/amity-professional-climber-contact-1.webp"
  }$entry$::jsonb
);
