# 05 — BUILD PLAN

**Status:** DRAFT — no build has started, by instruction.

---

## Recommended stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js (App Router) + TypeScript** | Static generation = fast + excellent SEO. Local real estate search is won on Core Web Vitals. |
| Styling | **Tailwind CSS**, design tokens as CSS custom properties | Tokens from `01_DESIGN_SYSTEM.md` become the *only* source of values — enforces the lock mechanically. |
| Component motion | **Motion** (formerly Framer Motion) | Reveals, transitions, gestures. Tree-shakeable. |
| Scroll motion | **GSAP + ScrollTrigger** | Scroll-scrub sequences. The only library that does this properly. Load **only** on pages that need it. |
| Images | `next/image`, AVIF + WebP | Non-negotiable for the perf budget. |
| Content | **MDX** for neighborhood guides | Zero CMS cost, version-controlled, fast. Upgrade to a CMS only if you'll self-edit weekly. |
| Hosting | **Vercel** | Edge delivery, preview deploys, zero-config for Next. |
| Analytics | **Plausible** or Vercel Analytics | Privacy-friendly — **avoids a cookie consent banner entirely**, which protects the premium feel. |
| Forms → CRM | `[OPEN #13]` | Leads must land somewhere real. |

### Two flagged decisions

- **Smooth scroll (Lenis).** Produces the buttery feel of Foundry and b-egg. But it *changes native scroll physics*, which brushes against the anti-scroll-jacking rule in `02_MOTION.md`. **Evaluate at design lock** — test on a real mid-tier Android before committing. Not automatic.
- **CMS vs MDX.** MDX is faster and free but requires me (or a dev) to publish. If you want to add neighborhood guides yourself at 10pm, we need a CMS. Answer honestly — an unused CMS is pure cost.

---

## Phases & gates

**A gate is a stop. Work does not proceed past a failed gate.**

### Phase 0 — Unblock (you)
- Answer Open Questions in `00_BRIEF.md` (blocking items 1–6 minimum)
- Get **written** brokerage permission — `04_COMPLIANCE.md` §4
- Confirm Ramsey program name + claim language with your rep — `04_COMPLIANCE.md` §1
- Gather assets: logo (SVG), headshots, photography, license numbers

> 🚦 **GATE 0** — Blocking questions answered. Brokerage permission in hand.

### Phase 1 — Design exploration
- Build **three real mockups** (Alpine Editorial / Night Glass / Signal) — hero + credentials band + one content section
- Each must demonstrate the Ramsey badge hosted gracefully. A direction that can't is disqualified.
- You choose one

> 🚦 **GATE 1** — Direction selected. `01_DESIGN_SYSTEM.md` tokens filled. Status → 🟢 LOCKED.
> **No production code before this gate.**

### Phase 2 — Foundation
- Next.js scaffold, tokens wired as CSS variables, typography, base components
- Motion primitives from `02_MOTION.md` built as reusable, tested pieces
- Legal footer, privacy/terms/accessibility pages
- Home, /buying, /selling, /about, /contact

> 🚦 **GATE 2 — PERFORMANCE.** Full budget in `02_MOTION.md` met on throttled mobile. Over budget does not ship.
> 🚦 **GATE 3 — ACCESSIBILITY.** WCAG 2.1 AA verified: contrast, keyboard, screen reader, focus, 200% zoom, reduced-motion.

### Phase 3 — The differentiators
- ★ Affordability Engine
- Neighborhood Atlas + individual guides
- Buyer sub-tracks (debt-free / first-home / military)
- Seller valuation flow

> 🚦 **GATE 4 — FAIR HOUSING.** Every line of neighborhood and marketing copy reviewed against `04_COMPLIANCE.md` §3.

### Phase 4 — Launch
- Curated listings
- CRM wiring + lead routing tested end to end
- Analytics + conversion instrumentation
- SEO: metadata, schema.org `RealEstateAgent`, sitemap, local business markup
- Redirects from the existing site — `[OPEN #2]`

> 🚦 **GATE 5 — COMPLIANCE.** Full pre-launch checklist in `04_COMPLIANCE.md` §7. Managing broker sign-off. **Then launch.**

---

## Agent routing

Per `CLAUDE.md` swarm config. Spawn only when a phase is actually running — and only on request.

| Phase | Agents | Topology |
|-------|--------|----------|
| 1 — Design | `system-architect` (direction), `coder` (mockups), `reviewer` (a11y + badge fit) | hierarchical |
| 2 — Foundation | `system-architect`, `coder`, `tester`, `reviewer` | hierarchical |
| 3 — Features | `coder` (Engine), `coder` (Atlas), `tester`, `reviewer` | hierarchical-mesh |
| 4 — Launch | `reviewer` (compliance), `performance-engineer`, `tester` | hierarchical |

**Binding rules for every agent on this project:**

1. **Read `01_DESIGN_SYSTEM.md` and `02_MOTION.md` before writing any code.** Not from memory of a summary.
2. **Never invent a design token or motion primitive.** Missing one → stop and propose.
3. **Never write copy touching Ramsey branding** without checking `04_COMPLIANCE.md` §1.
4. **Never write neighborhood copy** without the Fair Housing pass, `04_COMPLIANCE.md` §3.
5. **Every component ships mobile-first**, WCAG AA, ≥44px targets, keyboard-operable.
6. No placeholder comments. No `// implement this`. Every block fully implemented.
7. Files under 500 lines; components decomposed.

---

## Asset checklist

Design quality is capped by asset quality. **Great design over weak photography still looks cheap** — this is the highest-leverage thing you control.

- [ ] Pink Realty logo — **SVG** preferred `[OPEN #10]`
- [ ] Ramsey badges — all four formats, unmodified `04_COMPLIANCE.md` §1
- [ ] Professional headshots — multiple crops, one environmental `[OPEN #9]`
- [ ] Colorado Springs photography — real, ideally yours; drone if available
- [ ] Neighborhood photography — one strong image minimum per neighborhood `[OPEN #11]`
- [ ] Listing photography with confirmed usage rights
- [ ] Optional: short video (hero), 10–20s, no sound
- [ ] Equal Housing Opportunity + REALTOR® marks
- [ ] Testimonials with names and permission `[OPEN #15]`

> **If professional photography doesn't exist, budget for it before budgeting for anything else.** It will do more for "looks like the best site on the internet" than any animation we can write.

---

## Risk register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Brokerage prohibits personal sites | **Project dead** | GATE 0 — get written permission *first* |
| Ramsey usage narrower than assumed | Credentials section rebuilt | Confirm in writing before Phase 1 |
| Motion blows the perf budget | Lost local search ranking | GATE 2 enforced; showpiece isolated & lazy-loaded |
| Weak photography | Site reads generic despite great build | Asset checklist at Phase 0; budget for a shoot |
| Fair Housing violation in copy | **Legal exposure** | GATE 4; every neighborhood line reviewed |
| Buyer tracks read as contradictory | Trust collapse | Voice test in `00_BRIEF.md`; tracks never share a screen |
| Scope creep from "all four goals" | Nothing finishes well | Goal ranking + tiebreak rule in `00_BRIEF.md` |
