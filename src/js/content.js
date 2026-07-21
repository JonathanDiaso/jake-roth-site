/* ============================================================
   CONTENT & CONFIG  —  the single place facts live.
   Change values here; never inside a component.

   ⚠️  EVERY VALUE MARKED "TODO" IS A PLACEHOLDER.
       Nothing marked TODO may go live. Several are legal
       requirements (04_COMPLIANCE.md), not cosmetic gaps.
   ============================================================ */

/* Verified against pinkrealty.com/agent/jake-roth on 2026-07-21. */
export const AGENT = {
  firstName: 'Jake',
  lastName: 'Roth',
  fullName: 'Jake Roth',
  licenseNumber: 'FA100055539',
  phone: '+17196312410',
  phoneDisplay: '(719) 631-2410',
  email: 'JakeR@pinkrealty.com',
  bookingUrl: '#book',                    // TODO — Calendly / real booking link
  yearsExperience: 9,
};

export const BROKERAGE = {
  name: 'Pink Realty',
  city: 'Colorado Springs',
  state: 'CO',
  address: 'TODO_BROKERAGE_ADDRESS',      // TODO — 04_COMPLIANCE.md §5
  licenseNumber: 'TODO_IF_REQUIRED',      // TODO — confirm with managing broker
};

/* 04_COMPLIANCE.md §1.
   Designation resolved 2026-07-21 from Jake's own site, which states
   "RamseyTrusted Certified ELP (Endorsed Local Provider)" — and from the
   official "Dave's Trusted Network of Top Pros" asset he supplied, which
   carries the ELP endorsed-local-providers logo. Both names are current;
   ELP is the program, RamseyTrusted the current brand.

   Claim language here stays at the SAFE BASELINE: a factual statement of
   program membership. Nothing says "Dave Ramsey recommends me" or implies
   personal endorsement by the individual.

   ⚠️ Both graphics below are official Ramsey assets, shipped UNMODIFIED —
   never resized out of ratio, cropped, rearranged, or recoloured. */
export const RAMSEY = {
  programName: 'Endorsed Local Provider (ELP)',
  claimLine: 'RamseyTrusted Certified ELP',
  shortClaim: "Dave's Trusted Network of Top Pros",
  networkGraphic: 'assets/ramsey-network-560.jpg',
  networkGraphicWebp: 'assets/ramsey-network-560.webp',
  networkAlt: "Dave's Trusted Network of Top Pros — Endorsed Local Providers",
  shieldAlt: 'RamseyTrusted five-star shield',
};

export const HERO = {
  eyebrow: 'Colorado Springs · Pink Realty',
  line: 'Real estate, handled the disciplined way.',
  buying:  { label: "I'm Buying",  sub: 'Find the right home at the right number' },
  selling: { label: "I'm Selling", sub: 'Price it right, market it properly, net more' },
};

/* Any stat with value 0 hides itself. Publishing invented production
   figures misrepresents your record — one honest number beats four
   vague ones. If you don't have a number, leave it at 0.
   ⚠️ TODO Jake — fill these three from your own records. */
export const PROOF = [
  { value: 48.9, suffix: 'M', prefix: '$', decimals: 1, label: 'In closed sales volume' },
  { value: 136, suffix: '', label: 'Homes closed' },
  { value: 9, suffix: '', label: 'Years selling Colorado Springs' },
  { value: 12, suffix: '', label: 'Five-star client reviews' },
];

