# Dilara's Finesse: e-commerce project guide

This document records the current project status and a proposed plan for turning the
preview into a functional online jewellery shop. It is a planning guide, not an
approved contract, legal advice, or a guarantee that every listed feature is included
in the proposed price. A custom Next.js storefront and backend are the chosen
approach; agree the database, integrations, final scope, responsibilities and costs
with the customer before work starts.

## Current project

The project is a Next.js application. The landing page at `/` is a restored visual
preview; the shop and backend have not yet been built.

- The landing page uses example products and external images. Its bag and wishlist
  interactions are temporary previews, not a working checkout.
- Products, stock, orders and payments are not connected to a backend or database.
  Customer accounts require the email configuration described below.
- `/admin` is an admin-only UI preview using example products. Staff roles can be
  managed, but product, order and stock management are not connected. Do not enter
  real business or customer data.
- The preview includes business, delivery, returns, finance and hallmarking claims.
  The customer must verify or remove these before launch; do not assume they are true.

**Do not use the preview to accept real orders or payments.**

### Running locally

Install the project's dependencies, then run the development server:

```bash
npm ci
npm run dev
```

<<<<<<< HEAD
### Development

1. First [clone the repo](#clone) if you have not done so already
1. `cd my-project && cp .env.example .env` to copy the example environment variables
1. `pnpm install && pnpm dev` to install dependencies and start the dev server
1. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

## How it works

### Landing page

The homepage at `/` is a React and compiled Tailwind CSS adaptation of the supplied
Dilara's Finesse storefront. Its sections and interactive previews are in
[`src/components/Storefront`](src/components/Storefront), with sample products and
images defined in [`data.ts`](src/components/Storefront/data.ts).

The responsive navigation, hero selector, product rail, quick-view, search, wishlist,
and preview bag work without catalogue data. Bag and wishlist selections last only
for the current visit and do not create Payload carts or orders. Category shopping,
social profiles, legal pages, and concierge messaging explicitly indicate that
they are not connected. Connect these to live services before launch, and verify
the supplied boutique, delivery, hallmarking, and financial-regulatory copy.

The page uses Google Fonts through `next/font` and Unsplash images through
`next/image`; font downloads require network access during the build. The original
desktop/mobile preview switcher is intentionally omitted in favour of real responsive
breakpoints. Category dots are decorative because the source supplies only one image
per category.

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel and unpublished content. See [Access Control](#access-control) for more details.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Pages

  All pages are layout builder enabled so you can generate unique layouts for each page using layout-building blocks, see [Layout Builder](#layout-builder) for more details. Pages are also draft-enabled so you can preview them before publishing them to your website, see [Draft Preview](#draft-preview) for more details.

- #### Media

  This is the uploads enabled collection used by pages, posts, and projects to contain media like images, videos, downloads, and other assets. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

- #### Categories

  A taxonomy used to group products together.

- ### Carts

  Used to track user and guest carts within Payload. Added by the [ecommerce plugin](https://payloadcms.com/docs/ecommerce/plugin#carts).

- ### Addresses

  Saves user's addresses for easier checkout. Added by the [ecommerce plugin](https://payloadcms.com/docs/ecommerce/plugin#addresses).

- ### Orders

  Tracks orders once a transaction successfully completes. Added by the [ecommerce plugin](https://payloadcms.com/docs/ecommerce/plugin#orders).

- ### Transactions

  Tracks transactions from initiation to completion, once completed they will have a related Order item. Added by the [ecommerce plugin](https://payloadcms.com/docs/ecommerce/plugin#transactions).

- ### Products and Variants

  Primary collections for product details such as pricing per currency and optionally supports variants per product. Added by the [ecommerce plugin](https://payloadcms.com/docs/ecommerce/plugin#products).

### Globals

See the [Globals](https://payloadcms.com/docs/configuration/globals) docs for details on how to extend this functionality.

- `Header`

  The data required by the header on your front-end like nav links.

- `Footer`

  Same as above but for the footer of your site.

## Access control

Basic access control is setup to limit access to various content based based on publishing status.

- `users`: Users with the `admin` role can access the admin panel and create or edit content, users with the `customer` role can only access the frontend and the relevant collection items to themselves.
- `pages`: Everyone can access published pages, but only admin users can create, update, or delete them.
- `products` `variants`: Everyone can access published products, but only admin users can create, update, or delete them.
- `carts`: Customers can access their own saved cart, guest users can access any unclaimed cart by ID.
- `addresses`: Customers can access their own addresses for record keeping.
- `transactions`: Only admins can access these as they're meant for internal tracking.
- `orders`: Only admins and users who own the orders can access these. Guests require a valid `accessToken` (sent via email) along with the order's email to view order details.

For more details on how to extend this functionality, see the [Payload Access Control](https://payloadcms.com/docs/access-control/overview#access-control) docs.

## User accounts

Registered users can log in to view their order history, manage saved addresses, and track ongoing orders directly from their account dashboard.

## Guests

Guest checkout allows users to complete purchases without creating an account. When a guest places an order:

1. The order is associated with their email address
2. A unique `accessToken` is generated for secure order lookup
3. An order confirmation email is sent containing a secure link to view the order

To look up an order as a guest, users visit `/find-order`, enter their email and order ID, and receive an email with a secure access link. This prevents order enumeration attacks where malicious users could iterate through sequential order IDs to access other customers' order information.

## Layout Builder

Create unique page layouts for any type of content using a powerful layout builder. This template comes pre-configured with the following layout building blocks:

- Hero
- Content
- Media
- Call To Action
- Archive

Each block is fully designed and built into the front-end website that comes with this template. See [Website](#website) for more details.

## Lexical editor

A deep editorial experience that allows complete freedom to focus just on writing content without breaking out of the flow with support for Payload blocks, media, links and other features provided out of the box. See [Lexical](https://payloadcms.com/docs/rich-text/overview) docs.

## Draft Preview

All products and pages are draft-enabled so you can preview them before publishing them to your website. To do this, these collections use [Versions](https://payloadcms.com/docs/configuration/collections#versions) with `drafts` set to `true`. This means that when you create a new product or page, it will be saved as a draft and will not be visible on your website until you publish it. This also means that you can preview your draft before publishing it to your website. To do this, we automatically format a custom URL which redirects to your front-end to securely fetch the draft version of your content.

Since the front-end of this template is statically generated, this also means that pages, products, and projects will need to be regenerated as changes are made to published documents. To do this, we use an `afterChange` hook to regenerate the front-end when a document has changed and its `_status` is `published`.

For more details on how to extend this functionality, see the official [Draft Preview Example](https://github.com/payloadcms/payload/tree/3.x/examples/draft-preview).

## Live preview

In addition to draft previews you can also enable live preview to view your end resulting page as you're editing content with full support for SSR rendering. See [Live preview docs](https://payloadcms.com/docs/live-preview/overview) for more details.

## On-demand Revalidation

We've added hooks to collections and globals so that all of your pages, products, footer, or header changes will automatically be updated in the frontend via on-demand revalidation supported by Nextjs.

> Note: if an image has been changed, for example it's been cropped, you will need to republish the page it's used on in order to be able to revalidate the Nextjs image cache.

## SEO

This template comes pre-configured with the official [Payload SEO Plugin](https://payloadcms.com/docs/plugins/seo) for complete SEO control from the admin panel. All SEO data is fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.

## Search

This template comes with SSR search features can easily be implemented into Next.js with Payload. See [Website](#website) for more details.

## Orders and Transactions

Transactions are intended for keeping a record of any payment made, as such it will contain information regarding an order or billing address used or the payment method used and amount. Only admins can access transactions.

An order is created only once a transaction is successfully completed. This is a record that the user who completed the transaction has access so they can keep track of their history.

### Guest Order Access

Guest users can securely access their orders through the `/find-order` page:

1. Guest enters their email address and order ID
2. If the order exists and matches the email, an access link is sent to their email
3. The link contains a secure `accessToken` that grants temporary access to view the order

This email verification flow prevents unauthorized access to order details. The `accessToken` is a unique UUID generated when the order is created and is required (along with the email) to view order details as a guest.

**Security note:** Order confirmation emails should include the order ID so guests can use the "Find Order" feature. The access token is only sent via the verification email to prevent enumeration attacks.

## Currencies

By default the template ships with support only for USD however you can change the supported currencies via the [plugin configuration](https://payloadcms.com/docs/ecommerce/plugin#currencies). You will need to ensure that the supported currencies in Payload are also configured in your Payment platforms.

## Stripe

By default we ship with the Stripe adapter configured, so you'll need to setup the `secretKey`, `publishableKey` and `webhookSecret` from your Stripe dashboard. Follow [Stripe's guide](https://docs.stripe.com/get-started/api-request?locale=en-GB) on how to set this up.

## Tests

We provide automated tests out of the box for both E2E and Int tests along with this template. They are being run in our CI to ensure the stability of this template over time. You can integrate them into your CI or run them locally as well via:

To run Int tests with Vitest:
=======
Open [http://localhost:3000](http://localhost:3000) for the landing page or
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin preview.
The landing page entry point is [src/app/page.tsx](src/app/page.tsx); the
storefront is in [src/components/Storefront/index.tsx](src/components/Storefront/index.tsx),
with sample data in [src/components/Storefront/data.ts](src/components/Storefront/data.ts).

### MongoDB connection

Set `MONGODB_URI` to the MongoDB connection string and `MONGODB_DB` to the database
name in the root `.env` file. Keep credentials out of version control. The
server-only `connectDb()` helper in [src/lib/mongoDb/index.ts](src/lib/mongoDb/index.ts)
connects Mongoose and returns the underlying database, reusing the connection.
Use it from Node.js server code, not client components or the Edge runtime.

The deployed app also needs both variables configured in its hosting environment,
such as Vercel project settings; local `.env` files are not deployed.

The helper does not connect the preview pages to live data.

### Users collection

Run `npm run db:setup-users` against the intended database to create the `users`
collection, enforce its schema and add a case-insensitive unique email index.
The command is safe to rerun and upgrades the previous known validator to allow
email verification dates; it refuses to replace other validators. Migrate existing
data and schema deliberately before running it against a different collection.

The [user model](src/lib/mongoDb/users.ts) has an email, optional name, `admin` or
`customer` role, and creation and update timestamps. Mongoose manages timestamps for
model writes; direct database writes must set them.
Email lookups must use the index's `{ locale: "en", strength: 2 }` collation.
The model does not implement sign-in or authorisation. Only trusted server code
should assign roles; never let a customer choose an admin role.
The setup and admin scripts use the MongoDB driver for database validation and
transactional provisioning; Mongoose uses the same database and collection.

### Admin authentication

Run `npm run auth:secret` to generate a local Auth.js session secret, then run
`npm run auth:create-admin` in an interactive terminal to create an administrator.
The command prompts for a password and stores only an Argon2id hash. It creates a
new user and will not promote or overwrite an existing account. The MongoDB
deployment must support transactions. Sign in at `/admin/login`. The storefront
footer also links to the admin sign-in.

To assign the first owner, set `ADMIN_EMAIL` to an existing administrator's email
and run `npm run auth:assign-owner`. This updates the users validator and promotes
that account without changing its password; the account must sign in again. The
command refuses to assign a different owner once one exists. Owners and admins can
manage administrators and invitations, but only owners can grant or remove the
owner role. At least one owner must remain. Deploy the updated application before
assigning an owner to a database used by a deployed older version, because older
versions do not recognize the owner role.

At `/admin/staff`, an administrator can create a one-time invitation for a new
administrator and share the link privately. It expires after 24 hours and requires
no email service. Anyone holding the link can accept it; the email is not
independently verified. Invitations are invalidated if the issuing admin loses
access or their session version changes. Existing accounts cannot use invitations;
verified customers can be promoted instead. Links generated on localhost only work
on the local machine; generate links on the deployed site for remote recipients.

Admin sessions are checked against the current MongoDB role on each request.
For both admin and customer sign-in, sessions expire after at most eight hours,
or seven days when "Remember me" is selected. Avoid it on shared devices.
At `/admin/staff`, administrators can promote verified customers or remove another
administrator's access. Role changes revoke the affected user's sessions, and
administrators cannot change their own role. A demoted administrator whose email
is unverified must verify it through customer registration before customer sign-in.
Login attempts are limited per email and globally using MongoDB; the global limit
can temporarily block legitimate logins under attack. Future endpoints and server
actions must perform their own server-side authentication and role checks.
Configure a unique `AUTH_SECRET` and HTTPS in production, and protect database
access. Admin password reset, MFA, audit logging, account lifecycle management,
and deployment-specific abuse protection are not implemented; add and test them
before launch. The preview is not production-ready.

### Customer accounts

The storefront account icon opens customer sign-in and registration. Registration
requires verification of the email address before a password can be chosen. Reset
links are single-use and expire; resetting a password invalidates customer sessions.

Configure `RESEND_API_KEY`, `EMAIL_FROM` (an address on a verified Resend domain)
and `APP_URL` (the site origin, using HTTPS in production) in `.env.local` or the
deployment environment. HTTP localhost is permitted only outside production.
Never commit the API key. Run `npm run db:setup-users` to apply the compatible
validator update. MongoDB must support transactions for registration and recovery.
No emails can be sent until Resend is configured; test delivery using a verified
sender and controlled recipient before launch. The global and per-email throttles
can block legitimate requests under attack and are not a replacement for
deployment-specific abuse controls.

Useful checks:
>>>>>>> migration

```bash
npm run lint
npm run test:users
npx tsc --noEmit
npm run build
```

For the staff integration test, set `TEST_MONGODB_URI` to a MongoDB deployment
that supports transactions and run `npm run test:staff`. The test creates and
removes a uniquely named temporary database and mocks email delivery.

Do not treat a successful development-page load as evidence that the whole application
is ready for production.

## 1. Commerce architecture

The shop will use a custom Next.js storefront and backend, with the existing project
as a starting point. This gives more control over the implementation and data model,
but also brings greater development, testing, security and maintenance responsibility.

Next.js does not by itself provide product management, a database, checkout or
order fulfilment. The database, backend deployment, payment provider, email service
and other integrations still need to be chosen. A hosted payment provider remains an
option for securely processing payments. Confirm the scope against the proposed
budget; a custom backend and administration area may require a revised estimate.

## 2. Discovery and scope

Agree and document the following before design or development:

- Business goals, target customers and the initial sales regions.
- Number of products at launch, product categories and variations such as size,
  finish or gemstone.
- Whether products are in stock, made to order or personalised.
- Whether stock is shared with physical shops and, if so, how it will be updated.
- Prices, currency and applicable tax treatment, confirmed by the business and its
  accountant.
- Delivery destinations, charges, expected times, insurance and tracking.
- Returns, cancellations, faulty goods, customer support and refund processes.
- Who provides product information, photographs, logo, copy, legal text and policies.
- Who manages products, orders, stock and customer enquiries after launch.
- Whether existing products, customers or orders need to be migrated.
- Required integrations, payment methods, accounts and access.
- Accessibility, supported devices, acceptance criteria and launch responsibilities.

### Suggested first release

Subject to agreement, a small first release could include:

- Responsive home, shop, product, contact and policy pages.
- Product categories, product details and a working basket.
- Guest checkout with one payment provider.
- UK delivery options and clearly displayed charges.
- Order confirmation and a practical way for the owner to manage products, stock
  and orders.
- Testing, deployment and handover.

Customer accounts are optional if the business has a suitable guest-checkout and
order-support process. Consider pricing the following separately unless specifically
included: customer accounts, wishlists, reviews, loyalty points, gift cards, discount
codes, international shipping, multiple currencies, finance, advanced reporting,
automated physical-shop stock synchronisation and custom product configurators.

The agreed specification should state what is included and excluded, who supplies
content, how changes are priced, who approves each stage, the timetable assumptions,
third-party costs and what counts as completion.

## 3. Design

Present three initial visual directions for the customer to consider. For example:

1. Luxury and minimal: neutral colours, large images and elegant typography.
2. Traditional jewellery boutique: warmer colours and a heritage-focused presentation.
3. Modern editorial: stronger photography and a contemporary layout.

The customer selects one direction to refine and apply to the agreed pages. Agree
the number of revision rounds in advance; two rounds after selection is one possible
proposal, not an existing commitment.

Design should cover branding, desktop and mobile layouts, navigation, product and
category pages, basket and checkout journeys, contact and policy pages, and
appropriate loading, empty and error states.

The customer should supply or approve accurate product details, prices, photographs,
logo files, brand copy and business information. Use images and other content only
with appropriate permission. Verify all claims before publishing them.

## 4. Customer-facing development

### Core experience

- **Home:** brand introduction, featured products or collections, navigation and
  contact information.
- **Shop:** categories, product names, images and prices; availability indicators;
  and agreed sorting, filtering or pagination.
- **Product page:** images, description, price, materials, fineness, applicable
  hallmark details, dimensions, stone information, variations, stock, delivery
  information and add-to-basket action, as relevant to the product.
- **Basket:** add, remove and change quantities; show chosen variations, prices and
  subtotal; handle unavailable items and price changes; persist the basket as agreed.
- **Checkout:** guest email, necessary address details, delivery choices and charges,
  clear final order total, payment, error handling and confirmation.

Prices, stock and final totals must be calculated or verified by trusted server-side
code, not accepted solely from browser input.

### Accessibility and mobile

Aim for WCAG 2.2 AA as a practical target and test real customer journeys. Check
keyboard navigation and focus, form labels and errors, contrast, image descriptions,
screen-reader access, mobile controls and text resizing. Automated checks alone are
not enough.

## 5. Commerce data and administration

Design and migrate a database appropriate to the agreed custom backend and features.
A typical shop may need:

| Record | Purpose |
| --- | --- |
| Products, categories and images | Catalogue, descriptions, media and publication status |
| Product variations and inventory | Sizes or finishes, SKUs, prices and stock |
| Carts | Products selected before purchase |
| Orders and order items | Purchase details and a snapshot of item names and prices at purchase |
| Payments and refunds | Provider references, amounts and statuses; never raw card details |
| Addresses and customers | Necessary delivery, billing and contact details |

Discounts, reviews, wishlists, gift cards and other records are optional, depending
on the agreed scope. Use integer minor units such as pence for money and record the
currency. Restrict access, validate data on the server, collect only necessary
personal data and plan retention, backups and recovery.

The owner needs an agreed way to add and edit products, manage prices and stock,
view orders, mark dispatches and handle refunds. A custom administration area
requires its own design, implementation and testing; agree its scope and cost.

### Inventory and order workflow

Agree whether stock is tracked per product or variation, whether backorders are
allowed, how made-to-order goods are handled and how physical-shop stock is updated.
Protect against overselling and define what happens if payment succeeds but stock
is no longer available.

Track payment and fulfilment separately. An order may be awaiting payment, paid,
being prepared, dispatched, cancelled or refunded. The owner needs a way to identify
new paid orders and resolve payment failures, cancellations and refunds. Some
notifications can initially be handled in the provider's dashboard if agreed.

## 6. Payments

The customer should own the payment-provider account and complete its business and
identity verification. A provider-hosted checkout is a practical option for reducing
the application's exposure to card data. Do not store card numbers, CVV codes or
other raw card details in the shop.

An integration must handle successful, failed and cancelled payments; authentication
challenges where required; customers closing the browser; refunds and disputes; and
reconciliation between orders and payments. A visit to a confirmation page alone
is not proof of payment.

For a custom integration:

- Create payment sessions using trusted product, price and delivery data.
- Verify provider notifications and record payment results reliably.
- Handle repeated or delayed notifications without duplicate orders or stock changes.
- Plan for payment success when stock or order processing fails.
- Test in the provider's test mode before controlled live testing.

Hosted checkout reduces scope but does not automatically remove all payment-security
responsibilities. The business should confirm applicable PCI requirements with its
provider and acquiring bank. See the [PCI Security Standards Council's guidance
on hosted and embedded payment pages](https://blog.pcisecuritystandards.org/faq-clarifies-new-saq-a-eligibility-criteria-for-e-commerce-merchants).

## 7. Delivery, returns and emails

Agree delivery regions, methods, prices, expected times, insurance, tracking, lost
or damaged parcels and any click-and-collect process. Do not advertise a service the
business cannot provide.

Document how customers request cancellations, return items, report faults and receive
refunds, including who pays return postage where legally permitted. UK distance
selling and faulty-goods rules provide different protections, with conditions and
exceptions. Have the final policy checked for the products sold. See
[GOV.UK: accepting returns and giving refunds](https://www.gov.uk/accepting-returns-and-giving-refunds).

At minimum, consider customer order confirmation and owner new-order notification.
Dispatch and refund confirmations can also be included if agreed. Use a suitable
transactional email provider, configure relevant domain authentication such as SPF,
DKIM and DMARC, and test delivery. Marketing emails are separate from transactional
emails and need their own compliant process.

## 8. Legal, privacy and jewellery-specific review

This guide is not legal or accounting advice. The customer should seek appropriate
professional advice and approve the final policies and business information.

- **Business and online sales:** show accurate business identity and contact details,
  product prices, applicable charges, delivery arrangements and terms. Make clear
  when an order creates an obligation to pay. See
  [GOV.UK: online selling](https://www.gov.uk/online-and-distance-selling-for-businesses/online-selling).
- **Privacy:** identify what personal data is collected, why, which providers receive
  it, retention periods, security and customer rights. The privacy notice must match
  the actual services used.
- **Cookies and similar technologies:** audit analytics, advertising, embeds and
  other storage or access. Consent is generally needed for non-exempt uses. A
  limited statistical-purpose exception has conditions, including an objection
  mechanism; do not assume every analytics tool qualifies. See the
  [ICO's guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/).
- **Hallmarking:** verify whether each precious-metal item requires a hallmark,
  whether exemptions apply, whether descriptions are accurate and whether the
  appropriate Dealer's Notice or hallmark information is displayed. See
  [GOV.UK: hallmarking compliance](https://www.gov.uk/guidance/hallmarking-how-businesses-can-comply-with-the-law).
- **Product safety:** review applicable material restrictions, product information
  and supplier traceability. See [GOV.UK: product safety advice](https://www.gov.uk/guidance/product-safety-advice-for-businesses).
- **Tax and international sales:** confirm VAT and record-keeping with an accountant.
  International sales may introduce additional tax, customs, delivery and consumer
  law requirements; a UK-only first release can reduce complexity.
- **Preview claims:** verify or remove all claims about delivery, returns, finance,
  FCA authorisation, hallmarking, locations and other business details before launch.

## 9. Security, ownership and recovery

- Use HTTPS, secure hosting and database configuration, and appropriate separation
  between development, test and live environments.
- Use strong credentials, multi-factor authentication and individual administrator
  accounts with role-appropriate access.
- Protect secrets; validate data, prices, stock and permissions on the server.
- Protect sensitive endpoints, keep dependencies updated and log errors without
  unnecessarily exposing personal information.
- Use a proven authentication solution if customer accounts are added; do not invent
  password-storage or authentication security.
- Set up backups, test restoration and define an incident-response process.
- The customer should own or have administrator access to the domain, hosting,
  payment provider, commerce or database service, email provider, analytics and
  source repository as agreed. Developer access should be granted separately.

## 10. Testing and launch

### Before launch

- [ ] Replace example products, images, prices and contact details with approved data.
- [ ] Verify business claims and publish approved terms, privacy, delivery and
      returns information.
- [ ] Test categories, products, variations and basket changes.
- [ ] Test guest checkout, delivery charges, payment success, failure and cancellation.
- [ ] Test browser closure during payment, provider notifications, duplicate events,
      order creation, emails and refunds.
- [ ] Test stock shortages and price changes between basket and checkout.
- [ ] Confirm the owner can manage products, stock and orders.
- [ ] Test key journeys on agreed devices and browsers, including accessibility.
- [ ] Run the production build, type checks and relevant automated tests.
- [ ] Configure live domain, HTTPS, credentials, backups, monitoring and email.
- [ ] Confirm the payment account is approved and switch from test to live mode.
- [ ] Check indexing and sitemap, and agree a rollback plan.
- [ ] If the customer agrees, place a controlled live test order and refund or fulfil it.
- [ ] Obtain customer acceptance and complete handover.

Agree acceptance criteria in advance. A working home page or payment confirmation
screen alone does not demonstrate that the complete order-to-dispatch process works.

## 11. After launch

### Business operations

The business needs to check and fulfil orders, keep stock and prices accurate,
answer enquiries, manage returns and refunds, and investigate payment problems.
Someone must own product updates, content, policy reviews and customer service.

### Technical maintenance

Assign responsibility for dependency and platform updates, security advisories,
uptime and error monitoring, failed emails and payment notifications, backups and
restore tests, account access reviews, renewals and provider costs. Maintain a
process for incidents, recovery and urgent support.

Agree a separate support arrangement covering fees, support hours, response targets,
included routine maintenance, exclusions, urgent work, new features and termination.
Do not assume ongoing support or product entry is included in the build fee.

## 12. Costs, estimate and commercial terms

The proposed development estimate discussed with the customer is **£2,500**, subject
to agreeing the database, integrations and a clearly limited scope. The suggested
payment split is:

| Milestone | Payment |
| --- | ---: |
| Project start | 30%: £750 |
| Chosen design and agreed front-end pages approved | 40%: £1,000 |
| Agreed shop features pass acceptance testing and are ready for handover | 30%: £750 |

Define the milestones, acceptance process, tax treatment and payment terms in the
final agreement. Significant backend, payment and testing work may remain after the
front-end milestone. A fully custom shop may require a revised estimate.

For context, £2,500 over 100 hours is £25/hour; over 150 hours it is approximately
£16.67/hour; over 200 hours it is £12.50/hour. These are illustrations, not a time
estimate, and are before tax and business expenses.

Unless expressly included, the customer should budget separately for domain renewal,
hosting or platform subscriptions, database, payment transaction fees, email,
storage, backups and monitoring, paid apps or plugins, maintenance and support,
legal/accounting advice, photography, copywriting and marketing. Obtain current
quotes for the chosen services before making commitments.

Before work starts, agree revision limits, product-entry quantities, ownership of
content and accounts, scope exclusions, a bug-fix period, how changes are priced,
responsibilities for third-party costs and how delays or acceptance are handled.

## Proposed stages

1. **Discovery:** agree requirements, database, integrations, scope and responsibilities.
2. **Design:** present three directions and refine the selected one.
3. **Front end:** build and approve the agreed responsive pages.
4. **Commerce:** connect catalogue, stock, basket, checkout and order management.
5. **Testing:** verify purchase, administration, fulfilment and refund workflows.
6. **Launch:** configure live services, complete acceptance and hand over access.
7. **Maintenance:** operate, support and improve the shop under a separate agreement.
