# workflow.md — Ecommerce Workflow for Khazana Scoop

## 1. Product Vision

Build a playful, minimal ecommerce website for a mystery scoop / cute essentials brand where customers can either:

1. Buy a ready-made Mystery Scoop.
2. Build their own scoop with preferences.
3. Browse individual cute products such as stationery, scrunchies, hair clips, pocket mirrors, keychains, beauty minis, and small gifting items.

The website should feel soft, cute, trustworthy, and easy to purchase from mobile.

---

## 2. Main Website Workflows

## 2.1 First-Time Visitor Workflow

### Goal
Help a new Instagram visitor understand the concept quickly and move them toward a scoop purchase.

### Flow

1. User lands on Home Page from Instagram bio/ad/story.
2. Announcement bar shows a simple benefit:
   - Free shipping on prepaid orders
   - New scoops available
   - Special notes accepted
3. Hero explains the brand in one line:
   - “Cute surprises, packed just for you.”
4. User sees two primary paths:
   - Shop Mystery Scoops
   - Build My Scoop
5. User scrolls and sees:
   - How it works
   - Scoop size comparison
   - What can come inside
   - Customer reviews
   - FAQ preview
6. User clicks a Mystery Scoop or Build Your Own Scoop.
7. User reaches product page.
8. User selects size/variant.
9. User adds order preference note.
10. User adds to cart.
11. User checks cart.
12. User completes prepaid checkout.
13. User receives order confirmation.

### Success Criteria

- User understands what a mystery scoop is within 5 seconds.
- User understands item count and price before adding to cart.
- User knows that exact items are surprise-based.
- User knows they can mention avoid preferences in notes.

---

## 2.2 Mystery Scoop Purchase Workflow

### Goal
Allow users to choose the right scoop size and buy without confusion.

### Flow

1. User opens Mystery Scoop product page.
2. Product page shows:
   - Product gallery
   - Product title
   - Short explanation
   - Variant cards
   - Price
   - Add to cart button
   - Important notes
3. User selects one variant:
   - Small Scoop: 7–8 products
   - Medium Scoop: 12–15 products
   - Large Scoop: 20–22 products
4. Price updates dynamically.
5. User reads quick trust notes:
   - Packed with care
   - Special notes accepted
   - Prepaid orders only
   - Ships in 2–5 working days
6. User adds product to cart.
7. Cart displays selected scoop and price.
8. User adds optional note:
   - Example: “No earrings, no keychains, prefer pink items.”
9. User proceeds to checkout.
10. User pays online.
11. System creates order.
12. Admin receives order with variant and notes.
13. Admin packs order according to available inventory and customer note.
14. Admin updates shipping/tracking details.
15. Customer receives order.

### Important UX Rule
The variant selector should use visual cards, not only a dropdown, because the customer must compare item count, price, and best-use case.

---

## 2.3 Build Your Own Scoop Workflow

### Goal
Give semi-customized buying experience for users who want control but still want a cute packed box.

### Flow

1. User opens Build Your Own Scoop page.
2. User selects size:
   - Small BYO: 8–9 items
   - Medium BYO: 14–15 items
   - Large BYO: 22–25 items
3. User fills preference fields:
   - Favourite colours
   - Loved categories
   - Categories to avoid
   - Occasion
   - Extra note
4. User adds to cart.
5. Cart shows selected BYO size and captured preferences.
6. User checks out prepaid.
7. Admin receives order with structured preferences.
8. Admin picks products based on stock and preferences.
9. Admin marks order as packed.
10. Admin ships order and updates tracking.

### Preference Form Fields

| Field | Type | Required | Example |
|---|---|---:|---|
| Favourite colours | Text / multi-select | No | Pink, blue, lavender |
| Loved categories | Multi-select | No | Stationery, hair accessories |
| Avoid categories | Multi-select | No | Earrings, keychains |
| Occasion | Select | No | Birthday, self-care, gifting |
| Extra note | Textarea | No | “Please make it cute and pastel.” |

### Important Expectation Copy
“We will try to follow your preferences as closely as possible based on available stock.”

---

## 2.4 Individual Product Shopping Workflow

### Goal
Allow users to browse and add cute products separately, similar to a clean collection page.