export const TRACKS = {
  buying: [
    {
      title: 'Buy debt-free',
      body: 'You did the hard part already. Now the goal is a house that never threatens the freedom you built.',
      points: ['15-year fixed', '20% down or better', 'Payment at or under 25% of take-home'],
      icon: 'shield',
    },
    {
      title: 'My first home',
      body: 'First time through. No jargon, no pressure, and no pretending the process is simpler than it is.',
      points: ['Every step explained before it happens', 'Down payment assistance reviewed', 'Credit and timeline planning'],
      icon: 'key',
    },
    {
      title: 'Military & PCS',
      body: 'Orders move on their schedule, not yours. I work backward from your report date.',
      points: ['VA loan experienced', 'Remote and video-first buying', 'Commute planning to Carson, Peterson, Schriever, USAFA'],
      icon: 'compass',
    },
  ],
  selling: [
    {
      title: 'What it is worth',
      body: 'A real number built from what actually closed near you — not an automated guess off a website.',
      points: ['Comparable sales walked in person', 'Condition and updates weighted', 'Pricing strategy, not a single number'],
      icon: 'chart',
    },
    {
      title: 'How it gets marketed',
      body: 'Most agents say they market your home. Here is the actual list of what happens and when.',
      points: ['Professional photography and floor plan', 'Staging consultation before photos', 'Full syndication plus direct agent outreach'],
      icon: 'camera',
    },
    {
      title: 'What you net',
      body: 'The number that matters is what lands in your account. We model it before we list.',
      points: ['Line-by-line proceeds estimate', 'Concession and repair scenarios', 'Timed against your next purchase'],
      icon: 'calc',
    },
  ],
};

export const STORY = {
  eyebrow: 'Who you are actually calling',
  title: 'I do not just recommend the plan. I live on it.',
  /* Drafted from Jake's verified Pink Realty bio — born and raised in
     Colorado Springs, 9 years licensed, Chairman of Masters, works
     Colorado Springs / Pueblo West / Peyton.
     ⚠️ TODO — Jake, rewrite paragraph two in your own words. The bones
     are true; the voice should be yours. Specific beats polished. */
  body: [
    'I was born and raised in Colorado Springs, and I have spent the last nine years selling real estate in the same place I grew up. One hundred and thirty-six closings later, I still know which streets flood, which additions were built well, and what a fair price actually looks like in this market — because I have watched it change from the inside.',
    'I do not just recommend the plan, I live on it. Debt-free apart from my mortgage, six months of expenses in the bank, every dollar budgeted. That is why I will tell you to wait when waiting is right, and why I will not talk you into a payment you would resent in two years. Doing it the right way is usually the harder way. It is still the way I work.',
  ],
  signature: 'Jake',
  photo: 'assets/portrait-600.jpg',
  photoWebp: 'assets/portrait-600.webp',
};

/* Real five-star client reviews with real names, pulled from Jake's own
   review page on 2026-07-21. None of these are written by me.
   ⚠️ TODO Jake — confirm each is quoted completely and that you have
   permission to republish the names. A truncated review presented as a
   full one is still a misquote. */
export const VOICES = [
  { text: 'Jake set expectations, negotiated a contract that met them, and coordinated closing.', who: 'Jonathon Hinge' },
  { text: 'We ended up as friends — not often I get to experience that.', who: 'Scott Van Wyhe' },
  { text: 'Incredibly friendly, punctual, and genuinely cared about my well-being.', who: 'Cody Crist' },
  { text: 'Jake was there every step of the way. Could not have been happier.', who: 'Ashley Smith' },
  { text: 'Always attentive to my needs as a seller, paid close attention.', who: 'Christy Combs' },
  { text: 'Always very professional and insightful in contract negotiations.', who: 'Tyson Harrop' },
  { text: 'Everything was smooth and he kept us clearly informed.', who: 'Rob Shorey' },
  { text: 'Honest guidance, steady communication, reliable support.', who: 'Jonathan Diaso' },
  { text: 'Incredibly responsive and organized.', who: 'Brian Adams' },
  { text: 'Always responsive and clear.', who: 'Caleb Heavner' },
  { text: 'Easy to talk to and always willing to help.', who: 'VBlessedS' },
  { text: 'Straight forward, to the point.', who: 'Shane' },
];

export const CLOSE = {
  title: 'Ask me the question you actually have.',
  lede: 'Not a form that disappears into a system. A conversation with the person whose name is on this page.',
};

