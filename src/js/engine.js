/* ============================================================
   ★ AFFORDABILITY ENGINE
   Ramsey's rule, computed honestly: monthly payment ≤ 25% of monthly
   take-home on a 15-year fixed. Payment means PITI, not just P&I —
   quoting P&I alone is how calculators flatter people into houses
   they cannot carry. 03_ARCHITECTURE.md: a tool that flatters is
   worthless and damages trust.

   Works fully by keyboard. Works with zero motion. Gives the answer
   before asking for anything.
   ============================================================ */

import { ASSUMPTIONS, PLACES } from './content.js';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
});

/* Standard amortisation factor: monthly payment per dollar borrowed. */
function paymentFactor(annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return 1 / n;
  return (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* Solve for the price whose full PITI exactly consumes the budget.
     budget = (price − down) · f + price · (tax + ins) / 12
   Rearranged for price. Taxes and insurance scale with the home's
   value, which is why they belong inside the solve rather than being
   subtracted afterwards as a flat guess. */
export function maxPrice({ takeHome, down, years }) {
  const budget = takeHome * ASSUMPTIONS.ramseyRule;
  const rate = years === 15 ? ASSUMPTIONS.rate15 : ASSUMPTIONS.rate30;
  const f = paymentFactor(rate, years);
  const carry = (ASSUMPTIONS.propertyTaxRate + ASSUMPTIONS.insuranceRate) / 12;

  const price = (budget + down * f) / (f + carry);
  return Math.max(down, Math.round(price / 1000) * 1000);
}

export function breakdown({ price, down, years }) {
  const rate = years === 15 ? ASSUMPTIONS.rate15 : ASSUMPTIONS.rate30;
  const loan = Math.max(0, price - down);
  const f = paymentFactor(rate, years);

  const principalInterest = loan * f;
  const taxes = (price * ASSUMPTIONS.propertyTaxRate) / 12;
  const insurance = (price * ASSUMPTIONS.insuranceRate) / 12;
  const total = principalInterest + taxes + insurance;
  const totalInterest = principalInterest * years * 12 - loan;

  return { loan, principalInterest, taxes, insurance, total, totalInterest, rate };
}

export function initEngine(root, hooks = {}) {
  if (!root) return;

  const el = {
    takeHome: root.querySelector('#take-home'),
    takeHomeOut: root.querySelector('[data-out="take-home"]'),
    down: root.querySelector('#down-payment'),
    downOut: root.querySelector('[data-out="down"]'),
    terms: root.querySelectorAll('input[name="term"]'),
    price: root.querySelector('[data-out="price"]'),
    payment: root.querySelector('[data-out="payment"]'),
    share: root.querySelector('[data-out="share"]'),
    pi: root.querySelector('[data-out="pi"]'),
    tax: root.querySelector('[data-out="tax"]'),
    ins: root.querySelector('[data-out="ins"]'),
    totalRow: root.querySelector('[data-out="total"]'),
    compare: root.querySelector('[data-out="compare"]'),
    atlas: root.querySelector('[data-atlas]'),
    atlasCount: root.querySelector('[data-out="atlas-count"]'),
    ask: root.querySelector('[data-out="ask"]'),
    askLink: root.querySelector('[data-out="ask-link"]'),
  };

  if (!el.takeHome || !el.price) return;

  /* Bounds come from ASSUMPTIONS, not the markup, so the config file
     stays the single source of truth for every number on the page. */
  const applyBounds = (input, cfg) => {
    input.min = String(cfg.min);
    input.max = String(cfg.max);
    input.step = String(cfg.step);
    input.value = String(cfg.default);
  };
  applyBounds(el.takeHome, ASSUMPTIONS.takeHome);
  applyBounds(el.down, ASSUMPTIONS.down);

  /* Cards are built once, then only their state class changes. Never
     re-render the list on input — that would thrash layout on drag. */
  /* Ruled rows, not a grid of tiles. A price ladder IS a list — reading
     it in order is the whole point, and twelve identical boxes hid that. */
  const cards = PLACES.map((place) => {
    const row = document.createElement('article');
    row.className = 'prow';
    row.innerHTML = `
      <h3 class="prow__name"></h3>
      <p class="prow__fact"></p>
      <p class="prow__price numeric"></p>
      <p class="prow__state"></p>`;
    row.querySelector('.prow__name').textContent = place.name;
    row.querySelector('.prow__fact').textContent = `${place.era} \u00b7 ${place.fact}`;
    row.querySelector('.prow__price').textContent = usd.format(place.median);
    el.atlas?.appendChild(row);
    return { place, card: row, status: row.querySelector('.prow__state') };
  });

  const getYears = () => {
    const checked = [...el.terms].find((t) => t.checked);
    return checked ? Number(checked.value) : 15;
  };

  function setRangeFill(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--fill', `${pct}%`);
  }

  function update() {
    const takeHome = Number(el.takeHome.value);
    const down = Number(el.down.value);
    const years = getYears();

    setRangeFill(el.takeHome);
    setRangeFill(el.down);

    el.takeHomeOut.textContent = takeHome.toLocaleString('en-US');
    el.downOut.textContent = down.toLocaleString('en-US');

    const price = maxPrice({ takeHome, down, years });
    const b = breakdown({ price, down, years });

    el.price.textContent = usd.format(price);
    el.payment.textContent = usd.format(b.total);
    el.share.textContent = `${Math.round((b.total / takeHome) * 100)}%`;
    el.pi.textContent = usd.format(b.principalInterest);
    el.tax.textContent = usd.format(b.taxes);
    el.ins.textContent = usd.format(b.insurance);
    el.totalRow.textContent = usd.format(b.total);

    /* The honest comparison. At the same monthly budget the 30-year
       buys more house and costs dramatically more money — show both
       numbers rather than editorialising about either. */
    const other = years === 15 ? 30 : 15;
    const otherPrice = maxPrice({ takeHome, down, years: other });
    const otherB = breakdown({ price: otherPrice, down, years: other });
    const interestGap = Math.abs(otherB.totalInterest - b.totalInterest);

    el.compare.innerHTML = years === 15
      ? `A 30-year at the same monthly budget reaches about <strong>${usd.format(otherPrice)}</strong> — but costs roughly <strong>${usd.format(interestGap)}</strong> more in interest over the life of the loan.`
      : `A 15-year at the same monthly budget reaches about <strong>${usd.format(otherPrice)}</strong> — and saves roughly <strong>${usd.format(interestGap)}</strong> in interest over the life of the loan.`;

    /* Resolve the number into places. This is the payoff. */
    let reachable = 0;
    cards.forEach(({ place, card, status }) => {
      const inReach = place.median <= price;
      if (inReach) reachable++;
      card.classList.toggle('prow--in', inReach);
      card.classList.toggle('prow--out', !inReach);
      status.textContent = inReach
        ? 'In reach'
        : `+${usd.format(place.median - price)}`;
    });

    hooks.onReach?.(price);

    el.atlasCount.textContent = reachable === 0
      ? 'No area medians sit under this number yet — individual homes still will.'
      : `${reachable} of ${cards.length} area medians sit at or under this number`;

    /* The ask inherits what they just did. Specificity is what makes
       it read as a person rather than a funnel. */
    el.ask.textContent = reachable === 0
      ? `Jake, what can I actually get near ${usd.format(price)} in Colorado Springs?`
      : `Jake, is ${usd.format(price)} the right number for my situation?`;

    if (el.askLink) {
      const body = `Hi Jake — I ran the numbers on your site. Take-home ${usd.format(takeHome)}/mo, ${usd.format(down)} down, ${years}-year. It came out to ${usd.format(price)}. Can we talk?`;
      el.askLink.dataset.prefill = body;
    }
  }

  el.takeHome.addEventListener('input', update);
  el.down.addEventListener('input', update);
  el.terms.forEach((t) => t.addEventListener('change', update));

  update();
}
