# product-requirements.md — Product Requirements Document for KhazanaScoop Ecommerce Website

## 1. Product Name

KhazanaScoop Ecommerce Website

> Final brand name: KhazanaScoop.

---

## 2. Product Summary

KhazanaScoop is a mobile-first ecommerce website for selling cute mystery scoop boxes, build-your-own boxes, and individual cute products. The website should reduce dependence on Instagram DMs by clearly explaining prices, item counts, variants, policies, and order notes.

The core buying experience should be simple:

**Choose scoop → select size → add preferences → prepaid checkout → order packed and shipped.**

---

## 3. Problem Statement

The current business depends heavily on Instagram content and manual explanation. Customers may ask repeated questions such as:

- What is a mystery scoop?
- What will I get inside?
- Can I choose products?
- Can I tell what I do not want?
- What is the price?
- Is shipping included?
- Are returns allowed?

This creates friction before purchase and increases manual work. The website should solve this by making the product concept, pricing, and ordering process self-explanatory.

---

## 4. Goals

## 4.1 Business Goals

1. Increase conversion from Instagram traffic.
2. Reduce repetitive DM queries.
3. Improve customer trust through clear product pages.
4. Enable prepaid checkout.
5. Capture order preferences clearly.
6. Make fulfilment easier for the owner.
7. Create a brand experience that feels cute, premium, and organized.

## 4.2 Customer Goals

1. Understand what they are buying.
2. Compare scoop sizes easily.
3. Mention what they do not want.
4. Buy quickly on mobile.
5. Feel confident that the brand is real and trustworthy.
6. Get clear expectations about surprise products.

---

## 5. Target Users

## 5.1 Primary User: Young Buyer

### Profile

- Age: 16–28
- Comes from Instagram reels/stories
- Likes cute stationery, accessories, surprise boxes, gifting items
- Shops on mobile

### Needs

- Cute visual experience
- Affordable options
- Easy checkout
- Trust that the box will be worth it

## 5.2 Secondary User: Gift Buyer

### Profile

- Buying for friend, sibling, cousin, girlfriend, daughter, or niece
- May not understand the exact product categories
- Wants a cute gift without choosing every item

### Needs

- Simple explanation
- Giftable packaging
- Occasion note
- Reliable shipping

## 5.3 Tertiary User: Careful Custom Buyer

### Profile

- Likes cute products but does not want full surprise
- Wants to avoid some categories
- May have specific colour/product preferences

### Needs

- Build Your Own Scoop option
- Preference form
- Clear disclaimer about stock availability

---

## 6. Value Proposition

## 6.1 Main Value Proposition

“Cute surprise boxes filled with handpicked accessories, stationery, beauty minis, and little happy finds — packed with care and customized through your notes wherever possible.”

## 6.2 Supporting Value Points

- Clear scoop sizes and item counts
- Special notes accepted
- Build-your-own option
- Cute gifting-friendly products
- Prepaid, organized ordering
- Soft playful brand experience

---

## 7. MVP Scope

## 7.1 In Scope

### Customer Website

- Home page
- Mystery Scoop product page
- Build Your Own Scoop product page
- Cute Essentials collection page
- Individual product pages
- Cart
- Checkout
- Order notes
- FAQ
- Policy pages
- Contact page

### Ecommerce Features

- Product listing
- Product categories
- Product variants
- Add to cart
- Quantity update
- Remove from cart
- Prepaid payment
- Order confirmation
- Basic shipping/tracking update

### Admin Features

- Product management
- Variant management
- Inventory view/update
- Order management
- View customer notes
- Update order status
- Add tracking number

### Marketing/Trust Features

- Announcement bar
- Customer reviews
- Product examples
- FAQ preview
- Instagram/social proof section
- Meta Pixel / basic analytics

## 7.2 Out of Scope for MVP

- Customer mobile app
- Loyalty points
- Referral program
- Advanced coupon engine
- Full CRM
- AI packing recommendation system
- Automated WhatsApp flows
- COD flow
- Marketplace seller dashboard
- Multi-vendor support
- Complex returns portal

---

## 8. Product Requirements

## 8.1 Home Page Requirements

### Requirement
The home page must explain the brand and guide users to the main buying options.

### Must Include

- Announcement bar
- Hero section
- Shop Mystery Scoops CTA
- Build My Scoop CTA
- How it works
- Scoop comparison
- Category browsing
- Product examples
- Reviews
- FAQ preview
- Footer

### Acceptance Criteria

- User understands the concept without opening Instagram DMs.
- Primary CTA leads to Mystery Scoop page.
- Secondary CTA leads to Build Your Own page.
- Page is fully responsive.

---

## 8.2 Mystery Scoop Product Requirements

