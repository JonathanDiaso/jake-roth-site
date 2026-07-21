# 00 — PROJECT BRIEF

**Status:** Draft v1 — awaiting answers to Open Questions below.
**Owner:** [AGENT NAME — OPEN #1]
**Brokerage:** Pink Realty — Colorado Springs, CO
**Last updated:** 2026-07-21

---

## Document map

Read in this order. Every file is binding once marked LOCKED.

| File | Purpose | Status |
|------|---------|--------|
| `00_BRIEF.md` | Positioning, audience, goals, open questions | DRAFT |
| `01_DESIGN_SYSTEM.md` | Visual tokens — nothing invented inline | **NOT LOCKED** — needs Phase 1 |
| `02_MOTION.md` | Motion language + performance budget | DRAFT |
| `03_ARCHITECTURE.md` | Sitemap, sections, copy slots | DRAFT |
| `04_COMPLIANCE.md` | Ramsey + Colorado + Fair Housing rules | DRAFT — **has blockers** |
| `05_BUILD_PLAN.md` | Stack, phases, agent routing, gates | DRAFT |
| `PROMPT.md` | Master build prompt | DRAFT |

---

## OPEN QUESTIONS — answer these before design work starts

Numbered so you can reply "1: …, 2: …" without rewriting the question.

### Blocking (design cannot start)

1. **Your name**, as it should appear on the site. And how you want to be referred to (first-name-forward, or full formal name).
2. **The existing real estate page you mentioned** — what's the URL? Is this new site: (a) replacing it, (b) a separate Ramsey-facing site, or (c) a rebuild that absorbs it? This changes domain strategy, SEO migration, and whether we need redirects.
3. **Domain** — do you own one for this site? What is it / what do you want?
4. **Brokerage permission.** Does Pink Realty allow agents to run personal websites, and are there brand rules you must follow (logo lockup, required language, color use)? Get this in writing. Many brokerages restrict it. See `04_COMPLIANCE.md`.
5. **Your Colorado license number**, and whether Pink Realty's brokerage license number must also appear. Required for legal footer.
6. **Ramsey program name — exact.** You wrote "licensed NLP with Dave Ramsey." I believe you mean **ELP (Endorsed Local Provider)** — Ramsey's former name for the program now branded **RamseyTrusted**. These are not interchangeable in writing. Confirm the exact current program name and your tier, because it governs what you may legally claim on the site. See `04_COMPLIANCE.md`.

### High-impact (shapes architecture)

7. **"Look good for my friend"** — you wrote this and I want to make sure I read it right. Is there a specific person (the one who connected you to Ramsey?) whose opinion this site needs to land with? If so, tell me who and what impresses them. That's a real design input, not a soft one.
8. **Buyer/seller split.** Roughly what % of your business is each today, and which do you *want* more of? The site should over-index on what you want to grow, not what you currently have.
9. **Your photo and video assets.** Do you have professional headshots? Any video? Drone footage of Colorado Springs? Listing photography you own the rights to? Be honest — this is the #1 predictor of whether a site looks expensive. Great design over weak photography still looks cheap.
10. **Pink Realty logo file** — where is it? Format (SVG / PNG / AI)? SVG strongly preferred.
11. **Neighborhoods you actually work.** Name the ones you know cold — those become the Neighborhood Atlas.

### Useful (can be answered later)

12. Budget comfort for ongoing services (hosting, CRM, booking, email)?
13. Do you have a CRM already (Follow Up Boss, kvCORE, HubSpot)? Leads must land somewhere real.
14. Timeline — is there a date this needs to be live?
15. Any testimonials/reviews you can use, with names?

---

## Who this is for

**The agent:** A licensed Colorado real estate agent at Pink Realty, Colorado Springs. Works with **both buyers and sellers**. Holds a Dave Ramsey program credential (ELP/RamseyTrusted — verify per OPEN #6).

**The brokerage context:** Pink Realty is Colorado Springs' large local brokerage — 100+ agents, 4,100+ families served, covering Colorado Springs plus Parker, Pueblo West, Falcon, Fountain, and Monument. Corporate emphasis: zero-down programs, FHA first-time buyers, VA/military, and Non-QM self-employed lending.

---

## THE CENTRAL POSITIONING PROBLEM

This is the most important paragraph in this document.

**Pink Realty's headline offer and Dave Ramsey's doctrine directly contradict each other.**

- Pink Realty leads with: *Zero Money Down programs, FHA, down payment assistance, Non-QM.*
- Ramsey teaches: *20% down, 15-year fixed only, no FHA, payment ≤25% of monthly take-home, no debt.*

A Ramsey-referred lead who lands on "Zero Down!" loses trust instantly. A first-time or VA buyer who lands on "20% down or don't buy" leaves feeling judged. **You cannot lead with both.**

### The resolution: One brand, two journeys, two credentials

The site's identity is **you** — not Ramsey, not Pink Realty. Both are *credentials that support you*, displayed with respect and neither one driving the voice.

```
                      YOU (the brand)
                            │
              ┌─────────────┴─────────────┐
          BUYERS                       SELLERS
              │                            │
      ┌───────┴────────┐            valuation,
   Ramsey-aligned   Accessible      listing plan,
   "Buy debt-free"  "First home /   marketing,
   15-yr, 25% rule   VA / PCS"      net proceeds
```

**Rules this creates:**

- The homepage **never picks a financing philosophy.** It sells *you* — judgment, local mastery, integrity — then offers two clear doors: **Buying** and **Selling**.
- Inside Buying, the visitor **self-selects** their path. Each path speaks its own language honestly, in its own dedicated space. They never collide on one screen.
- The Ramsey credential lives in a **designed credentials moment** plus **one dedicated page** explaining what the program actually means for the client. It is not the site's personality.
- The Pink Realty relationship is present, correct, and legally required (see `04_COMPLIANCE.md`) — but it is a brokerage attribution, not the brand.

**Voice test — apply to every line of copy:** Would a debt-free Ramsey follower AND a VA first-time buyer both feel respected reading this? If a sentence only works for one, it belongs on a track page, not the homepage.

---

## Goal ranking

You said "all of these." You can have all four — but ranked, so conflicts resolve without a meeting.

| # | Goal | Role |
|---|------|------|
| **1** | **Lead capture** | Primary. Every page has a defined next action. Success = qualified inquiries. |
| **2** | **Credibility** | The precondition. A referred lead Googles you; the site must close that loop in 5 seconds. Serves #1. |
| **3** | **SEO / content authority** | The compounding engine. Neighborhood guides, PCS guides, market notes. Phase 2+. Feeds #1. |
| **4** | **Listing showcase** | Proof asset, not a search portal. Curated only. Feeds #1, #2, and seller pitches. |

**Tiebreak rule:** When goals conflict, **clarity and conversion win over completeness.** Cut the section before you cram it.

---

## Success metrics

Define now so we can tell whether we won.

- **Primary:** qualified inquiries per month (form, call, or booked consult)
- **Secondary:** Affordability Engine completions; valuation requests; consult bookings
- **Quality gate:** Core Web Vitals green on **mobile** (see `02_MOTION.md` for hard numbers)
- **Credibility proxy:** time on page for the About/Credentials sections
- **Instrumented from day one** — a beautiful site with no analytics is a guess.

---

## What "better than Ramsey Solutions" actually means

Ramsey Solutions' site is corporate, high-contrast, safe, and conversion-tuned. Beating it aesthetically is not hard. Beating it *meaningfully* means:

| They do | You do |
|---------|--------|
| Generic national voice | Specific Colorado Springs mastery |
| Stock-feeling imagery | Real photography of real places you work |
| Static calculators | A live, cinematic affordability experience |
| No motion identity | A coherent motion language (`02_MOTION.md`) |
| Broad, impersonal | One human being, with judgment and a track record |

**Do not confuse "high-end" with "luxury-priced."** Apple's design sells to everyone. High-end here means *considered* — restraint, precision, and nothing accidental. Your audience includes first-time and military buyers; the site must feel premium **and** welcoming. Intimidating is a failure state.

---

## Non-goals

Explicitly out of scope. Revisit only by decision, not by drift.

- ❌ Full IDX/MLS search integration (decided: curated listings only — see `03_ARCHITECTURE.md`)
- ❌ Replicating Pink Realty corporate site content
- ❌ Using Dave Ramsey's likeness as a brand element (see `04_COMPLIANCE.md` — restricted)
- ❌ Motion that blocks reading or delays content (see `02_MOTION.md`)
- ❌ A blog we won't maintain — content only if there's a real publishing commitment
