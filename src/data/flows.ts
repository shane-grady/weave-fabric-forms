import type { Flow } from '../types'

// ─── Flow 01 · About You ──────────────────────────────────────────
const aboutYou: Flow = {
  id: 'about-you',
  title: 'About You',
  category: 'Identity & Personal Profile',
  introCopy:
    'The basics help Weave know who it\'s talking to. Quick stuff — name, location, the people and pets in your life.',
  icon: '👤',
  screens: [
    {
      type: 'intro',
      question: 'About You',
      introCopy:
        'The basics help Weave know who it\'s talking to. Quick stuff — name, location, the people and pets in your life.',
    },
    {
      type: 'multi-input',
      question: 'What should we call you?',
      fields: [
        { label: 'Full name', placeholder: 'Shane Williams' },
        { label: 'Nickname', placeholder: 'Shaney, SW, Coach...' },
      ],
      memoryTags: ['#full-name', '#nickname'],
    },
    {
      type: 'date-picker',
      question: "When's your birthday?",
      memoryTags: ['#birthday'],
    },
    {
      type: 'text-input',
      question: 'Where do you live?',
      placeholder: 'Brooklyn, NY — Williamsburg',
      memoryTags: ['#location'],
    },
    {
      type: 'multi-select',
      question: 'Languages you speak?',
      options: [
        'english', 'spanish', 'french', 'portuguese', 'mandarin',
        'hindi', 'arabic', 'japanese', 'korean', 'german',
        'italian', 'tagalog', 'other',
      ],
      memoryTags: ['#languages'],
    },
    {
      type: 'text-input',
      question: 'Cultural background?',
      placeholder: 'Irish-American, grew up in Boston',
      memoryTags: ['#cultural-background'],
    },
    {
      type: 'single-select',
      question: 'Relationship status?',
      options: [
        'single', 'in a relationship', 'married', 'engaged',
        'divorced', "it's complicated", 'rather not say',
      ],
      memoryTags: ['#relationship-status'],
      skipRules: [
        { values: ['single', 'rather not say'], targetIndex: 8 },
      ],
    },
    {
      type: 'text-input',
      question: "What's your partner's name?",
      placeholder: "Alex — we've been together 3 years",
      memoryTags: ['#partner'],
    },
    {
      type: 'binary-choice',
      question: 'Do you have kids?',
      memoryTags: ['#has-children'],
      skipRules: [{ values: ['no'], targetIndex: 10 }],
    },
    {
      type: 'text-input',
      question: 'Tell us about your kids',
      placeholder: 'Emma (7) and Liam (4)',
      memoryTags: ['#children'],
      isSubScreen: true,
    },
    {
      type: 'binary-choice',
      question: 'Do you have pets?',
      memoryTags: ['#has-pets'],
      skipRules: [{ values: ['no'], targetIndex: 12 }],
    },
    {
      type: 'text-input',
      question: 'Tell us about your pets',
      placeholder: 'Luna — golden retriever, 3 years old',
      memoryTags: ['#pets'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Describe yourself in a sentence',
      placeholder: 'Outdoorsy introvert who loves coffee and terrible puns',
      memoryTags: ['#self-description'],
    },
  ],
}

// ─── Flow 02 · Your Work ──────────────────────────────────────────
const yourWork: Flow = {
  id: 'your-work',
  title: 'Your Work',
  category: 'Professional Context',
  introCopy:
    'Most of what people ask AI to help with is work-related. A little context here goes a really long way.',
  icon: '💼',
  screens: [
    {
      type: 'intro',
      question: 'Your Work',
      introCopy:
        'Most of what people ask AI to help with is work-related. A little context here goes a really long way.',
    },
    {
      type: 'multi-input',
      question: 'What do you do?',
      fields: [
        { label: 'Job title', placeholder: 'Product Manager' },
        { label: 'Company', placeholder: 'Weave' },
      ],
      memoryTags: ['#job-title', '#company'],
    },
    {
      type: 'single-select',
      question: 'What industry?',
      options: [
        'tech', 'finance', 'healthcare', 'education',
        'media & entertainment', 'retail & e-commerce', 'legal',
        'real estate', 'consulting', 'government', 'nonprofit',
        'creative & design', 'manufacturing', 'other',
      ],
      memoryTags: ['#industry'],
    },
    {
      type: 'text-input',
      question: 'Describe your role in plain English',
      placeholder: 'I run the product team — roadmap, specs, ship decisions',
      memoryTags: ['#role-description'],
    },
    {
      type: 'multi-input',
      question: 'Who do you report to?',
      fields: [
        { label: 'Manager name', placeholder: 'Sarah Chen' },
        { label: 'Their title', placeholder: 'VP of Product' },
      ],
      memoryTags: ['#reports-to'],
    },
    {
      type: 'binary-choice',
      question: 'Do you manage people?',
      memoryTags: ['#has-reports'],
      skipRules: [{ values: ['no'], targetIndex: 7 }],
    },
    {
      type: 'text-input',
      question: 'Who are your direct reports?',
      placeholder: 'Jamie (design), Marcus (eng), Priya (data)',
      memoryTags: ['#direct-reports'],
      isSubScreen: true,
    },
    {
      type: 'single-select',
      question: "What's your work schedule like?",
      options: [
        'standard 9–5', 'flexible hours', 'shift-based',
        'freelance / project-based', 'always on', 'part-time',
      ],
      memoryTags: ['#work-schedule'],
    },
    {
      type: 'multi-select',
      question: 'How does your team communicate?',
      options: [
        'slack', 'email', 'zoom / meet', 'in-person',
        'text / iMessage', 'teams', 'discord',
        'notion comments', 'async docs', 'phone calls',
      ],
      memoryTags: ['#communication-norms'],
    },
    {
      type: 'multi-select',
      question: 'Tools you use daily?',
      options: [
        'slack', 'notion', 'figma', 'linear', 'jira',
        'google workspace', 'microsoft 365', 'github',
        'vs code', 'salesforce', 'hubspot', 'zoom',
        'asana', 'trello', 'other',
      ],
      memoryTags: ['#daily-tools'],
    },
    {
      type: 'text-input',
      question: 'What are you working toward?',
      placeholder: 'Trying to ship v2, get promoted, and learn to delegate better',
      memoryTags: ['#professional-goals'],
    },
    {
      type: 'text-input',
      question: 'Quick career backstory?',
      placeholder: 'Started in consulting, moved to product 5 years ago, mostly B2B SaaS',
      memoryTags: ['#career-history'],
    },
    {
      type: 'multi-select',
      question: 'Key skills and expertise?',
      options: [
        'product management', 'engineering', 'design',
        'data analysis', 'sales', 'marketing', 'operations',
        'finance', 'writing', 'leadership', 'strategy',
        'research', 'customer success', 'other',
      ],
      memoryTags: ['#skills'],
    },
  ],
}

// ─── Flow 03 · How You Communicate ────────────────────────────────
const howYouCommunicate: Flow = {
  id: 'how-you-communicate',
  title: 'How You Communicate',
  category: 'Communication Style',
  introCopy:
    'This is what makes Weave sound like you instead of a robot. Help us match your voice.',
  icon: '💬',
  screens: [
    {
      type: 'intro',
      question: 'How You Communicate',
      introCopy:
        'This is what makes Weave sound like you instead of a robot. Help us match your voice.',
    },
    {
      type: 'multi-select',
      question: 'How would you describe your tone?',
      options: [
        'casual', 'formal', 'warm', 'direct', 'playful',
        'sarcastic', 'professional', 'dry', 'enthusiastic', 'chill',
      ],
      memoryTags: ['#writing-tone'],
    },
    {
      type: 'single-select',
      question: 'Are you brief or thorough?',
      options: [
        'super brief — get to the point',
        'somewhere in the middle',
        'thorough — I like detail',
        "depends on who I'm talking to",
      ],
      memoryTags: ['#brevity-style'],
    },
    {
      type: 'single-select',
      question: 'Your humor style?',
      options: [
        'dry / deadpan', 'sarcastic', 'goofy / silly', 'witty',
        'self-deprecating', 'I keep it professional',
        'no real humor preference',
      ],
      memoryTags: ['#humor-style'],
    },
    {
      type: 'multi-select',
      question: 'How do you prefer to get information?',
      options: [
        'bullet points', 'short paragraphs', 'detailed narrative',
        'tables & charts', 'step-by-step', 'just the answer',
        'TL;DR first then detail',
      ],
      memoryTags: ['#response-format'],
    },
    {
      type: 'checkbox',
      question: 'Communication pet peeves?',
      options: [
        'unnecessary meetings', 'walls of text', 'vague instructions',
        'over-use of exclamation marks', 'jargon and buzzwords',
        'reply-all', 'no context in messages',
        'passive-aggressive tone', 'none',
      ],
      memoryTags: ['#communication-pet-peeves'],
    },
    {
      type: 'text-input',
      question: 'Words or phrases you always use?',
      placeholder:
        "I say 'fire' and 'bet' way too much… and I always start emails with 'Hey!'",
      memoryTags: ['#vocabulary-habits'],
    },
    {
      type: 'text-input',
      question: 'How do you switch it up?',
      placeholder:
        'Super casual with friends, more polished with clients, emoji-heavy on Slack',
      memoryTags: ['#code-switching'],
    },
  ],
}

// ─── Flow 04 · Your People ────────────────────────────────────────
const yourPeople: Flow = {
  id: 'your-people',
  title: 'Your People',
  category: 'Relationships & People',
  introCopy:
    "Weave can't help you navigate your world if it doesn't know who's in it. Add the people who matter most.",
  icon: '👥',
  screens: [
    {
      type: 'intro',
      question: 'Your People',
      introCopy:
        "Weave can't help you navigate your world if it doesn't know who's in it. Add the people who matter most.",
    },
    {
      type: 'text-input',
      question: "Who's your family?",
      placeholder:
        'Mom (Linda), brother (Jake, 28), sister-in-law (Maya) — they\'re in Denver',
      memoryTags: ['#family-members'],
    },
    {
      type: 'text-input',
      question: 'Closest friends?',
      placeholder:
        'Tina — college roommate, lives in LA. Dev — childhood best friend, we talk every day',
      memoryTags: ['#close-friends'],
    },
    {
      type: 'text-input',
      question: 'Key people at work?',
      placeholder:
        'Sarah (my boss, super detail-oriented), Marcus (eng lead, very chill)',
      memoryTags: ['#key-coworkers'],
    },
    {
      type: 'binary-choice',
      question: 'Have regular service providers?',
      skipRules: [{ values: ['no'], targetIndex: 6 }],
    },
    {
      type: 'text-input',
      question: 'Who do you rely on?',
      placeholder:
        'Dr. Patel (primary care), Mike (accountant), Rosa (therapist every Thursday)',
      memoryTags: ['#service-providers'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Important context about anyone?',
      placeholder:
        "Jake just had a baby, Tina's going through a breakup, Sarah hates small talk",
      memoryTags: ['#people-context'],
    },
    {
      type: 'text-input',
      question: 'Birthdays you want to remember?',
      placeholder: 'Mom: June 12, Dev: Oct 3, Sarah: Feb 28',
      memoryTags: ['#people-birthdays'],
    },
  ],
}

// ─── Flow 06a · Food & Dining ─────────────────────────────────────
const foodDining: Flow = {
  id: 'food-dining',
  title: 'Food & Dining',
  category: 'Preferences — Food',
  introCopy:
    "From restaurant recs to grocery lists — knowing what you eat (and don't) makes Weave way more helpful.",
  icon: '🍽️',
  screens: [
    {
      type: 'intro',
      question: 'Food & Dining',
      introCopy:
        "From restaurant recs to grocery lists — knowing what you eat (and don't) makes Weave way more helpful.",
    },
    {
      type: 'multi-select',
      question: 'Cuisines you love?',
      options: [
        'italian', 'mexican', 'japanese', 'thai', 'indian',
        'chinese', 'korean', 'mediterranean', 'american', 'french',
        'vietnamese', 'middle eastern', 'ethiopian', 'caribbean',
        'soul food', 'other',
      ],
      memoryTags: ['#favorite-cuisines'],
    },
    {
      type: 'binary-choice',
      question: 'Any dietary restrictions?',
      skipRules: [{ values: ['no'], targetIndex: 4 }],
    },
    {
      type: 'checkbox',
      question: 'What do you avoid?',
      options: [
        'vegetarian', 'vegan', 'gluten-free', 'dairy-free',
        'nut allergy', 'shellfish allergy', 'halal', 'kosher',
        'low-carb / keto', 'pescatarian', 'soy-free', 'other',
      ],
      memoryTags: ['#dietary-restrictions', '#food-allergies'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Go-to restaurants?',
      placeholder:
        "Sugarfish for special occasions, Sweetgreen for lazy lunches, Joe's Pizza always",
      memoryTags: ['#favorite-restaurants'],
    },
    {
      type: 'single-select',
      question: 'How adventurous are you with food?',
      options: [
        "I'll try anything", 'pretty adventurous',
        'I like what I like', 'very picky', 'comfort food only',
      ],
      memoryTags: ['#food-adventurousness'],
    },
    {
      type: 'text-input',
      question: 'Anything else about food?',
      placeholder:
        "I'm obsessed with hot sauce, hate cilantro, and make pasta from scratch on Sundays",
      memoryTags: ['#food-notes'],
    },
  ],
}

// ─── Flow 06b · Travel ────────────────────────────────────────────
const travel: Flow = {
  id: 'travel',
  title: 'Travel',
  category: 'Preferences — Travel',
  introCopy:
    "Whether it's a weekend trip or a big adventure — Weave can help plan better if it knows how you like to travel.",
  icon: '✈️',
  screens: [
    {
      type: 'intro',
      question: 'Travel',
      introCopy:
        "Whether it's a weekend trip or a big adventure — Weave can help plan better if it knows how you like to travel.",
    },
    {
      type: 'multi-select',
      question: 'How do you like to travel?',
      options: [
        'budget-friendly', 'luxury', 'adventure', 'relaxation',
        'cultural immersion', 'road trips', 'solo', 'with a group',
        'foodie trips', 'off-the-grid', 'business travel',
      ],
      memoryTags: ['#travel-style'],
    },
    {
      type: 'text-input',
      question: "Favorite places you've been?",
      placeholder:
        'Tokyo, Portugal, Costa Rica — anything with good food and warm weather',
      memoryTags: ['#favorite-destinations'],
    },
    {
      type: 'checkbox',
      question: 'Travel deal-breakers?',
      options: [
        'long flights (10+ hrs)', 'extreme heat', 'extreme cold',
        'language barriers', 'no wifi', 'hostels / shared rooms',
        'heavy tourist areas', "none — I'm easy",
      ],
      memoryTags: ['#travel-dealbreakers'],
    },
    {
      type: 'single-select',
      question: 'Typical trip budget?',
      options: [
        'as cheap as possible', 'mid-range',
        "I'll splurge on the right trip",
        "money isn't a factor", 'depends on the trip',
      ],
      memoryTags: ['#travel-budget'],
    },
    {
      type: 'text-input',
      question: 'Dream trip?',
      placeholder:
        'Backpacking Japan for a month, or renting a villa in Amalfi with friends',
      memoryTags: ['#dream-trip'],
    },
  ],
}

// ─── Flow 06c · Entertainment ─────────────────────────────────────
const entertainment: Flow = {
  id: 'entertainment',
  title: 'Entertainment',
  category: 'Preferences — Entertainment',
  introCopy:
    "Music, movies, books, games — the stuff you're into helps Weave recommend and reference things you'll actually care about.",
  icon: '🎬',
  screens: [
    {
      type: 'intro',
      question: 'Entertainment',
      introCopy:
        "Music, movies, books, games — the stuff you're into helps Weave recommend and reference things you'll actually care about.",
    },
    {
      type: 'multi-select',
      question: "Music you're into?",
      options: [
        'pop', 'hip-hop', 'r&b', 'rock', 'indie', 'electronic',
        'jazz', 'classical', 'country', 'latin', 'k-pop', 'metal',
        'lo-fi', 'podcasts-over-music', 'a bit of everything',
      ],
      memoryTags: ['#music-taste'],
    },
    {
      type: 'multi-select',
      question: 'Movie & TV genres?',
      options: [
        'comedy', 'drama', 'thriller', 'sci-fi', 'horror',
        'documentary', 'romance', 'action', 'anime', 'reality TV',
        'true crime', 'fantasy', 'limited series', 'classic films',
      ],
      memoryTags: ['#movie-tv-genres'],
    },
    {
      type: 'text-input',
      question: 'What are you watching right now?',
      placeholder:
        'Rewatching The Office for the 4th time and just started Severance',
      memoryTags: ['#currently-watching'],
    },
    {
      type: 'multi-select',
      question: 'What do you read / listen to?',
      options: [
        'fiction', 'non-fiction', 'self-help', 'sci-fi novels',
        'biographies', 'business books', 'podcasts', 'audiobooks',
        'newsletters', 'manga', "I don't really read",
      ],
      memoryTags: ['#reading-listening'],
    },
    {
      type: 'binary-choice',
      question: 'Are you a gamer?',
      memoryTags: ['#is-gamer'],
      skipRules: [{ values: ['no'], targetIndex: 7 }],
    },
    {
      type: 'multi-select',
      question: 'What kind of games?',
      options: [
        'console', 'PC', 'mobile', 'board games', 'card games',
        'RPGs', 'shooters', 'puzzle', 'sports', 'indie',
        'multiplayer', 'single-player',
      ],
      memoryTags: ['#gaming-preferences'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Any guilty pleasures?',
      placeholder:
        "I know every word to High School Musical and I'm not sorry",
      memoryTags: ['#entertainment-notes'],
    },
  ],
}

// ─── Flow 06d · Shopping & Hobbies ────────────────────────────────
const shoppingHobbies: Flow = {
  id: 'shopping-hobbies',
  title: 'Shopping & Hobbies',
  category: 'Preferences — Shopping',
  introCopy:
    'Your style, your brands, your weekend obsessions. Helps Weave with recommendations, gift ideas, and knowing what makes you tick.',
  icon: '🛍️',
  screens: [
    {
      type: 'intro',
      question: 'Shopping & Hobbies',
      introCopy:
        'Your style, your brands, your weekend obsessions. Helps Weave with recommendations, gift ideas, and knowing what makes you tick.',
    },
    {
      type: 'multi-select',
      question: 'Your hobbies?',
      options: [
        'cooking', 'fitness', 'hiking', 'photography', 'gaming',
        'reading', 'gardening', 'crafts / DIY', 'music (playing)',
        'art', 'writing', 'sports', 'yoga / meditation',
        'collecting', 'travel', 'volunteering', 'coding', 'other',
      ],
      memoryTags: ['#hobbies'],
    },
    {
      type: 'single-select',
      question: 'How do you feel about shopping?',
      options: [
        "love it — it's a hobby", 'I buy what I need',
        'I hate shopping', 'online only', "I'm a deal hunter",
      ],
      memoryTags: ['#shopping-attitude'],
    },
    {
      type: 'multi-select',
      question: 'Brands you love?',
      options: [
        'apple', 'nike', 'patagonia', 'amazon', 'target', 'zara',
        'lululemon', "trader joe's", 'IKEA', 'costco',
        'whole foods', 'aesop', 'other',
      ],
      memoryTags: ['#favorite-brands'],
    },
    {
      type: 'single-select',
      question: 'Price sensitivity?',
      options: [
        'always looking for deals', 'price-conscious but flexible',
        "I'll pay for quality", "price doesn't factor in much",
      ],
      memoryTags: ['#price-sensitivity'],
    },
    {
      type: 'multi-select',
      question: 'Your style aesthetic?',
      options: [
        'minimalist', 'streetwear', 'classic / preppy', 'athleisure',
        'vintage', 'bohemian', 'business casual', 'techwear',
        "I don't think about it",
      ],
      memoryTags: ['#style-aesthetic'],
    },
    {
      type: 'text-input',
      question: 'Anything else about your taste?',
      placeholder:
        "I'm a sneakerhead, I thrift 90% of my clothes, and I'm weirdly loyal to Muji",
      memoryTags: ['#taste-notes'],
    },
  ],
}

// ─── Flow 08 · Money & Finances ───────────────────────────────────
const moneyFinances: Flow = {
  id: 'money-finances',
  title: 'Money & Finances',
  category: 'Financial Context',
  introCopy:
    'Money touches almost every decision. This stays private and helps Weave give advice that actually fits your situation.',
  icon: '💰',
  screens: [
    {
      type: 'intro',
      question: 'Money & Finances',
      introCopy:
        'Money touches almost every decision. This stays private and helps Weave give advice that actually fits your situation.',
    },
    {
      type: 'single-select',
      question: "How's your financial situation?",
      options: [
        'comfortable', 'doing okay', 'tight right now',
        'saving aggressively', "it's complicated",
      ],
      memoryTags: ['#financial-situation'],
    },
    {
      type: 'multi-select',
      question: 'Financial goals?',
      options: [
        'save for a house', 'pay off debt', 'build an emergency fund',
        'retire early', 'invest more', 'save for travel',
        "kids' education", 'start a business', 'just stay afloat',
        'no specific goals',
      ],
      memoryTags: ['#financial-goals'],
    },
    {
      type: 'single-select',
      question: 'How do you earn money?',
      options: [
        'salaried full-time', 'freelance / contract',
        'business owner', 'variable / commission',
        'multiple income streams', 'retired', 'other',
      ],
      memoryTags: ['#income-type'],
    },
    {
      type: 'checkbox',
      question: 'Big recurring expenses?',
      options: [
        'rent / mortgage', 'car payment', 'student loans',
        'childcare', 'insurance premiums',
        'subscriptions (streaming, apps)', 'memberships (gym, clubs)',
        'healthcare costs', 'none significant',
      ],
      memoryTags: ['#recurring-expenses'],
    },
    {
      type: 'single-select',
      question: 'Investment style?',
      options: [
        'conservative — I play it safe',
        'moderate — balanced approach',
        'aggressive — I chase growth',
        "I don't really invest", 'just getting started',
      ],
      memoryTags: ['#investment-risk'],
    },
    {
      type: 'single-select',
      question: 'How do you think about money?',
      options: [
        "I'm frugal", 'generous — I like treating people',
        'strategic — every dollar has a job',
        'anxious — it stresses me out',
        'pretty relaxed about it',
      ],
      memoryTags: ['#money-mindset'],
    },
    {
      type: 'multi-select',
      question: 'Budget categories that matter most?',
      options: [
        'food & dining', 'housing', 'travel', 'health & fitness',
        'education', 'entertainment', 'clothing',
        'saving & investing', 'family', 'tech & gadgets',
        'giving / charity',
      ],
      memoryTags: ['#budget-priorities'],
    },
  ],
}

// ─── Flow 09 · Health & Wellness ──────────────────────────────────
const healthWellness: Flow = {
  id: 'health-wellness',
  title: 'Health & Wellness',
  category: 'Health & Wellness',
  introCopy:
    'From food choices to energy levels — your health context helps Weave avoid bad suggestions and give better ones.',
  icon: '🏥',
  screens: [
    {
      type: 'intro',
      question: 'Health & Wellness',
      introCopy:
        'From food choices to energy levels — your health context helps Weave avoid bad suggestions and give better ones.',
    },
    {
      type: 'binary-choice',
      question: 'Any health conditions?',
      skipRules: [{ values: ['no'], targetIndex: 3 }],
    },
    {
      type: 'text-input',
      question: 'What conditions do you manage?',
      placeholder: 'Asthma (well-controlled), ADHD — on medication for both',
      memoryTags: ['#health-conditions'],
      isSubScreen: true,
    },
    {
      type: 'binary-choice',
      question: 'Any allergies?',
      skipRules: [{ values: ['no'], targetIndex: 5 }],
    },
    {
      type: 'checkbox',
      question: 'What are you allergic to?',
      options: [
        'pollen / seasonal', 'dust mites', 'pet dander', 'nuts',
        'shellfish', 'dairy', 'gluten', 'medications',
        'latex', 'other',
      ],
      memoryTags: ['#allergies'],
      isSubScreen: true,
    },
    {
      type: 'binary-choice',
      question: 'Currently taking medications?',
      memoryTags: ['#takes-medication'],
      skipRules: [{ values: ['no'], targetIndex: 7 }],
    },
    {
      type: 'text-input',
      question: 'What medications?',
      placeholder: 'Adderall 20mg, Flonase, vitamin D',
      memoryTags: ['#medications'],
      isSubScreen: true,
    },
    {
      type: 'multi-select',
      question: 'Fitness routine?',
      options: [
        'running', 'weight training', 'yoga', 'pilates', 'cycling',
        'swimming', 'hiking', 'walking', 'team sports', 'HIIT',
        'martial arts', 'dance', 'none right now',
      ],
      memoryTags: ['#fitness-routine'],
    },
    {
      type: 'single-select',
      question: "How's your sleep?",
      options: [
        'great — 7-8 hours solid', 'decent — could be better',
        'inconsistent', 'bad — I struggle',
        "I'm a night owl", "I'm an early bird",
      ],
      memoryTags: ['#sleep-patterns'],
    },
    {
      type: 'multi-select',
      question: 'Wellness practices?',
      options: [
        'meditation', 'therapy', 'journaling', 'breathwork',
        'acupuncture', 'massage', 'supplements', 'cold plunges',
        'sauna', 'none',
      ],
      memoryTags: ['#wellness-practices'],
    },
    {
      type: 'text-input',
      question: 'How would you describe your health?',
      placeholder:
        'Pretty healthy, working on being more consistent with exercise and sleeping better',
      memoryTags: ['#health-self-description'],
    },
  ],
}

// ─── Flow 10 · What You Know ──────────────────────────────────────
const whatYouKnow: Flow = {
  id: 'what-you-know',
  title: 'What You Know',
  category: 'Knowledge & Expertise',
  introCopy:
    'This helps Weave know when to explain things simply vs. go deep — and what to never dumb down.',
  icon: '🧠',
  screens: [
    {
      type: 'intro',
      question: 'What You Know',
      introCopy:
        'This helps Weave know when to explain things simply vs. go deep — and what to never dumb down.',
    },
    {
      type: 'multi-select',
      question: 'Areas of deep expertise?',
      options: [
        'software / engineering', 'design', 'product management',
        'marketing', 'finance', 'law', 'medicine', 'science',
        'education', 'writing', 'sales', 'data / analytics',
        'operations', 'music', 'cooking', 'fitness',
        'real estate', 'psychology', 'other',
      ],
      memoryTags: ['#deep-expertise'],
    },
    {
      type: 'multi-select',
      question: 'Things you know casually?',
      options: [
        'investing', 'nutrition', 'politics', 'history',
        'philosophy', 'photography', 'home improvement', 'cars',
        'fashion', 'wine / spirits', 'gardening',
        'sports analytics', 'crypto', 'AI', 'other',
      ],
      memoryTags: ['#casual-knowledge'],
    },
    {
      type: 'text-input',
      question: 'What are you learning right now?',
      placeholder: 'Trying to get better at SQL and learning to play piano',
      memoryTags: ['#currently-learning'],
    },
    {
      type: 'multi-select',
      question: 'Technical comfort level?',
      subtitle: 'Select all that are advanced',
      options: [
        'coding', 'spreadsheets / data', 'finance & accounting',
        'medical / health', 'legal', 'design tools',
        'AI & machine learning', 'statistics', 'none of these',
      ],
      memoryTags: ['#technical-literacy'],
    },
    {
      type: 'text-input',
      question: 'Education & credentials?',
      placeholder:
        'BS in CS from Georgia Tech, PMP certified, bunch of random Coursera certs',
      memoryTags: ['#credentials'],
    },
    {
      type: 'text-input',
      question: 'What do you want to learn more about?',
      placeholder:
        'AI strategy, investing fundamentals, and honestly just how to be a better manager',
      memoryTags: ['#learning-goals'],
    },
  ],
}

// ─── Flow 11 · What Matters to You ────────────────────────────────
const whatMatters: Flow = {
  id: 'what-matters',
  title: 'What Matters to You',
  category: 'Values & Beliefs',
  introCopy:
    "Understanding what you care about helps Weave give advice that actually aligns with your priorities — not generic platitudes.",
  icon: '💎',
  screens: [
    {
      type: 'intro',
      question: 'What Matters to You',
      introCopy:
        "Understanding what you care about helps Weave give advice that actually aligns with your priorities — not generic platitudes.",
    },
    {
      type: 'multi-select',
      question: 'Core values?',
      options: [
        'family', 'independence', 'career growth', 'creativity',
        'stability', 'adventure', 'honesty', 'loyalty', 'health',
        'wealth', 'community', 'learning', 'faith', 'freedom',
        'making an impact', 'work-life balance',
      ],
      memoryTags: ['#core-values'],
    },
    {
      type: 'multi-select',
      question: 'Ethical things that affect your decisions?',
      options: [
        'sustainability', 'privacy', 'diversity & inclusion',
        'animal welfare', 'supporting small business', 'fair labor',
        'organic / natural', 'data ethics', 'none particularly',
      ],
      memoryTags: ['#ethical-considerations'],
    },
    {
      type: 'single-select',
      question: 'How do you make decisions?',
      options: [
        'gut feeling — I go with instinct',
        'analytical — I weigh all the options',
        'fast — I decide and move',
        'slow — I need time to think',
        'I ask people I trust',
      ],
      memoryTags: ['#decision-style'],
    },
    {
      type: 'single-select',
      question: "When there's a tradeoff, you optimize for…?",
      options: [
        'saving time', 'saving money', 'quality', 'convenience',
        'the experience', 'avoiding risk', 'it depends',
      ],
      memoryTags: ['#optimization-preference'],
    },
    {
      type: 'multi-select',
      question: 'Causes or communities you care about?',
      options: [
        'climate / environment', 'education', 'mental health',
        'racial justice', 'LGBTQ+ rights', 'poverty / homelessness',
        'tech ethics', 'local community', 'arts & culture',
        'animal rescue', 'disability rights', 'veteran support',
        'none in particular',
      ],
      memoryTags: ['#causes'],
    },
    {
      type: 'text-input',
      question: 'Any topics Weave should be sensitive about?',
      placeholder:
        "I'd rather not get recommendations involving alcohol — I'm in recovery",
      memoryTags: ['#sensitivities'],
    },
  ],
}

// ─── Flow 12 · Your Digital Life ──────────────────────────────────
const digitalLife: Flow = {
  id: 'digital-life',
  title: 'Your Digital Life',
  category: 'Digital Life & Tools',
  introCopy:
    "'Put this in my notes' means nothing without knowing your setup. Help Weave understand your digital world.",
  icon: '📱',
  screens: [
    {
      type: 'intro',
      question: 'Your Digital Life',
      introCopy:
        "'Put this in my notes' means nothing without knowing your setup. Help Weave understand your digital world.",
    },
    {
      type: 'multi-select',
      question: 'Your devices?',
      options: [
        'iPhone', 'Android', 'Mac', 'Windows PC', 'iPad',
        'Android tablet', 'Apple Watch', 'Linux', 'Chromebook',
      ],
      memoryTags: ['#devices'],
    },
    {
      type: 'multi-select',
      question: 'Apps you live in?',
      options: [
        'iMessage', 'WhatsApp', 'Slack', 'Gmail', 'Outlook',
        'Notion', 'Apple Notes', 'Google Docs', 'Spotify',
        'Instagram', 'Twitter/X', 'TikTok', 'YouTube', 'ChatGPT',
        'other',
      ],
      memoryTags: ['#key-apps'],
    },
    {
      type: 'single-select',
      question: 'Cloud storage?',
      options: [
        'iCloud', 'Google Drive', 'Dropbox', 'OneDrive',
        'multiple', 'none / not sure',
      ],
      memoryTags: ['#cloud-storage'],
    },
    {
      type: 'single-select',
      question: 'Where do you take notes?',
      options: [
        'Apple Notes', 'Notion', 'Google Docs', 'Obsidian',
        'pen and paper', "I don't really", 'other',
      ],
      memoryTags: ['#note-taking'],
    },
    {
      type: 'binary-choice',
      question: 'Use a password manager?',
      memoryTags: ['#has-password-manager'],
      skipRules: [{ values: ['no'], targetIndex: 7 }],
    },
    {
      type: 'single-select',
      question: 'Which one?',
      options: [
        '1Password', 'LastPass', 'Dashlane', 'Apple Keychain',
        'Bitwarden', 'other',
      ],
      memoryTags: ['#password-manager'],
      isSubScreen: true,
    },
    {
      type: 'binary-choice',
      question: 'Have a smart home setup?',
      memoryTags: ['#has-smart-home'],
      skipRules: [{ values: ['no'], targetIndex: 9 }],
    },
    {
      type: 'multi-select',
      question: "What's in your setup?",
      options: [
        'alexa', 'google home', 'homekit / siri', 'ring', 'nest',
        'hue', 'smartthings', 'other',
      ],
      memoryTags: ['#smart-home'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Digital pain points?',
      placeholder:
        'Too many tabs, can never find old files, notifications are out of control',
      memoryTags: ['#digital-pain-points'],
    },
    {
      type: 'text-input',
      question: 'How would you want your apps connected?',
      placeholder:
        'Wish my calendar talked to my to-do list and my notes auto-organized themselves',
      memoryTags: ['#app-connection-wishes'],
    },
  ],
}

// ─── Flow 13 · Your Space ─────────────────────────────────────────
const yourSpace: Flow = {
  id: 'your-space',
  title: 'Your Space',
  category: 'Home & Environment',
  introCopy:
    'Where you are shapes what Weave can suggest — from commute tips to local recs. Quick snapshot of your physical world.',
  icon: '🏠',
  screens: [
    {
      type: 'intro',
      question: 'Your Space',
      introCopy:
        'Where you are shapes what Weave can suggest — from commute tips to local recs. Quick snapshot of your physical world.',
    },
    {
      type: 'single-select',
      question: "What's your living situation?",
      options: [
        'apartment', 'house', 'condo', 'shared / roommates',
        'with family', 'dorm', 'other',
      ],
      memoryTags: ['#home-type'],
    },
    {
      type: 'text-input',
      question: 'Important places in your life?',
      placeholder:
        "Office is downtown, gym on 5th, parents are in Jersey, I'm always at Blue Bottle on Saturdays",
      memoryTags: ['#important-locations'],
    },
    {
      type: 'multi-select',
      question: 'How do you get around?',
      options: [
        'car', 'public transit', 'bike', 'walk',
        'rideshare (Uber/Lyft)', 'scooter', 'motorcycle',
        'work from home mostly',
      ],
      memoryTags: ['#transportation'],
    },
    {
      type: 'text-input',
      question: 'Describe your neighborhood?',
      placeholder:
        'Walkable, lots of restaurants, kinda noisy but I love it',
      memoryTags: ['#neighborhood'],
    },
    {
      type: 'single-select',
      question: 'Work setup?',
      options: [
        'office full-time', 'hybrid', 'fully remote',
        'co-working space', 'coffee shops', 'different every day',
      ],
      memoryTags: ['#workspace-setup'],
    },
    {
      type: 'text-input',
      question: 'Geographic preferences or constraints?',
      placeholder:
        "I need to stay within 30 min of my kid's school, love being near water",
      memoryTags: ['#geographic-preferences'],
    },
  ],
}

// ─── Flow 14 · Your Important Stuff ──────────────────────────────
const importantStuff: Flow = {
  id: 'important-stuff',
  title: 'Your Important Stuff',
  category: 'Documents & Records',
  introCopy:
    "The things you need to find, reference, and reuse. Weave can remember them so you don't have to dig.",
  icon: '📋',
  screens: [
    {
      type: 'intro',
      question: 'Your Important Stuff',
      introCopy:
        "The things you need to find, reference, and reuse. Weave can remember them so you don't have to dig.",
    },
    {
      type: 'checkbox',
      question: 'What docs do you need to track?',
      options: [
        'IDs & passports', 'insurance policies', 'warranties',
        'contracts & leases', 'tax documents', 'medical records',
        'vehicle registration', 'none right now',
      ],
      memoryTags: ['#important-docs'],
    },
    {
      type: 'binary-choice',
      question: 'Have account numbers or memberships to remember?',
      skipRules: [{ values: ['no'], targetIndex: 4 }],
    },
    {
      type: 'text-input',
      question: 'List the key ones',
      placeholder: 'Costco #4521, United MileagePlus, AAA',
      memoryTags: ['#account-memberships'],
      isSubScreen: true,
    },
    {
      type: 'binary-choice',
      question: 'Have travel docs to store?',
      skipRules: [{ values: ['no'], targetIndex: 6 }],
    },
    {
      type: 'text-input',
      question: 'What travel docs?',
      placeholder: 'Passport exp 2028, Global Entry, Delta SkyMiles #12345',
      memoryTags: ['#travel-docs'],
      isSubScreen: true,
    },
    {
      type: 'multi-select',
      question: 'What kind of stuff do you save and reference?',
      options: [
        'recipes', 'how-to guides', 'articles & research',
        'bookmarks', 'project reference docs', 'meeting notes',
        'screenshots', 'saved posts', 'gift ideas', 'wishlists',
        'none really',
      ],
      memoryTags: ['#reference-material-types'],
    },
    {
      type: 'binary-choice',
      question: 'Working on any active projects?',
      skipRules: [{ values: ['no'], targetIndex: 9 }],
    },
    {
      type: 'text-input',
      question: 'What projects?',
      placeholder: 'Kitchen remodel, wedding planning, Q2 product launch',
      memoryTags: ['#active-projects'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Anything else Weave should hold onto for you?',
      placeholder:
        "My Wi-Fi password is on the fridge, my locker combo is 24-8-16, and I always forget my parking spot",
      memoryTags: ['#misc-reference'],
    },
  ],
}

// ─── Flow 16 · Your Goals ────────────────────────────────────────
const yourGoals: Flow = {
  id: 'your-goals',
  title: 'Your Goals',
  category: 'Goals & Aspirations',
  introCopy:
    'Where are you headed? Knowing your goals helps Weave give advice that actually moves the needle.',
  icon: '🎯',
  screens: [
    {
      type: 'intro',
      question: 'Your Goals',
      introCopy:
        'Where are you headed? Knowing your goals helps Weave give advice that actually moves the needle.',
    },
    {
      type: 'multi-select',
      question: 'What are you focused on right now?',
      options: [
        'career growth', 'health & fitness', 'relationships',
        'financial freedom', 'learning new skills', 'creativity',
        'travel & adventure', 'starting a business', 'mental health',
        'giving back', 'finding balance', 'other',
      ],
      memoryTags: ['#current-priorities'],
    },
    {
      type: 'text-input',
      question: "What's your biggest goal this year?",
      placeholder: 'Get promoted, run a marathon, save $20K, launch my side project',
      memoryTags: ['#yearly-goal'],
    },
    {
      type: 'single-select',
      question: 'Where do you see yourself in 5 years?',
      options: [
        'same path, leveled up',
        'completely different career',
        'my own business',
        'more balanced life',
        'living somewhere new',
        "honestly, I don't know yet",
      ],
      memoryTags: ['#five-year-vision'],
    },
    {
      type: 'text-input',
      question: "What's on your bucket list?",
      placeholder: 'Visit Japan, write a book, learn to surf, speak at a conference',
      memoryTags: ['#bucket-list'],
    },
    {
      type: 'single-select',
      question: 'What does success mean to you?',
      options: [
        'financial independence',
        'doing work I love',
        'strong relationships',
        'freedom and flexibility',
        'making an impact',
        'a mix of everything',
      ],
      memoryTags: ['#success-definition'],
    },
    {
      type: 'binary-choice',
      question: 'Do you set formal goals?',
      memoryTags: ['#sets-formal-goals'],
      skipRules: [{ values: ['no'], targetIndex: 8 }],
    },
    {
      type: 'single-select',
      question: 'How do you track them?',
      options: [
        'written goals / journal', 'app or spreadsheet',
        'vision board', 'accountability partner',
        'just in my head', 'OKRs / formal framework',
      ],
      memoryTags: ['#goal-tracking-method'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: "What's holding you back?",
      placeholder: 'Time, money, fear of failure, not knowing where to start',
      memoryTags: ['#obstacles'],
    },
  ],
}

// ─── Flow 17 · Daily Routine ─────────────────────────────────────
const dailyRoutine: Flow = {
  id: 'daily-routine',
  title: 'Daily Routine',
  category: 'Lifestyle',
  introCopy:
    'Your day-to-day rhythms shape what Weave can help with — from morning planning to evening wind-down.',
  icon: '⏰',
  screens: [
    {
      type: 'intro',
      question: 'Daily Routine',
      introCopy:
        'Your day-to-day rhythms shape what Weave can help with — from morning planning to evening wind-down.',
    },
    {
      type: 'single-select',
      question: 'When do you usually wake up?',
      options: [
        'before 6am', '6–7am', '7–8am', '8–9am',
        '9–10am', 'after 10am', 'it varies a lot',
      ],
      memoryTags: ['#wake-time'],
    },
    {
      type: 'multi-select',
      question: 'Morning habits?',
      options: [
        'coffee first', 'exercise', 'meditation', 'shower',
        'check phone', 'breakfast', 'journaling', 'walk the dog',
        'scroll social media', 'straight to work', 'none — chaos',
      ],
      memoryTags: ['#morning-habits'],
    },
    {
      type: 'single-select',
      question: 'When do you start working?',
      options: [
        'before 8am', '8–9am', '9–10am', '10am+',
        'varies by day', "I don't have set hours",
      ],
      memoryTags: ['#work-start-time'],
    },
    {
      type: 'single-select',
      question: 'Lunch situation?',
      options: [
        'meal prep', 'buy lunch out', 'skip it often',
        'eat at my desk', 'proper lunch break', 'graze all day',
      ],
      memoryTags: ['#lunch-habit'],
    },
    {
      type: 'single-select',
      question: 'Energy peak?',
      subtitle: 'When are you most productive?',
      options: [
        'early morning', 'late morning', 'early afternoon',
        'late afternoon', 'evening', 'night owl — after 9pm',
      ],
      memoryTags: ['#peak-energy'],
    },
    {
      type: 'multi-select',
      question: 'Evening wind-down?',
      options: [
        'cook dinner', 'watch TV / streaming', 'read', 'exercise',
        'time with family', 'social plans', 'gaming', 'side projects',
        'bath / skincare', 'scroll phone', 'nothing — I crash',
      ],
      memoryTags: ['#evening-routine'],
    },
    {
      type: 'single-select',
      question: 'When do you go to bed?',
      options: [
        'before 10pm', '10–11pm', '11pm–midnight',
        'midnight–1am', 'after 1am', 'inconsistent',
      ],
      memoryTags: ['#bedtime'],
    },
    {
      type: 'text-input',
      question: 'Anything else about your routine?',
      placeholder: 'I take a 20-min nap at 2pm, Wednesdays are my no-meeting day',
      memoryTags: ['#routine-notes'],
    },
  ],
}

// ─── Export All Flows ─────────────────────────────────────────────
export const allFlows: Flow[] = [
  aboutYou,
  yourWork,
  howYouCommunicate,
  yourPeople,
  foodDining,
  travel,
  entertainment,
  shoppingHobbies,
  moneyFinances,
  healthWellness,
  whatYouKnow,
  whatMatters,
  digitalLife,
  yourSpace,
  importantStuff,
  yourGoals,
  dailyRoutine,
]
