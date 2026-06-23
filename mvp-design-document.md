# mvp-design-document.md — MVP Design Document for Khazana Scoop Ecommerce Website

## 1. Overview

Khazana Scoop is a playful-minimal ecommerce website for selling mystery scoop boxes, build-your-own boxes, and cute individual products. The MVP should focus on mobile-first shopping, clear product explanation, simple checkout, and easy order management for the business owner.

The design is inspired by:

- Clean category-led browsing from Korean-style ecommerce stores.
- Clear mystery-product explanation from strong single-product pages.
- Soft pastel branding with rounded UI and cute but readable typography.

---

## 2. MVP Objectives

## 2.1 Business Objectives

1. Convert Instagram visitors into prepaid website orders.
2. Explain the mystery scoop concept clearly.
3. Reduce manual DM-based price explanation.
4. Capture customer preferences during checkout.
5. Make order fulfilment easier through structured order notes.
6. Build trust with product examples, reviews, policies, and transparent notes.

## 2.2 User Objectives

1. Understand what a mystery scoop is.
2. Compare scoop sizes and prices easily.
3. Mention what they do not want.
4. Buy quickly from mobile.
5. Track/contact brand after order.

---

## 3. Design Principles

## 3.1 Playful but Minimal

Use cute colours, rounded corners, and soft illustrations, but keep layout clean. The product images and scoop cards should be the focus.

## 3.2 Mobile First

Most traffic will likely come from Instagram, so all important actions must be thumb-friendly:

- Sticky mobile header
- Sticky add-to-cart on product page
- Large variant cards
- Easy cart note section
- Fast checkout

## 3.3 Clarity Before Cuteness

A mystery product website must explain expectations clearly. The user should always know:

- Item count
- Price
- That exact products may vary
- How to write special notes
- Return/exchange rules

## 3.4 Trust Over Fake Urgency

Avoid fake stock counters and fake countdown timers. Use real trust:

- Reviews
- Product examples
- Packing photos
- Clear policy notes
- Instagram proof

---

## 4. Visual Design System

## 4.1 Colour Palette

| Token | Usage | Hex |
|---|---|---|
| `--cream-milk` | Main background | `#FFF8F1` |
| `--soft-white` | Cards | `#FFFFFF` |
| `--berry-pink` | Primary CTA | `#FF6F91` |
| `--deep-berry` | CTA hover | `#E85D7F` |
| `--butter-yellow` | Offer bar / badges | `#FFE8A3` |
| `--baby-pink` | Soft sections | `#FFD6E8` |
| `--mint-cream` | Trust sections | `#D8F5E6` |
| `--soft-lavender` | Decorative sections | `#E6D9FF` |
| `--cocoa-brown` | Main text | `#2C2521` |
| `--warm-taupe` | Muted text | `#7A6A61` |
| `--biscuit-beige` | Border | `#F0DFD6` |

## 4.2 Typography

### Recommended Fonts

- Headings: Fredoka
- Body: Nunito Sans
- Buttons/labels: Fredoka Medium/SemiBold

### CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --font-heading: 'Fredoka', sans-serif;
  --font-body: 'Nunito Sans', sans-serif;
}

body {
  font-family: var(--font-body);
  background: #FFF8F1;
  color: #2C2521;
}