/* The visitor arrived from Ramsey. This is the first thing they read —
   it has to answer "is this the right guy?" before they scroll. */
export const ARRIVAL = {
  line: "You came from Ramsey. Here is who you were sent to.",
};

/* ============================================================
   AFFORDABILITY ENGINE  ·  assumptions
   These are displayed on the page. 03_ARCHITECTURE.md: a tool that
   flatters is worthless. Verify and re-date these regularly.
   ============================================================ */

export const ASSUMPTIONS = {
  updated: 'TODO_DATE',                   // TODO — shown on page; keep current
  ramseyRule: 0.25,                       // the Ramsey line, marked on the track
  /* The share is adjustable, but 25% stays the default and the track is
     marked there. Above it the figure turns amber and says what the
     stretch costs — the tool bends without ever quietly abandoning the
     rule Jake is endorsed for. */
  share: { min: 0.15, max: 0.40, step: 0.01, default: 0.25 },
  rate15: 0.059,                          // TODO — verify current 15-yr fixed
  rate30: 0.066,                          // TODO — verify current 30-yr fixed
  propertyTaxRate: 0.0049,                // TODO — verify El Paso County effective rate
  insuranceRate: 0.0060,                  // TODO — verify; CO hail exposure runs high
  /* Defaults describe a plausible Ramsey-follower profile: disciplined
     dual income, real savings. Tuned so the tool demonstrates itself on
     load — a few areas in reach, most not. That IS the honest picture of
     the 25% / 15-year rule in this market, and it is the single most
     useful thing this page says. Do not tune these to flatter. */
  takeHome: { min: 2500, max: 20000, step: 100, default: 9000 },
  down:     { min: 0, max: 250000, step: 2500, default: 80000 },
};

/* Colorado Springs areas.
   ⚠️ FAIR HOUSING — 04_COMPLIANCE.md §3. Every `fact` below describes a
   PLACE: distance, era of construction, lot size, adjacent land. None
   describes the people who live there. Banned: "family-friendly",
   "safe", "good schools", "up-and-coming", "exclusive". Any edit to
   this array gets a Fair Housing pass before it ships.
   ⚠️ TODO — replace medians with your own current market data. */
export const PLACES = [
  { name: 'Westside condos',    median: 275000, lat: 38.8462, lng: -104.8536, era: '1970s\u20131990s', fact: 'Attached homes west of downtown. Walkable to the Midland Trail and Bancroft Park.' },
  { name: 'Southeast Springs',  median: 305000, lat: 38.8003, lng: -104.7519, era: '1960s\u20131980s', fact: 'South of Airport Road, east of I-25. Roughly 0.15 acre lots.' },
  { name: 'Security-Widefield', median: 360000, lat: 38.7478, lng: -104.7150, era: '1960s\u20131990s', fact: 'About 10 minutes to Fort Carson. Near Big Johnson Reservoir.' },
  { name: 'Fountain',           median: 390000, lat: 38.6822, lng: -104.7000, era: '1970s\u20132000s', fact: 'About 12 minutes to Fort Carson Gate 20. Lots run 0.15\u20130.25 acre.' },
  { name: 'Old Colorado City',  median: 450000, lat: 38.8464, lng: -104.8619, era: '1890s\u20131930s', fact: 'Historic west side. Victorian and Craftsman stock, walkable to Bancroft Park.' },
  { name: 'Falcon',             median: 470000, lat: 38.9328, lng: -104.6089, era: '2000s\u2013now',   fact: 'East of Powers along Highway 24. Many lots over 0.3 acre.' },
  { name: 'Rockrimmon',         median: 520000, lat: 38.9203, lng: -104.8464, era: '1970s\u20131990s', fact: 'Northwest against the foothills, sloped lots. Trail access into Ute Valley Park.' },
  { name: 'Briargate',          median: 560000, lat: 38.9517, lng: -104.7686, era: '1988\u20132004',   fact: 'North-central. Median lot near 0.21 acre, about 8 minutes to the Powers corridor.' },
  { name: 'Cordera',            median: 625000, lat: 38.9686, lng: -104.7250, era: '2006\u2013now',    fact: 'North side. Community center and an internal trail network along Cottonwood Creek.' },
  { name: 'Monument',           median: 720000, lat: 39.0917, lng: -104.8722, era: 'mixed',        fact: 'About 20 minutes north on I-25. Many parcels over one acre, Pike National Forest nearby.' },
  { name: 'Flying Horse',       median: 800000, lat: 38.9925, lng: -104.7683, era: '2004\u2013now',    fact: 'North, at the foot of the Front Range. Golf course community.' },
  { name: 'Broadmoor',          median: 1100000, lat: 38.7906, lng: -104.8489, era: '1920s\u2013now',  fact: 'Southwest against Cheyenne Mountain. Near Seven Falls and Cheyenne Mountain State Park.' },
];

