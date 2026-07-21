# 03 — SITE ARCHITECTURE

**Status:** DRAFT — structure proposed, copy slots empty, pending Open Questions in `00_BRIEF.md`.

Built on the positioning resolution in `00_BRIEF.md`: **one brand, two journeys, two credentials.**

Notation: `[SLOT: description]` = copy you or I write later. `[OPEN #n]` = blocked on a brief question.

---

## Sitemap

```
/                          Home — sells YOU, then offers two doors
│
├── /buying                Buyer hub — visitor self-selects a path
│   ├── /buying/debt-free       Ramsey-aligned track
│   ├── /buying/first-home      First-time / accessible financing track
│   ├── /buying/military        PCS & VA track  ◄ Colorado Springs differentiator
│   └── /buying/afford          ★ THE AFFORDABILITY ENGINE (showpiece)
│
├── /selling               Seller hub
│   ├── /selling/value          Home valuation request
│   └── /selling/process        Marketing plan & timeline
│
├── /neighborhoods         Neighborhood Atlas (cinematic)
│   └── /neighborhoods/[slug]   Individual guides — SEO engine
│
├── /listings              Curated featured listings (hand-built, no IDX)
│   └── /listings/[slug]        Individual property
│
├── /about                 Your story, credentials, track record
├── /ramsey                What the Ramsey program means for a client
├── /contact               Booking + direct contact
│
└── /privacy /terms /accessibility     Legal — required
```

**Phase 1 ships:** `/`, `/buying`, `/selling`, `/about`, `/contact`, legal pages.
**Phase 2 adds:** Affordability Engine, Neighborhood Atlas, buyer sub-tracks.
**Phase 3 adds:** listings, individual neighborhood guides, `/ramsey`.

---

## Home — section by section

The homepage's only job: **establish you as the obvious choice, then route to the right journey.** It never picks a financing philosophy (see `00_BRIEF.md`).

### 1. Hero
- **Content:** your name, a positioning line, one Colorado Springs image or video with real presence
- **Motion:** scroll-scrub signature (desktop) / static composition (mobile) — `02_MOTION.md` §5
- **CTA:** two equal-weight doors — **"I'm Buying"** / **"I'm Selling"**
- `[SLOT: positioning line — one sentence, what you do and for whom]`
- **Rule:** headline readable at frame one. No preloader. No gate.

### 2. The two doors
Full-width split. Not a nav menu — a decision. This is the most important interaction on the site.
- Buying: `[SLOT: 6-10 words]` → `/buying`
- Selling: `[SLOT: 6-10 words]` → `/selling`
- **Motion:** hover depth shift, magnetic cursor (desktop)

### 3. Credentials band ◄ **the Ramsey badge lives here**
Deliberately dark, navy-compatible field. Designed *around* the unmodifiable badge — see `04_COMPLIANCE.md` §1 and `01_DESIGN_SYSTEM.md`.
- Ramsey badge (unmodified, native size)
- Pink Realty (required by CO Rule 6.10)
- REALTOR® / license number
- `[SLOT: one line on what these credentials mean for the client — not a brag]`
- **Rule:** this section must look intentional, not like a logo dump. It carries the whole trust load.

### 4. Proof
Real numbers, real outcomes.
- `[SLOT: homes closed / families served / years in Colorado Springs / avg days on market]`
- **Motion:** numeric counter — `02_MOTION.md` §6
- **Rule:** only real, verifiable numbers. One honest number beats four vague ones.

### 5. You
Photo, short story, why you do this. The trust moment.
- `[SLOT: 60-90 words. First person. Specific, not generic.]` — `[OPEN #9: headshot]`
- → `/about`

### 6. Neighborhoods teaser
3–4 neighborhoods with real photography. → Atlas.
- `[OPEN #11: which neighborhoods]`
- ⚠️ Fair Housing applies to every word — `04_COMPLIANCE.md` §3

### 7. Testimonials
- `[SLOT: 3 testimonials with names]` — `[OPEN #15]`
- **Motion:** marquee (pauses on hover/focus) — `02_MOTION.md` §7

### 8. Final CTA + footer
- One clear action. Legal footer block per `04_COMPLIANCE.md` §5.

---

## `/buying` — the fork

Buyer hub. The visitor **self-selects**; philosophies never collide on one screen.

- `[SLOT: intro — you work with buyers at every stage, no judgment]`
- Three paths, presented as equals:

| Path | For | Voice |
|------|-----|-------|
| **Buy debt-free** | Ramsey followers, disciplined savers | 15-yr fixed, 20% down, ≤25% of take-home. Confident, principled. |
| **My first home** | First-time buyers | FHA, down payment assistance, credit-building. Warm, plain-language, encouraging. |
| **Military & PCS** | Fort Carson, Peterson SFB, Schriever, USAFA | VA loans, PCS timelines, commute-to-base, remote buying. Direct, logistics-aware. |

- Shared below the fork: the buying process timeline, the Affordability Engine entry point.