h1, h2, h3, h4, .button, .badge, .nav-link {
  font-family: var(--font-heading);
}
```

## 4.3 Spacing and Layout

| Element | Desktop | Mobile |
|---|---:|---:|
| Max container width | 1280px | 100% |
| Page padding | 40px | 16px |
| Section spacing | 72px | 44px |
| Card radius | 20px | 18px |
| Button radius | 999px | 999px |
| Product grid | 4 columns | 2 columns |

---

## 5. Information Architecture

## 5.1 Main Navigation

- Home
- Mystery Scoops
- Build Your Scoop
- Cute Essentials
- New In
- Offers
- Track Order

## 5.2 Footer Navigation

### Shop
- Mystery Scoops
- Build Your Scoop
- Cute Essentials
- New In
- Offers

### Help
- Shipping Policy
- Return / Refund Policy
- Track Order
- FAQ
- Contact Us

### About
- Our Story
- Instagram
- Customer Reviews

---

## 6. MVP Pages

## 6.1 Home Page

### Purpose
Explain the brand and route users to the correct buying path.

### Sections

1. Announcement bar
2. Header
3. Hero
4. How it works
5. Choose your scoop
6. Build your own scoop
7. Shop by category
8. What can come inside
9. Customer reviews
10. FAQ preview
11. Footer

### Hero Content

**Heading:** Cute surprises, packed just for you.

**Subheading:** Pick a mystery scoop or build your own box with adorable stationery, accessories, beauty minis, and little happy finds.

**Primary CTA:** Shop Mystery Scoops  
**Secondary CTA:** Build My Scoop

### Acceptance Criteria

- User can reach Mystery Scoop page from hero.
- User can reach Build Your Own page from hero.
- Home page explains the concept in simple language.
- Page works well on mobile.

---

## 6.2 Mystery Scoop Product Page

### Purpose
Convert customers by making scoop variants clear.

### Above-the-Fold Components

- Product image gallery
- Product title
- Short explanation
- Variant selector cards
- Dynamic price
- Add to cart
- Buy now
- Trust chips
- Sticky mobile CTA

### Variant Cards

| Variant | Items | Price | Badge |
|---|---:|---:|---|
| Small Scoop | 7–8 | ₹549 | Starter Pick |
| Medium Scoop | 12–15 | ₹999 | Best Value |
| Large Scoop | 20–22 | ₹1499 | Big Surprise |

### Content Sections

1. Mystery Scoop — Surprise Inside
2. Available Variants
3. What’s Inside the Box?
4. Special Notes
5. Important Notes
6. Why Customers Love It
7. Similar Products

### Acceptance Criteria

- User can select a scoop size.
- Price updates based on selected variant.
- Item count is visible before add to cart.
- Notes about surprise variation are visible.
- Product can be added to cart.

---

## 6.3 Build Your Own Scoop Page

### Purpose
Allow customers to buy a semi-customized scoop.

### Components

- Product gallery
- Variant selector
- Preference form
- Add to cart
- Important availability note

### Variants

| Variant | Items | Price |
|---|---:|---:|
| Small BYO | 8–9 | ₹699 |
| Medium BYO | 14–15 | ₹1199 |
| Large BYO | 22–25 | ₹1699 |

### Preference Form

- Favourite colours
- Loved categories
- Avoid categories
- Occasion
- Extra note

### Acceptance Criteria

- User can select BYO size.
- User can submit preferences.
- Preferences appear in cart/order details.
- User sees disclaimer that preferences depend on available stock.

---

## 6.4 Collection Page

### Purpose
Allow browsing of individual products and categories.

### Components

- Collection hero
- Category chips
- Filter row
- Sort dropdown
- Product grid
- Product cards
- Recently viewed

### Product Card Elements

- Product image
- Badge if applicable
- Product title
- Price
- Add to cart
- Optional rating

### Acceptance Criteria

- Products display in grid.
- User can filter or browse categories.
- User can add products to cart.
- Mobile grid uses 2 columns.

---

## 6.5 Cart Page

### Purpose
Help users review order and add preference notes.

### Components

- Cart items
- Quantity controls
- Price summary
- Order notes field
- Policy reminders
- Recommended add-ons
- Checkout button

### Cart Notes Helper Text

“Mention anything you want us to avoid: no earrings, no keychains, no hair clips, etc.”

### Acceptance Criteria

- User can update quantity.
- User can remove items.
- User can add order note.
- Order note is carried to checkout/order.
- Checkout button is visible on mobile.

---

## 6.6 Checkout Page

### Purpose
Complete prepaid purchase.

### MVP Requirements

- Contact details
- Shipping address
- Order summary
- Order note review
- Online payment
- Order confirmation

### Acceptance Criteria

- User can pay online.
- Order is created only after payment verification.
- Customer receives confirmation.
- Admin can see order.

---

## 6.7 Static Pages

MVP should include:

- About Us
- Contact Us
- FAQ
- Shipping Policy
- Return / Refund Policy
- Privacy Policy
- Terms & Conditions

---

## 7. Component Design

## 7.1 Announcement Bar

### Content Examples

- Free shipping on prepaid orders
- Every scoop comes with cute surprises
- New products added weekly
- Build your own scoop available

### Style

- Butter yellow background
- Cocoa brown text
- 34–38px height
- Small Fredoka text

## 7.2 Header

### Desktop

- Logo left
- Navigation center
- Search/account/cart right

### Mobile

- Hamburger left
- Logo center
- Cart right
- Full-screen menu drawer

## 7.3 Buttons

### Primary Button

- Berry pink background
- White text
- Pill radius
- Used for Add to Cart, Buy Now, Checkout

### Secondary Button

- White background
- Beige border
- Cocoa text
- Used for alternative actions

## 7.4 Variant Cards

Each variant card should include:

- Variant name
- Item count
- Price
- Short best-for line
- Badge if applicable

Selected state:

- Pink border
- Very light pink background
- Small checkmark icon

## 7.5 Product Cards

Each product card should include:

- Square product image
- Rounded image corners
- Product name
- Price
- Badge
- Add-to-cart button

## 7.6 Info Boxes

Use for important mystery scoop notes.

Style:

- Light yellow background
- Beige border
- Rounded corners
- Short bullet points

---

## 8. Data Model

## 8.1 Product

| Field | Type | Description |
|---|---|---|
| id | string | Unique product ID |
| name | string | Product name |
| slug | string | URL slug |
| description | text | Product description |
| productType | enum | mystery_scoop, build_your_own, individual |
| category | string | Product category |
| images | array | Product image URLs |
| status | enum | active, draft, archived |
| tags | array | New, Best Seller, Under ₹99 |
| createdAt | datetime | Created timestamp |
| updatedAt | datetime | Updated timestamp |

## 8.2 Variant

| Field | Type | Description |
|---|---|---|
| id | string | Variant ID |
| productId | string | Linked product |
| name | string | Small / Medium / Large |
| itemCountMin | number | Minimum item count |
| itemCountMax | number | Maximum item count |
| price | number | Selling price |
| compareAtPrice | number | Optional value anchoring |
| inventoryPolicy | string | Manual/automatic |
| isDefault | boolean | Default selected variant |
| badge | string | Best Value, Starter Pick |

## 8.3 Cart Item

| Field | Type | Description |
|---|---|---|
| productId | string | Product ID |
| variantId | string | Variant ID |
| quantity | number | Quantity |
| price | number | Price at add-to-cart time |
| preferences | object | BYO preferences if applicable |

## 8.4 Order

| Field | Type | Description |
|---|---|---|
| id | string | Order ID |
| customerId | string | Customer reference |
| items | array | Ordered items |
| orderNote | text | Customer notes |
| paymentStatus | enum | pending, paid, failed, refunded |
| fulfilmentStatus | enum | unfulfilled, packed, shipped, delivered, cancelled |
| subtotal | number | Product subtotal |
| shippingFee | number | Shipping fee |
| total | number | Final total |
| trackingNumber | string | Shipment tracking |
| createdAt | datetime | Order time |

## 8.5 Customer

| Field | Type | Description |
|---|---|---|
| id | string | Customer ID |
| name | string | Customer name |
| email | string | Email |
| phone | string | Phone |
| address | object | Shipping address |
| createdAt | datetime | Created timestamp |

---

## 9. Suggested Tech Stack

## 9.1 Simple and Fast MVP Stack

### Option A: Shopify
Best if the business wants speed and less engineering.

- Shopify theme customization
- Razorpay/Shopify payments if available
- Apps for reviews, WhatsApp, analytics
- Custom theme sections for mystery scoop variants

### Option B: Custom Next.js Store
Best if the user wants full control and developer portfolio value.

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API routes or Node.js/FastAPI
- Database: PostgreSQL / Supabase
- ORM: Prisma
- Auth: Clerk/Supabase Auth later
- Payments: Razorpay
- Storage: Cloudinary/S3
- Deployment: Vercel
- Email: Resend
- Analytics: GA4 + Meta Pixel

## 9.2 MVP Recommendation

Use Next.js + Tailwind + Supabase/PostgreSQL + Razorpay if the goal is a custom brand website and long-term control.

Use Shopify if launch speed is more important than custom engineering.

---

## 10. API Design

## 10.1 Public APIs

### Get Products

`GET /api/products`

Query params:

- category
- productType
- sort
- minPrice
- maxPrice

### Get Product by Slug

`GET /api/products/:slug`

Returns product, variants, images, and related products.

### Create Cart / Update Cart

`POST /api/cart`

Stores selected product, variant, quantity, and preferences.

### Create Checkout

`POST /api/checkout/create-payment`

Creates payment order with Razorpay.

### Verify Payment

`POST /api/checkout/verify-payment`

Verifies payment signature and creates paid order.

### Create Contact Request

`POST /api/contact`

Stores or emails contact query.

## 10.2 Admin APIs

### Admin Products

- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`

