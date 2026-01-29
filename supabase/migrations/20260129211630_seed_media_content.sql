-- Seed Media page content model and entry for amity-warme frontend
-- Sections: MediaHero, MediaVideos, MediaPodcasts, MediaArticles

-- ============================================================
-- 1. CONTENT MODEL
-- ============================================================

INSERT INTO content_models (id, name, api_identifier, description, icon, fields) VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Media',
  'media',
  'All editable content for the Media page',
  'faVideo',
  $fields$[
    {
      "id": "field_6000000000001",
      "name": "Hero Title",
      "api_identifier": "hero_title",
      "field_type": "short_text",
      "required": true,
      "help_text": "Main heading in the hero section",
      "options": { "placeholder": "Media" }
    },
    {
      "id": "field_6000000000002",
      "name": "Hero Subheading",
      "api_identifier": "hero_subheading",
      "field_type": "long_text",
      "required": false,
      "help_text": "Paragraph below the hero title"
    },
    {
      "id": "field_6000000000003",
      "name": "Hero CTA",
      "api_identifier": "hero_cta",
      "field_type": "button",
      "required": false,
      "help_text": "Call-to-action button in the hero section"
    },
    {
      "id": "field_6000000000004",
      "name": "Hero Image",
      "api_identifier": "hero_image",
      "field_type": "media",
      "required": true,
      "help_text": "Hero background image"
    },
    {
      "id": "field_6000000000005",
      "name": "Videos Title",
      "api_identifier": "videos_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "Videos" }
    },
    {
      "id": "field_6000000000006",
      "name": "Videos Subtitle",
      "api_identifier": "videos_subtitle",
      "field_type": "long_text",
      "required": false,
      "help_text": "Subtitle text for the videos section"
    },
    {
      "id": "field_6000000000007",
      "name": "Videos",
      "api_identifier": "videos",
      "field_type": "array",
      "required": false,
      "help_text": "YouTube video embeds. Set featured to 'true' for the main video. deep_link_id is used for hash navigation (e.g. #book-of-hate).",
      "options": {
        "item_fields": [
          { "name": "Title", "api_identifier": "title", "field_type": "short_text", "required": true },
          { "name": "Description", "api_identifier": "description", "field_type": "long_text" },
          { "name": "Video URL", "api_identifier": "video_url", "field_type": "short_text", "required": true },
          { "name": "Featured", "api_identifier": "featured", "field_type": "short_text" },
          { "name": "Deep Link ID", "api_identifier": "deep_link_id", "field_type": "short_text" }
        ]
      }
    },
    {
      "id": "field_6000000000008",
      "name": "Podcasts Title",
      "api_identifier": "podcasts_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "Podcasts" }
    },
    {
      "id": "field_6000000000009",
      "name": "Podcasts Subtitle",
      "api_identifier": "podcasts_subtitle",
      "field_type": "long_text",
      "required": false,
      "help_text": "Subtitle text for the podcasts section"
    },
    {
      "id": "field_6000000000010",
      "name": "Podcasts",
      "api_identifier": "podcasts",
      "field_type": "array",
      "required": false,
      "help_text": "Podcast episode links",
      "options": {
        "item_fields": [
          { "name": "Title", "api_identifier": "title", "field_type": "short_text", "required": true },
          { "name": "Description", "api_identifier": "description", "field_type": "long_text" },
          { "name": "URL", "api_identifier": "url", "field_type": "short_text", "required": true }
        ]
      }
    },
    {
      "id": "field_6000000000011",
      "name": "Articles Title",
      "api_identifier": "articles_title",
      "field_type": "short_text",
      "required": false,
      "options": { "placeholder": "Articles" }
    },
    {
      "id": "field_6000000000012",
      "name": "Articles Subtitle",
      "api_identifier": "articles_subtitle",
      "field_type": "long_text",
      "required": false,
      "help_text": "Subtitle text for the articles section"
    },
    {
      "id": "field_6000000000013",
      "name": "Articles",
      "api_identifier": "articles",
      "field_type": "array",
      "required": false,
      "help_text": "Article links. Set featured to 'true' for the highlighted article. deep_link_id is used for hash navigation.",
      "options": {
        "item_fields": [
          { "name": "Title", "api_identifier": "title", "field_type": "short_text", "required": true },
          { "name": "Description", "api_identifier": "description", "field_type": "long_text" },
          { "name": "URL", "api_identifier": "url", "field_type": "short_text", "required": true },
          { "name": "Read Time", "api_identifier": "read_time", "field_type": "short_text" },
          { "name": "Featured", "api_identifier": "featured", "field_type": "short_text" },
          { "name": "Deep Link ID", "api_identifier": "deep_link_id", "field_type": "short_text" }
        ]
      }
    }
  ]$fields$::jsonb
);