### Requirement
Users must be able to choose a mystery scoop size and understand what they may receive.

### Variants

| Variant | Item Count | Price |
|---|---:|---:|
| Small Scoop | 7–8 products | ₹549 |
| Medium Scoop | 12–15 products | ₹999 |
| Large Scoop | 20–22 products | ₹1499 |

### Must Include

- Product image gallery
- Variant cards
- Dynamic price
- Item count
- Add to cart
- Buy now
- Special notes explanation
- Important notes
- Similar products

### Acceptance Criteria

- User can select a variant.
- Selected variant is visually highlighted.
- Price updates correctly.
- User can add product to cart.
- User can see that product selection is surprise-based.
- User can see where to add avoid notes.

---

## 8.3 Build Your Own Scoop Requirements

### Requirement
Users must be able to buy a semi-customized scoop by sharing preferences.

### Variants

| Variant | Item Count | Price |
|---|---:|---:|
| Small BYO | 8–9 items | ₹699 |
| Medium BYO | 14–15 items | ₹1199 |
| Large BYO | 22–25 items | ₹1699 |

### Preference Fields

- Favourite colours
- Loved product categories
- Avoid product categories
- Occasion
- Extra packing note

### Acceptance Criteria

- User can select BYO size.
- User can enter preferences.
- Preferences are stored with cart/order.
- User sees disclaimer that preferences depend on stock.

---

## 8.4 Collection Page Requirements

### Requirement
Users must be able to browse individual cute products.

### Must Include

- Collection title
- Short description
- Category chips
- Sort dropdown
- Product grid
- Product cards
- Add to cart buttons

### Product Categories

- Hair Accessories
- Stationery
- Keychains & Charms
- Beauty Minis
- Pocket Mirrors
- Scrunchies
- Cute Pens
- Stickers & Notes
- Surprise Gifts

### Acceptance Criteria

- Product grid loads correctly.
- User can browse by category.
- Product cards show price and image.
- User can add products to cart.

---

## 8.5 Cart Requirements

### Requirement
Cart must allow users to review products and add notes before checkout.

### Must Include

- Product summary
- Variant name
- Quantity controls
- Remove item option
- Order notes box
- Price summary
- Checkout button
- Policy reminders

### Acceptance Criteria

- User can update quantity.
- User can remove products.
- User can add order note.
- Order note appears in order details.
- Checkout button works on mobile.

---

## 8.6 Checkout Requirements

### Requirement
Users must complete prepaid checkout securely.

### Must Include

- Customer contact details
- Shipping address
- Order summary
- Payment gateway
- Payment verification
- Order confirmation

### Acceptance Criteria

- Payment is verified server-side.
- Order is created only after successful payment.
- User receives order confirmation.
- Admin receives order details.

---

## 8.7 Admin Requirements

### Requirement
Admin must manage products, inventory, and orders.

### Admin Product Features

- Add product
- Edit product
- Add images
- Add variants
- Set price
- Set stock
- Set product status

### Admin Order Features

- View orders
- Filter by status
- View customer notes
- Update packing status
- Add tracking number
- Mark shipped/delivered

### Acceptance Criteria

- Admin can view all paid orders.
- Admin can see selected variant and customer notes.
- Admin can update fulfilment status.
- Admin can update tracking details.

---

## 9. User Stories

## 9.1 Customer Stories

### Story 1
As a first-time visitor, I want to understand what a mystery scoop is so that I feel confident buying it.

### Story 2
As a buyer, I want to compare scoop sizes so that I can choose the best one for my budget.

### Story 3
As a buyer, I want to mention what I do not want so that I do not receive unwanted categories.

### Story 4
As a gift buyer, I want to add an occasion note so that the box feels suitable for gifting.

### Story 5
As a careful buyer, I want to build my own scoop so that I get more control than a full mystery box.

### Story 6
As a mobile user, I want checkout to be quick so that I can order without leaving Instagram for too long.

## 9.2 Admin Stories

### Story 1
As an admin, I want to see customer notes clearly so that I can pack better orders.

### Story 2
As an admin, I want to update order status so that customers can know their order progress.

### Story 3
As an admin, I want to manage inventory so that I do not oversell products.

### Story 4
As an admin, I want to see paid orders only for fulfilment so that fake/unpaid orders do not waste time.

---

## 10. Functional Requirements

## 10.1 Product Catalogue

- System must support product categories.
- System must support product variants.
- System must support multiple product images.
- System must support product status: active, draft, archived.
- System must support pricing and compare-at pricing.

## 10.2 Cart

- System must allow add to cart.
- System must allow quantity update.
- System must allow item removal.
- System must store selected variant.
- System must store order notes.

## 10.3 Checkout