### Admin Orders

- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`
- `PATCH /api/admin/orders/:id/tracking`

### Admin Inventory

- `GET /api/admin/inventory`
- `PATCH /api/admin/inventory/:id`

---

## 11. Analytics Events

Track the following events:

| Event | Trigger |
|---|---|
| `view_home` | Home page loaded |
| `view_product` | Product page loaded |
| `select_variant` | Scoop size selected |
| `add_to_cart` | Product added to cart |
| `open_cart` | Cart opened |
| `add_order_note` | User adds note |
| `begin_checkout` | Checkout started |
| `payment_success` | Payment completed |
| `order_created` | Order created |

## 11.1 Important Funnels

1. Instagram visit → Product view → Add to cart → Checkout → Paid order
2. Home view → Mystery Scoop click → Variant select → Add to cart
3. Cart view → Checkout start → Payment success

---

## 12. Non-Functional Requirements

## 12.1 Performance

- Home page should load fast on mobile networks.
- Product images should be compressed.
- Use lazy loading below the fold.
- Use optimized image sizes.

## 12.2 Accessibility

- Minimum readable font size: 14px.
- Buttons should have clear labels.
- Colour contrast should be readable.
- Forms should have labels and error states.

## 12.3 Security

- Verify payments server-side.
- Do not trust frontend price.
- Sanitize user notes and contact messages.
- Protect admin routes.
- Store minimal customer data.

## 12.4 SEO

- Clean product URLs.
- Meta title and description for each page.
- Alt text for product images.
- Structured product data in future version.

---

## 13. MVP Development Phases

## Phase 1 — Foundation

- Set up project
- Add theme tokens
- Add layout
- Add header/footer
- Add homepage sections

## Phase 2 — Product System

- Product data model
- Product listing
- Product detail page
- Variant cards
- Add to cart

## Phase 3 — Cart and Checkout

- Cart page
- Order notes
- Razorpay integration
- Payment verification
- Order creation

## Phase 4 — Admin Basics

- Admin login
- View orders
- Update fulfilment status
- Add tracking
- Basic product/inventory management

## Phase 5 — Trust and Launch

- FAQ
- Policies
- Reviews
- SEO basics
- Analytics
- Meta Pixel
- Mobile QA

---

## 14. MVP Acceptance Checklist

- [ ] User can browse homepage.
- [ ] User can open Mystery Scoop product page.
- [ ] User can select Small/Medium/Large scoop.
- [ ] Price updates correctly.
- [ ] User can add product to cart.
- [ ] User can add order notes.
- [ ] User can complete prepaid checkout.
- [ ] Admin can see paid orders.
- [ ] Admin can see customer notes.
- [ ] Admin can update order status/tracking.
- [ ] Policies are visible.
- [ ] Website works smoothly on mobile.
- [ ] Product images are optimized.
- [ ] Analytics events are firing.

---

## 15. Future Enhancements

- Customer account
- Wishlist
- Loyalty points
- Referral codes
- Abandoned cart reminders
- WhatsApp notifications
- Automated packing suggestions
- Inventory auto-deduction for scoop items
- Customer review uploads
- UGC gallery
- Gift wrapping add-on
- Coupon engine
- Influencer affiliate codes

---

## 16. Final MVP Design Summary

The MVP should be simple, fast, cute, and conversion-focused. The main goal is not to build every ecommerce feature. The main goal is to make customers understand the mystery scoop concept, choose the right variant, add preferences, and complete prepaid checkout with trust.