### Flow

1. User opens Cute Essentials collection.
2. User sees collection title and category chips.
3. User filters by:
   - Price
   - Product type
   - Availability
   - New in
4. User opens product or uses quick add.
5. User adds product to cart.
6. User may also see “Complete your box” recommendations.
7. User checks out.

### Use Case
This works well for customers who do not want surprise products and want fixed products.

---

## 2.5 Cart Workflow

### Goal
Reduce checkout confusion and capture order notes clearly.

### Flow

1. User opens cart.
2. Cart shows:
   - Product image
   - Product name
   - Variant selected
   - Quantity
   - Price
   - Remove option
3. If product is Mystery Scoop or BYO Scoop, show note section prominently:
   - “Mention what you want us to avoid.”
4. User enters note.
5. Cart shows policy reminders:
   - Prepaid orders only
   - Product combinations may vary
   - Mystery scoops are non-returnable unless damaged/wrong
6. User proceeds to checkout.

### Cart Note Placeholder
“Example: no earrings, no keychains, no hair clips, prefer stationery or pink items.”

---

## 2.6 Checkout Workflow

### Goal
Complete prepaid order with all required customer details.

### Flow

1. User enters contact information.
2. User enters shipping address.
3. User reviews order.
4. User confirms order note.
5. User selects prepaid payment method.
6. User completes payment.
7. System creates order.
8. Customer receives confirmation.
9. Admin receives order.

### Payment Rule
For MVP, keep prepaid-only checkout to reduce fake orders, returns, and cash-flow issues.

---

## 2.7 Admin Order Fulfilment Workflow

### Goal
Give the business owner a clear process from order received to shipment.

### Flow

1. Admin receives new order notification.
2. Admin checks:
   - Customer name
   - Product type
   - Scoop size
   - Quantity
   - Customer notes
   - Payment status
3. Admin validates stock availability.
4. Admin creates packing plan:
   - For mystery scoop: choose items based on size and variety.
   - For BYO scoop: choose items based on preferences.
   - For individual products: pick exact SKU.
5. Admin checks item count.
6. Admin avoids customer’s excluded categories wherever possible.
7. Admin packs order.
8. Admin marks internal packing status as packed.
9. Admin books shipment.
10. Admin adds tracking number.
11. Customer receives shipment update.
12. Order marked fulfilled.

### Internal Packing Checklist

- [ ] Correct scoop variant selected
- [ ] Correct item count packed
- [ ] Customer avoid note checked
- [ ] Fragile products protected
- [ ] Freebie added if applicable
- [ ] Invoice/order slip included if needed
- [ ] Shipping label attached
- [ ] Tracking updated

---

## 2.8 Inventory Workflow

### Goal
Avoid overselling and understand what products are available for packing.

### MVP Flow

1. Admin adds products/SKUs in inventory.
2. Each product has:
   - Name
   - Category
   - Cost price
   - Selling price
   - Available quantity
   - Image
   - Status
3. When individual product order is placed, stock decreases automatically.
4. For mystery scoops, stock can be reduced manually after packing.
5. Admin updates inventory after every packing batch.

### Future Flow
For later versions, introduce automatic mystery-scoop packing suggestions based on item count, category mix, customer preferences, and remaining stock.

---

## 2.9 Return / Damage Workflow

### Goal
Handle customer issues without creating confusion.

### Flow

1. Customer contacts brand via WhatsApp/email/website form.
2. Customer shares:
   - Order ID
   - Issue type
   - Photos/video
3. Admin checks issue:
   - Damaged item
   - Wrong item
   - Missing item
   - Preference mismatch
4. Admin decides resolution:
   - Replacement
   - Partial refund/store credit
   - Re-shipment of missing item
   - No return if it is normal mystery variation
5. Admin updates customer.

### Policy Rule
Mystery scoops are not returnable or exchangeable for dislike of surprise items. Only damaged/wrong/missing items should be eligible for support.

---

## 2.10 Marketing Workflow

### Goal
Convert Instagram traffic into website orders.

### Flow

1. Instagram Reel/Post drives traffic to website.
2. Bio link opens Home Page or Mystery Scoop page.
3. Website clearly explains:
   - Price
   - Item count
   - Examples of products
   - Special notes
   - Trust details
