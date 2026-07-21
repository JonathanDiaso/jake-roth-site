# 04 — COMPLIANCE & BRAND CONSTRAINTS

**Status:** DRAFT — contains **blocking items**.
**This file overrides design.** If a design decision conflicts with anything here, the design changes.

> ⚠️ **Not legal advice.** This is a working checklist assembled from published sources. Before launch, have your managing broker at Pink Realty review the live site, and confirm Ramsey usage with your Ramsey representative.

---

## 1. Ramsey brand usage — HARD RULES

Source: [RamseyTrusted Website Assets toolkit](https://www.ramseysolutions.com/trusted/marketing-toolkit/ramseytrusted-website-assets)

### Assets provided

- Navy Full Width Image
- Navy Rectangular Image
- White Rectangular Image
- Navy Circular Image
- "Ramsey Personality Assets" (zipped folder)

### Prohibited — verbatim from the toolkit

> - "Don't resize the graphics"
> - "Don't crop out, rearrange, or recolor the elements"
> - Not for "social media"
> - Not for "emails, text messages, and other direct-distribution"
> - "Keep them as is please!"

### What this means for us — the design implication

**The badge is unmodifiable.** We must place a fixed-size, fixed-color navy graphic into a bespoke high-end layout. We do not fight this — **we design a room for it.**

**Required approach:** a dedicated credentials moment with a deliberately dark, deep-navy-compatible field, where a navy badge reads as *intentional* rather than pasted. This is a first-class design problem, assigned in `03_ARCHITECTURE.md` (Credentials Band) and constrained in `01_DESIGN_SYSTEM.md`.

**Never:** drop the badge into a light section as a floating rectangle, scale it to fit a grid, or tint it to match the palette. All three violate the rules and all three look cheap.

### ⚠️ BLOCKER — must verify with your Ramsey rep before build

- [ ] **Exact program name and tier.** You wrote "licensed NLP with Dave Ramsey." I believe you mean **ELP (Endorsed Local Provider)** — the former name of the program now branded **RamseyTrusted**. Get the exact current designation in writing. Every mention on the site must use it precisely.
- [ ] **Dave Ramsey's name, photo, and likeness.** The toolkit page does **not** state whether an agent may use these on a personal site. A "Ramsey Personality Assets" folder exists, which implies *some* permitted use — but the scope is unspecified. **Assume prohibited until confirmed in writing.**
- [ ] **Approved claim language.** How may you describe the relationship? "RamseyTrusted agent"? "Endorsed by Dave Ramsey"? These carry very different legal weight. Get the approved phrasing.
- [ ] **Co-branding with Pink Realty.** The toolkit is silent on displaying the badge alongside a brokerage logo. Confirm it's permitted.
- [ ] **Required disclaimer.** The toolkit provides none, but your agreement may. Check your ELP/RamseyTrusted contract.

### Claims we must NOT make until approved

- ❌ "Dave Ramsey recommends me"
- ❌ "Dave Ramsey's Colorado Springs agent"
- ❌ Any phrasing implying personal endorsement by Dave Ramsey the individual
- ❌ Using his photo or signature as a design element
- ✅ Safe baseline (pending confirmation): factual statement of program membership using the exact approved program name

---

## 2. Colorado real estate advertising law

Source: [4 CCR 725-1, Chapter 6 — Practice Standards](https://regulations.justia.com/states/colorado/700/725/rule-4-ccr-725-1/chapter-6/) · [Colorado Real Estate Manual 2026](https://dre.colorado.gov/sites/dre/files/documents/2026_CREM_Ch%2002.pdf)

### Rule 6.10 — brokerage name required

> When a broker communicates for purposes of advertising the broker's real estate brokerage services, they must use the broker's brokerage firm's name.

**Binding requirements:**

- [ ] **"Pink Realty" must appear** in advertising contexts across the site — not buried in one footer line on one page.
- [ ] Advertising includes: websites, business cards, brochures, signage, flyers, mailings, social media, letterhead, email signatures, contract documents.
- [ ] A URL and email address alone are **not** advertising under Rule 6.10, provided they aren't directly used to promote or solicit brokerage services.
- [ ] **No false or misleading information** regarding your identity or the firm you represent.

**Note:** pinkrealty.com's own footer carries no license disclosure. **Do not use the corporate site as a compliance reference.** Follow the rule, not the example.

### Also verify

- [ ] Your **Colorado license number** displayed — confirm placement requirements with your managing broker.
- [ ] Whether **Pink Realty's brokerage license number** must also appear.
- [ ] **2026 rule change:** as of Jan 1, 2026, Colorado brokers must obtain a client's informed consent before sharing confidential information with supervising brokers. → Relevant to **form design and privacy policy**, since site form submissions may route through brokerage systems. Confirm handling with your broker.

---

## 3. Fair Housing

- [ ] **Equal Housing Opportunity** logo in the footer.
- [ ] **REALTOR®** mark if you are an NAR member — correct trademark form, only if entitled.
- [ ] **Copy review for Fair Housing compliance.** This is not optional and it is easy to violate accidentally. Neighborhood descriptions must describe *places*, never the *people* who live there.
  - ❌ "great for families," "safe neighborhood," "good schools" as a proxy, "up-and-coming," "exclusive community"
  - ✅ amenities, distances, architecture, lot sizes, parks, factual school district names without quality judgments
  - **This directly constrains the Neighborhood Atlas.** Every line of that copy gets a Fair Housing pass before it ships.
- [ ] **Accessibility.** Real estate sites face ADA/WCAG litigation. Our WCAG 2.1 AA floor (`01_DESIGN_SYSTEM.md`) is a legal risk control, not a nicety.

---

## 4. Brokerage policy — BLOCKER

- [ ] **Does Pink Realty permit agent personal websites?** Many brokerages restrict or prohibit them. **Get written permission before we build.**
- [ ] Pink Realty brand guidelines — logo lockup, minimum clear space, approved colors, required language?
- [ ] Does the site require brokerage review/approval before launch?
- [ ] Are there rules about displaying listings — including your own?
- [ ] Does lead routing have to flow through brokerage systems?

---

## 5. Required footer block

Draft template. **Fill the blanks and have your managing broker approve the final wording.**

```
[AGENT NAME], REALTOR® — Colorado License #[NUMBER]
Pink Realty — [Brokerage address], Colorado Springs, CO [ZIP]
[Brokerage license # if required]

[Approved Ramsey program designation — pending OPEN #6]

[Equal Housing Opportunity logo]  [REALTOR® mark]  [Ramsey badge — unmodified]

© 2026 [AGENT NAME]. All rights reserved.
Privacy Policy · Terms of Use · Accessibility Statement
```

---

## 6. Data & privacy

- [ ] **Privacy policy** — required, since forms collect personal information.
- [ ] **Terms of use**
- [ ] **Accessibility statement** — reduces ADA exposure
- [ ] Cookie/analytics consent if using tracking (GA4, Meta Pixel)
- [ ] Form data handling per the 2026 Colorado informed-consent rule (§2)
- [ ] TCPA: if collecting phone numbers for calls/texts, include proper consent language on the form — **do not pre-check consent boxes**

---

## 7. Pre-launch compliance gate

**No launch until every box is checked.** This gate is enforced in `05_BUILD_PLAN.md`.

- [ ] Managing broker has reviewed and approved the live site
- [ ] Ramsey rep has confirmed badge usage, program name, and claim language
- [ ] Pink Realty appears correctly per Rule 6.10
- [ ] License number(s) displayed
- [ ] Equal Housing Opportunity present
- [ ] Full copy pass for Fair Housing — Neighborhood Atlas especially
- [ ] Ramsey badge unmodified: not resized, recolored, cropped, or rearranged
- [ ] WCAG 2.1 AA verified (contrast, keyboard nav, screen reader, focus states)
- [ ] Privacy policy, terms, accessibility statement live
- [ ] Form consent language reviewed
