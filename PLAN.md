# Dilaras Finesse – Work Plan to Public Launch

## Current state
- Payload CMS 3 + Next.js ecommerce template (`@payloadcms/plugin-ecommerce`), MongoDB, Stripe, Tailwind/shadcn.
- Already present: products/variants, categories, cart, checkout, accounts, orders, layout-builder pages, SEO, tests scaffolding.
- Still template defaults: branding in `.env.example` ("Payload Inc."), seed data (t-shirt), README, no email adapter, no production hosting/storage.

## Phase 1 – Foundation (get it running reliably)
1. Run locally end to end (Mongo, Stripe test keys, seed); fix build/lint/type errors.
2. Fix tooling inconsistencies: `package.json` scripts use `pnpm` but repo has `package-lock.json` (pick one).
3. Set up CI (lint, typecheck, vitest, Playwright) on GitHub Actions.
4. Environment strategy: dev / staging / production, secrets management.

## Phase 2 – Jewelry-specific domain model (plan in detail)
Decisions here shape everything else, so settle them before loading catalog data.
- **Product attributes:** material (gold/silver/platinum), purity (e.g. 925, 14k), gemstone, weight, dimensions, collection, care instructions, handmade/origin.
- **Variants:** ring size (with size guide), chain length, metal/colour. Decide per-variant stock and price.
- **Stock model:** one-off/unique pieces (qty 1) vs. made-to-order vs. restocked items; "sold" state handling.
- **Pricing:** fixed vs. metal-price-linked; currencies (decide now: single currency vs. multi).
- **Extras:** engraving/personalisation field, gift wrapping/message, certificate of authenticity.
- **Media:** high-res multi-angle photos, zoom, optional video; image optimisation settings.
- **Categories/collections:** rings, necklaces, earrings, bracelets, sets, gifts.

## Phase 3 – Storefront & branding
1. Design identity: logo, palette, typography, tone (replace template branding and `.env` values).
2. Homepage, shop listing with filters (material, price, stone, size), search, sorting.
3. Product page: gallery with zoom, size guide, availability, related products.
4. Content pages: About, Contact, FAQ, Care guide, Size guide.
5. Mobile-first polish, accessibility pass (WCAG AA), performance (Lighthouse > 90).

## Phase 4 – Commerce completion
1. Stripe live-mode setup, webhooks verified, payment-failure and refund flows.
2. Shipping (plan in detail): zones, rates, free-shipping threshold, carriers, insured shipping for high-value items, tracking numbers on orders.
3. Tax/VAT: pick rules for target countries (EU OSS / UK VAT), prices incl./excl. tax.
4. Transactional emails (nodemailer adapter is commented out): order confirmation, shipped, password reset, abandoned cart (optional). Use Resend/Postmark/SES.
5. Inventory decrement on payment, oversell protection, low-stock alerts.
6. Order admin workflow: statuses, fulfilment, returns/refunds.
7. Guest checkout, saved addresses, order lookup — verify all work.

## Phase 5 – Legal & trust (required before going public)
- Privacy policy, cookie consent (GDPR/UK GDPR), terms & conditions, returns/refund policy (14-day withdrawal rights for distance selling), shipping policy.
- Company details/imprint, hallmarking and metal-purity compliance statements for your market.
- Trust signals: reviews (later), secure-payment badges, contact info.
- Stripe/payment compliance (business verification).

## Phase 6 – Production infrastructure (plan in detail)
- **Hosting:** Vercel (or VPS/Docker) for Next.js.
- **Database:** MongoDB Atlas with backups and IP/network restrictions.
- **Media storage:** object storage plugin (S3/R2/Vercel Blob); local disk won't persist on serverless.
- **Domain, DNS, HTTPS**, transactional email domain (SPF/DKIM/DMARC).
- **Security:** strong `PAYLOAD_SECRET`, rate limiting on auth/checkout, admin access restricted, access-control review, dependency audit.
- **Observability:** error tracking (Sentry), uptime monitoring, logs, analytics (privacy-friendly).
- **Backups/restore drill** and rollback procedure.

## Phase 7 – Content & pre-launch QA
1. Replace seed data: real products, photography, descriptions, SEO titles/meta, alt text.
2. SEO: sitemap, robots, structured data (Product/Offer JSON-LD), Open Graph, redirects.
3. Full test pass: e2e purchase flow (guest + account), live-mode test payment + refund, cross-browser/mobile, email deliverability.
4. Add/expand Playwright tests for checkout and admin flows.
5. Soft launch (friends/family, discount code) and fix findings.

## Phase 8 – Launch & post-launch
- Switch Stripe to live, point the domain, announce.
- Marketing basics: Google Search Console/Merchant Center, Instagram/Pinterest, newsletter signup.
- Iterate: reviews, wishlist, discount codes, gift cards, abandoned-cart emails, multi-currency, customer feedback.

## Suggested order / milestones
| Milestone | Phases | Outcome |
|---|---|---|
| M1 | 1 | Stable dev environment + CI |
| M2 | 2–3 | Branded jewelry catalog browsable on staging |
| M3 | 4–5 | Full purchase flow, emails, legal pages on staging |
| M4 | 6–7 | Production deployed, real content, QA done |
| M5 | 8 | Public launch |

## Open decisions to resolve early
1. Target countries/currency (drives tax, shipping, legal).
2. Unique pieces vs. repeatable stock vs. made-to-order.
3. Hosting choice and budget.
4. Package manager (npm vs pnpm).
5. Brand name/identity and domain.