**Voice rule:** each track is honest inside its own space. `/buying/debt-free` may state Ramsey's actual position on FHA. `/buying/first-home` may explain FHA as a legitimate tool. They do not argue with each other because they never share a screen.

---

## `/selling`

You said you work with both — sellers get equal architectural weight, not a nav afterthought.

- **Hero:** `[SLOT: seller-focused line]`
- **Valuation CTA** — the primary seller conversion → `/selling/value`
- **Your marketing plan** — `[SLOT: photography, staging, pricing strategy, listing distribution]`
  This is where you differentiate. Most agent sites say "I'll market your home." Show the actual plan.
- **Timeline** — what happens week by week
- **Net proceeds explainer** — `[SLOT]`
- **Seller testimonials** — `[OPEN #15]`
- **Recently sold** — proof, pulled from curated listings

---

## ★ The Affordability Engine — `/buying/afford`

**The showpiece.** The single most valuable thing on this site, and the thing no Colorado Springs competitor has.

### Concept
Built on Ramsey's actual rule: **monthly payment ≤ 25% of monthly take-home pay, on a 15-year fixed.** Enter your take-home; watch it resolve in real time into the actual price range, neighborhoods, and homes available to you in Colorado Springs.

### Why it wins
- Genuinely useful — not a lead-gen form in a costume
- Perfectly on-brand for the Ramsey credential
- Ranks for extremely high-intent search
- Captures a lead at the exact moment of peak motivation
- Highly shareable

### Inputs
- Monthly take-home pay (primary — big, tactile, the hero control)
- Down payment available
- Toggle: **15-year (Ramsey)** ⇄ **30-year (conventional)** — shows the real cost difference

### Outputs
- Maximum home price under the 25% rule
- Live-updating monthly breakdown: principal, interest, taxes, insurance
- **Which Colorado Springs neighborhoods that price actually reaches** ← the emotional payoff
- Total interest paid: 15-yr vs 30-yr, side by side
- Soft CTA: "See what this looks like in your neighborhood" → lead capture

### Rules
- **Must be honest.** Real Colorado Springs tax and insurance rates. A tool that flatters is worthless and damages trust.
- Show assumptions plainly. Include a "these are estimates, not a lending decision" disclaimer.
- **No email wall before the answer.** Give the value first, capture after. Gating this kills it.
- Fully functional with zero motion and via keyboard — `02_MOTION.md`
- **Not a mortgage quote.** Not a pre-approval. Language reviewed with your broker.
- `[OPEN: current CO Springs property tax rate, insurance avg, rate assumptions — needs a source and an update cadence]`

---

## Neighborhood Atlas — `/neighborhoods`

Cinematic scroll journey through the neighborhoods you actually work.

- `[OPEN #11]` Candidates: Briargate, Old Colorado City, Broadmoor, Flying Horse, Monument, Falcon, Fountain, Rockrimmon, Cordera
- Per neighborhood: real photography, price context, commute/distance facts, architecture and lot character, what it's near
- Individual pages are the **SEO engine** — highest-value organic traffic
- **Motion:** cinematic-refined tier (`02_MOTION.md`) — not the showpiece
- ⚠️ **Fair Housing gate.** Describe *places*, never *people*. No "family-friendly," "safe," "good schools," "up-and-coming," "exclusive." See `04_COMPLIANCE.md` §3. **Every line reviewed before publish.**

---

## `/listings` — curated only

**Decided: no IDX.** Hand-built cards and detail pages, full design control, zero monthly fees, no vendor widgets breaking the design. High-volume search traffic routes to Pink Realty's portal.

- 6–12 hand-picked properties
- Every card and detail page built to our design system
- Recently-sold serves as seller proof
- `[OPEN: do you own rights to the listing photography?]`
- A slot is architected for IDX so a Phase-2 retrofit isn't painful — but we build without it

---

## `/ramsey`

One dedicated page explaining what the program means **for the client** — not a shrine.

- `[SLOT: what the program is, in plain language]`
- `[SLOT: what it means for someone working with you]`
- ⚠️ **Blocked on `04_COMPLIANCE.md` §1** — exact program name, approved claim language, and whether Dave Ramsey's name/likeness may be used at all. **Do not draft this copy until confirmed in writing.**

---

## `/contact`

- Booking (calendar embed) + phone + email + form
- **Lead routing must go somewhere real** — `[OPEN #13: CRM]`
- Form consent language per `04_COMPLIANCE.md` §6 (TCPA, 2026 Colorado informed-consent rule)
- No pre-checked consent boxes

---

## Conversion architecture

Every page has exactly **one** primary action. Competing CTAs halve both.

| Page | Primary action |
|------|----------------|
| Home | Choose a door (buying / selling) |
| /buying | Choose a track, or run the Engine |
| /buying/afford | Get the personalized follow-up |
| /selling | Request a valuation |
| /neighborhoods/* | Ask about this neighborhood |
| /listings/* | Request a showing |
| /about | Book a conversation |

**Rules:** no exit-intent popups. No chat widget that interrupts. No newsletter modal on first visit. Every one of those trades a small conversion bump for the premium feel you're paying for — and you asked for premium.