- System must calculate subtotal, shipping, and total.
- System must support prepaid payment.
- System must verify payment before creating paid order.
- System must generate order ID.

## 10.4 Orders

- System must store customer details.
- System must store order line items.
- System must store order notes.
- System must store payment status.
- System must store fulfilment status.
- System must store tracking number.

## 10.5 Admin

- System must require admin login.
- Admin must manage products.
- Admin must manage variants.
- Admin must view orders.
- Admin must update statuses.
- Admin must update tracking details.

---

## 11. Non-Functional Requirements

## 11.1 Performance

- Website should load quickly on mobile.
- Product images must be optimized.
- Lazy loading should be used for below-the-fold images.
- Core shopping pages should not feel heavy.

## 11.2 Reliability

- Payment verification must be reliable.
- Orders should not be duplicated on refresh.
- Failed payments should not create paid orders.

## 11.3 Usability

- Buttons should be large enough for mobile taps.
- Variant selection should be visual.
- Order notes should be easy to find.
- Important notes should not be hidden.

## 11.4 Security

- Admin routes must be protected.
- Payment amount must be verified on server.
- User inputs must be sanitized.
- Customer data must not be exposed.

## 11.5 SEO

- Product pages must have SEO titles and descriptions.
- Images must have alt text.
- URLs must be readable.

---

## 12. Content Requirements

## 12.1 Required Product Copy

### Mystery Scoop Short Copy
“A cute surprise box filled with handpicked products from our collection.”

### Special Notes Copy
“Don’t want a specific category? Mention it in order notes. We’ll try our best to avoid it based on available stock.”

### Important Note Copy
“Mystery scoops are surprise-based. Product designs, colours, and combinations may vary. These boxes are non-returnable and non-exchangeable unless the product arrives damaged or wrong.”

## 12.2 FAQ Questions

1. What is a mystery scoop?
2. Can I choose products?
3. Can I mention what I do not want?
4. Will all boxes be the same?
5. Are mystery scoops returnable?
6. How long does shipping take?
7. Is Cash on Delivery available?
8. Can I gift this to someone?

---

## 13. Analytics Requirements

The product must track:

- Page views
- Product views
- Variant selection
- Add to cart
- Cart open
- Checkout start
- Payment success
- Order creation

## 13.1 Success Metrics

| Metric | Why It Matters |
|---|---|
| Product page conversion rate | Shows whether product page is convincing |
| Add-to-cart rate | Shows whether pricing/variants are clear |
| Checkout completion rate | Shows whether checkout is smooth |
| Cart abandonment rate | Shows friction before payment |
| Average order value | Shows revenue quality |
| Repeat purchase rate | Shows customer satisfaction |
| DM reduction | Shows website clarity |

---

## 14. Launch Requirements

Before launch:

- [ ] Product prices finalized
- [ ] Product images uploaded
- [ ] Policies written
- [ ] Payment gateway tested
- [ ] Order notes tested
- [ ] Admin order flow tested
- [ ] Mobile checkout tested
- [ ] Meta Pixel installed
- [ ] GA4 installed
- [ ] Test order completed
- [ ] Shipping/tracking process tested

---

## 15. MVP Milestones

## Milestone 1 — Design and Content

- Finalize brand colours
- Finalize fonts
- Finalize homepage copy
- Finalize product copy
- Finalize FAQ/policies

## Milestone 2 — Storefront

- Build home page
- Build product page
- Build collection page
- Build cart

## Milestone 3 — Ecommerce Logic

- Product/variant system
- Cart system
- Checkout
- Payment integration
- Order creation

## Milestone 4 — Admin

- Admin login
- Product management
- Order management
- Status/tracking update

## Milestone 5 — Launch QA

- Mobile testing
- Payment testing
- Order note testing
- Analytics testing
- SEO checks
- Final launch

---

## 16. Risks and Mitigations

| Risk | Description | Mitigation |
|---|---|---|
| Customer confusion | Customer may not understand mystery concept | Use How It Works, What’s Inside, FAQ |
| Preference mismatch | Customer may expect exact customization | Add clear “try our best based on stock” copy |
| Overselling | Stock may not be updated | Add inventory workflow and admin checklist |
| Low trust | New brand may seem risky | Use reviews, real photos, policies, Instagram proof |
| Checkout drop-off | Too many steps may reduce sales | Keep checkout prepaid and simple |
| Too childish design | May reduce perceived value | Use minimal layout and premium spacing |

---

## 17. Final Product Requirement Summary

The MVP must focus on one core promise:

**Make cute mystery scoop buying clear, exciting, and trustworthy.**

The product should help customers quickly understand what they get, choose a size, add preferences, and pay online. The admin side should make it easy to view orders, read notes, pack correctly, and ship quickly.