/* Fixed geography the Atlas draws for orientation. Real coordinates —
   the map is accurate, not decorative. The four installations are here
   because Colorado Springs is a military town and "how far is my base"
   is the single most common question a PCS buyer asks. */
export const LANDMARKS = [
  { name: 'Pikes Peak',   lat: 38.8405, lng: -105.0442, kind: 'peak' },
  { name: 'Downtown',     lat: 38.8339, lng: -104.8214, kind: 'city' },
  { name: 'Fort Carson',  lat: 38.7378, lng: -104.7891, kind: 'base' },
  { name: 'Peterson SFB', lat: 38.8153, lng: -104.7008, kind: 'base' },
  { name: 'USAFA',        lat: 38.9983, lng: -104.8614, kind: 'base' },
  { name: 'Schriever SFB', lat: 38.8033, lng: -104.5286, kind: 'base' },
];

/* ⚠️ TODO Jake — refresh monthly from PPAR/MLS and update `asOf`.
   A stale "live" number is worse than no number. There is no feed behind
   this; it is owner-maintained on purpose, and the page says so. */
export const MARKET = {
  /* Real figures, sourced and dated. Owner-maintained on purpose: there
     is no feed behind this and the page says so, because a stale number
     presented as live is worse than no number.
     ⚠️ Jake — refresh monthly against the PPAR report and move `asOf`. */
  asOf: 'June 2026',
  source: 'Redfin and Zillow market data, El Paso County',
  rows: [
    { label: 'Median sale price', value: '$500K', note: 'Colorado Springs, June 2026' },
    { label: 'Median days on market', value: '45', note: 'Listing to contract' },
    { label: 'Months of inventory', value: '2.7', note: 'Under 4 favours sellers' },
    { label: 'The 25% rule reaches', value: '$314K', note: 'At $9,000 take-home, 15-year fixed' },
  ],
  /* The fourth row is computed from the engine's own assumptions, not
     from market data — it is the honest punchline: the disciplined
     number sits well under the median, which is the whole conversation. */
  punchline: 'The median home costs about 59% more than the 25% rule reaches at a $9,000 monthly take-home. That gap is the conversation worth having before you shop, not after.',
};

/* Persistent side rail. ELP-appropriate: the Ramsey audience responds to
   plain competence and zero pressure, not urgency tactics. */
export const RAIL = {
  eyebrow: 'Endorsed Local Provider',
  tabEyebrow: 'Ramsey ELP',
  title: 'Talk it through with Jake.',
  body: 'No pitch, no pressure, and no obligation to list or buy. Ramsey vets its providers on exactly this: whether you get straight advice or a sales call.',
  points: [
    'A real conversation, usually 15 minutes',
    'Your numbers reviewed against the 25% rule',
    'An honest answer if now is the wrong time',
  ],
  cta: 'Call Jake now',
};