4. User adds to cart.
5. If user does not buy:
   - Retarget through Instagram ads later
   - Use abandoned cart email/WhatsApp in future version
6. Customer receives order.
7. Brand asks for review/UGC.
8. UGC added to website/social proof.

### Recommended Landing Pages

| Campaign Type | Landing Page |
|---|---|
| Mystery scoop reel | Mystery Scoop product page |
| New collection post | Cute Essentials collection |
| Build-your-own post | Build Your Own Scoop page |
| Offer post | Offer landing page |

---

## 3. MVP User Journey Map

## Journey A: Fast Buyer

1. Instagram ad/reel
2. Mystery Scoop page
3. Select Medium Scoop
4. Add note
5. Checkout
6. Payment
7. Confirmation

## Journey B: Careful Buyer

1. Home page
2. How it works
3. What can come inside
4. FAQ
5. Mystery Scoop page
6. Select variant
7. Cart
8. Checkout

## Journey C: Custom Buyer

1. Home page
2. Build Your Own Scoop
3. Select size
4. Fill preferences
5. Add to cart
6. Checkout

## Journey D: Product Browser

1. Cute Essentials collection
2. Filter products
3. Add individual items
4. Cart
5. Checkout

---

## 4. Technical Workflow

## 4.1 Frontend Flow

1. User opens website.
2. Frontend loads homepage/collection/product page.
3. Product data is fetched from backend/CMS/store API.
4. User selects variant.
5. Variant price and item count update on UI.
6. User adds item to cart.
7. Cart state updates locally and on server if logged in.
8. User proceeds to checkout.
9. Checkout creates payment order.
10. Payment success creates ecommerce order.

## 4.2 Backend Flow

1. Backend manages products, variants, inventory, orders, customers, and payments.
2. Product page requests product and variant data.
3. Cart API validates selected variant and price.
4. Checkout API creates payment session/order.
5. Payment gateway sends webhook after success/failure.
6. Backend marks order paid after verified payment.
7. Admin dashboard shows paid order.
8. Fulfilment status is updated by admin.

## 4.3 Payment Flow

1. User clicks Pay Now.
2. Backend creates payment order with gateway.
3. Frontend opens payment UI.
4. User pays.
5. Payment gateway returns success/failure.
6. Backend verifies payment signature/webhook.
7. Order is created only after successful verification.

## 4.4 Notification Flow

### MVP

- Order confirmation email.
- Admin email/WhatsApp/manual notification.

### Future

- WhatsApp order confirmation.
- Tracking update notification.
- Review request notification.
- Abandoned cart reminder.

---

## 5. MVP Scope Summary

### Must Have

- Home page
- Mystery Scoop product page
- Build Your Own Scoop page
- Collection page
- Product details page
- Cart
- Checkout
- Payment integration
- Order notes
- Admin order view
- Basic inventory management
- Policy pages
- FAQ
- Mobile-first design

### Should Have

- Reviews
- Recently viewed
- Product recommendations
- Category chips
- Product badges
- Newsletter capture
- Instagram/social proof section

### Later

- Customer account
- Wishlist
- Loyalty points
- Referral system
- Automated inventory deduction for mystery scoops
- Packing recommendation engine
- Abandoned cart WhatsApp/email
- Advanced analytics dashboard

---

## 6. Workflow Risks and Fixes

| Risk | Impact | Fix |
|---|---|---|
| Customer expects exact items | Complaints | Clear mystery notes and examples |
| Customer forgets preference note | Dissatisfaction | Show notes on product and cart page |
| Inventory not updated | Overselling | Admin inventory checklist |
| Too many checkout steps | Drop-off | Keep checkout simple and prepaid-only |
| Website looks childish | Low trust | Use minimal layout, soft colours, clean fonts |
| Fake urgency | Low trust | Avoid fake timers and fake stock counters |

---

## 7. Final Workflow Principle

The website should not just sell products. It should explain the mystery scoop concept clearly enough that the customer feels excited, not confused.

The best flow is:

**Instagram curiosity → website clarity → variant confidence → note capture → prepaid checkout → careful packing → review/social proof.**