-- ============================================================
-- 2. CONTENT ENTRY
-- ============================================================

INSERT INTO content_entries (content_model_id, title, status, published_at, fields) VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Media',
  'published',
  now(),
  $entry${
    "hero_title": "Media",
    "hero_subheading": "Videos, podcasts, and articles documenting Amity's climbing adventures and expertise.",
    "hero_cta": { "text": "Explore Content", "url": "#content", "target": "_self" },
    "hero_image": "https://media.amitywarme.com/media/media-page-hero.webp",
    "videos_title": "Videos",
    "videos_subtitle": "Watch Amity's climbing adventures and big wall ascents.",
    "videos": [
      {
        "title": "Ground Up - El Niño on El Capitan",
        "description": "A documentary capturing the tenacity, grit, and performance mindset required for a ground-up free ascent of El Capitan.",
        "video_url": "https://www.youtube.com/embed/WKPN-6DZHnA?start=90",
        "featured": "true",
        "deep_link_id": "el-nino"
      },
      {
        "title": "Close-Up with Amity",
        "description": "Get an intimate look at Amity's approach to climbing as an Arc'teryx athlete in this behind-the-scenes feature.",
        "video_url": "https://www.youtube.com/embed/VBIvQphF080",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Spicy 5.12 Trad at The Waterfall",
        "description": "Watch Amity navigate thin ball nut placements, technical stemming, and powerful bouldery sequences on this challenging route.",
        "video_url": "https://www.youtube.com/embed/faykNcKlr_M",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Book of Hate, 5.13d",
        "description": "An intense 45-meter pitch of strenuous stemming up a progressively steepening corner in Yosemite Valley's hardest stem climb.",
        "video_url": "https://www.youtube.com/embed/fBuivUAWSE8",
        "featured": "false",
        "deep_link_id": "book-of-hate"
      },
      {
        "title": "How to Poop on a Cliff (For Real)",
        "description": "Amity takes me through one of the strangest and hardest skills in climbing—the part of big wall life no one talks about… until now.",
        "video_url": "https://www.youtube.com/embed/hUHdQi0hLR0",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Real Ultimate Power, 5.14",
        "description": "A working session with Amity in Mormon Canyon in Sedona, Arizona on a route developed by Joel Unema.",
        "video_url": "https://www.youtube.com/embed/fjzrsK7zsq8",
        "featured": "false",
        "deep_link_id": "real-ultimate-power"
      },
      {
        "title": "Stingray, 5.13d",
        "description": "Watch Amity tackle this demanding finger crack in Joshua Tree, demonstrating technical precision and endurance on desert stone.",
        "video_url": "https://www.youtube.com/embed/RnenSqT0dFI",
        "featured": "false",
        "deep_link_id": "stingray"
      },
      {
        "title": "South Face of Half Dome",
        "description": "An honest attempt on the Xue Way route, capturing both the challenges and rewards of pushing limits on Half Dome.",
        "video_url": "https://www.youtube.com/embed/IZPc-ODv5s0",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Cosmic Debris, Yosemite",
        "description": "An introduction to Amity's climbing style as she takes on classic Yosemite granite in this SCARPA athlete feature film.",
        "video_url": "https://www.youtube.com/embed/3gaMAFHsuoY",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Golden Gate Ground Up, 5.13a",
        "description": "A five-and-a-half-day ground-up free ascent on El Capitan, with every pitch sent free by the entire team.",
        "video_url": "https://www.youtube.com/embed/g5vGAzcDkOQ",
        "featured": "false",
        "deep_link_id": "golden-gate"
      }
    ],
    "podcasts_title": "Podcasts",
    "podcasts_subtitle": "Listen to conversations about climbing, nutrition, and performance.",
    "podcasts": [
      {
        "title": "The RunOut - Bringing Stoke and Style Back to Climbing",
        "description": "Amity discusses ground-up big wall climbing, her approach to nutrition for athletes, and maintaining adventure ethics in modern climbing.",
        "url": "https://runoutpodcast.com/index.php/2024/09/02/runout-132-amity-warme-is-bringing-stoke-and-style-back-to-climbing/"
      },
      {
        "title": "American Alpine Club - The Yosemite Credo",
        "description": "Amity and a YOSAR climbing ranger weigh in on protection, safety, and the evolving ethics of climbing in Yosemite Valley.",
        "url": "https://americanalpineclub.org/news/2024/8/5/protect-amity-warme-and-a-yosar-climbing-ranger-weigh-in-on-the-yosemite-credo"
      },
      {
        "title": "The Struggle Climbing Show - Cobra Crack Lessons",
        "description": "Lessons from not sending, route-specific training strategies, micro-underfueling awareness, and climbing hard routes with a ruptured pulley.",
        "url": "https://www.thestruggleclimbingshow.com/amity-warme-on-cobra-crack-lessons-from-not-sending-route-specific-training-micro-underfueling-a/"
      },
      {
        "title": "The Struggle Climbing Show - Nutrition Expert Analysis",
        "description": "Amity breaks down performance nutrition for climbers, addressing common misconceptions and strategies for fueling athletic goals and recovery.",
        "url": "https://www.thestruggleclimbingshow.com/expert-analysis-nutrition-with-amity-warme/"
      },
      {
        "title": "Enormocast - Putting the Hammer Down",
        "description": "A wide-ranging conversation with Chris Kalous about life on the road, pursuing climbing dreams, and balancing multiple passions.",
        "url": "https://enormocast.com/2022/12/enormocast-254-amity-warme-putting-the-hammer-down/"
      },
      {
        "title": "The Nugget Climbing Podcast",
        "description": "Amity sits down with Steven to discuss her climbing philosophy, big wall objectives, and what drives her to keep pushing limits.",
        "url": "https://thenuggetclimbing.com/episodes/amity-warme"
      },
      {
        "title": "The John Freakin Muir Podcast",
        "description": "A conversation with Doc about the mental and physical demands of big wall climbing and what it takes to thrive in the vertical world.",
        "url": "https://youtu.be/SshJUJWP1sk?si=0RgDmBLVO1Jt6_c2"
      },
      {
        "title": "TryHardness: Amity",
        "description": "An exploration of Amity's meteoric five-year rise through traditional and big wall free climbing, accomplishing what typically takes the world's best climbers decades.",
        "url": "https://www.climbinggold.com/episodes/amity-warme"
      },
      {
        "title": "Amity: Climbing as a Metaphor for Life",
        "description": "Amity shares her inspiring journey through hard trad climbing—including major El Cap free climbs like Freerider and PreMuir Wall—while discussing climbing as a metaphor for life's challenges, the responsibilities of being a role model, and her expertise as a sports nutrition dietician.",
        "url": "https://open.spotify.com/episode/0GdIK71B8mcu7TdYWgMbAI?si=8491baf56459419a"
      }
    ],
    "articles_title": "Articles",
    "articles_subtitle": "Read news coverage and features about Amity's climbing achievements.",
    "articles": [
      {
        "title": "El Niño Free Repeat on El Capitan",
        "description": "Coverage of Amity and Brent Barghahn's ground-up free ascent of El Niño via Pineapple Express on El Capitan in Yosemite.",
        "url": "https://www.planetmountain.com/en/news/climbing/amity-warme-brent-barghahn-free-repeat-el-nino-el-capitan-yosemite.html",
        "read_time": "5 min read",
        "featured": "true",
        "deep_link_id": ""
      },
      {
        "title": "Amity Ticks Book of Hate",
        "description": "Feature on Amity's ascent of perhaps Yosemite's hardest stem corner, a 45-meter pitch of progressive stemming challenges.",
        "url": "https://gripped.com/news/amity-warme-climbing-yosemite-5-13d-trad/",
        "read_time": "4 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Stingray Send in Joshua Tree",
        "description": "Article covering Amity's ascent of this demanding 5.13d finger crack in Joshua Tree, showcasing technical precision on desert stone.",
        "url": "https://gripped.com/video/amity-warme-climbs-hard-finger-crack-in-joshua-tree/",
        "read_time": "3 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Tainted Love on Squamish's Chief",
        "description": "News of Amity sending Tainted Love, one of the Chief's most difficult pitches, a challenging 5.13dR trad route.",
        "url": "https://www.climbing.com/news/berthe-onsights-5-14b-amity-warme-repeats-tainted-love/",
        "read_time": "4 min read",
        "featured": "false",
        "deep_link_id": "tainted-love"
      },
      {
        "title": "Girl Crew Storms The Honeymoon",
        "description": "Feature on three climbers testing their skills on the Diamond at Longs Peak, pushing limits on this iconic alpine face.",
        "url": "https://www.dailycamera.com/2022/09/28/girl-crew-storms-the-honeymoon-on-longs-peak/",
        "read_time": "6 min read",
        "featured": "false",
        "deep_link_id": "the-honeymoon"
      },
      {
        "title": "Who Crushed Yosemite This Year?",
        "description": "An annual roundup highlighting Amity's prolific season in Yosemite Valley and her impressive ticklist of hard routes.",
        "url": "https://www.climbing.com/culture-climbing/amity-warme-profile/",
        "read_time": "7 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Fifth Woman to Free El Cap in a Day",
        "description": "Coverage of Amity's team-free ascent of El Capitan in a single day, completed unsupported, unstashed, and unrehearsed.",
        "url": "https://gripped.com/news/amity-warme-becomes-fifth-woman-to-free-el-capitan-in-a-day/",
        "read_time": "5 min read",
        "featured": "false",
        "deep_link_id": "friad-freerider"
      },
      {
        "title": "New Route and Fast Golden Gate Ascent",
        "description": "News about new terrain established on El Cap and Amity's ground-up all-team-free ascent of Golden Gate with Tyler Karow.",
        "url": "https://www.climbing.com/news/first-new-route-el-cap-two-years-fast-ascent-golden-gate/",
        "read_time": "4 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Amity Sends Golden Gate",
        "description": "Feature article on Amity becoming the second woman to free the massive Golden Gate route on El Capitan.",
        "url": "https://gripped.com/news/amity-warme-sends-golden-gate-5-13b-on-el-capitan/",
        "read_time": "6 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Amity's Philosophy on Trying Hard",
        "description": "Feature on the elite climber's approach to big wall free climbing, emphasizing 100% effort while finding balance between performance and well-being.",
        "url": "https://gripped.com/news/trad-pro-amity-warme-talks-trying-hard/",
        "read_time": "5 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Big Wall Nutrition Strategies",
        "description": "Registered dietitian Amity shares practical fueling strategies for multi-day wall climbs, from meal prep to hydration schedules on El Cap.",
        "url": "https://www.nutritionforclimbers.com/big-wall-nutrition/",
        "read_time": "6 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Five Guidelines for Peak Climbing Performance",
        "description": "Professional climber and sports dietitian Amity outlines essential nutrition principles to help climbers maximize their performance and health.",
        "url": "https://www.climbing.com/skills/nutrition/amity-warmes-5-climbing-nutrition-guidelines/",
        "read_time": "4 min read",
        "featured": "false",
        "deep_link_id": ""
      },
      {
        "title": "Amity repeats Pre-Muir Wall on El Capitan",
        "description": "Coverage of Amity's ascent of the Pre-Muir Wall on El Capitan, showcasing her mastery of this classic and challenging big wall route.",
        "url": "https://www.planetmountain.com/en/news/climbing/amity-warme-repeats-premuir-wall-el-capitan-yosemite.html",
        "read_time": "5 min read",
        "featured": "false",
        "deep_link_id": "premuir-repeat"
      }
    ]
  }$entry$::jsonb
);
