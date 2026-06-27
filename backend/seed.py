import asyncio
import json
from datetime import datetime, timedelta, timezone

from backend.db import db


PRODUCTS = [
    {
        "id": "mystery-scoop",
        "name": "Mystery Scoop",
        "slug": "mystery-scoop",
        "productType": "mystery_scoop",
        "category": "Mystery Scoops",
        "description": "A cute surprise box filled with handpicked products from our collection.",
        "price": 999,
        "image": "/assets/khazana-product-hero.png",
        "variants": [
            {"id": "small", "name": "Budget Scoop", "tier": "budget", "itemCount": "7 products + 1 surprise gift", "minItems": 7, "maxItems": 7, "surpriseGiftCount": 1, "rulesJson": json.dumps(["At least 3 categories", "One stationery item guaranteed", "Exclusions accepted"]), "price": 549, "compareAtPrice": 649, "badge": "Budget", "line": "A cheerful first scoop", "sortOrder": 1},
            {"id": "medium", "name": "Standard Scoop", "tier": "standard", "itemCount": "12 products + 2 surprise gifts", "minItems": 12, "maxItems": 12, "surpriseGiftCount": 2, "rulesJson": json.dumps(["At least 4 categories", "Two stationery or accessory picks", "Exclusions accepted"]), "price": 999, "compareAtPrice": 1199, "badge": "Best Value", "line": "Our most balanced mix", "isDefault": True, "sortOrder": 2},
            {"id": "large", "name": "Premium Scoop", "tier": "premium", "itemCount": "20 products + 3 surprise gifts", "minItems": 20, "maxItems": 20, "surpriseGiftCount": 3, "rulesJson": json.dumps(["At least 5 categories", "Premium gift-ready packing", "Priority preference matching"]), "price": 1499, "compareAtPrice": 1799, "badge": "Premium", "line": "For gifting or a big haul", "sortOrder": 3},
        ],
    },
    {
        "id": "build-your-own",
        "name": "Build Your Own Scoop",
        "slug": "build-your-own-scoop",
        "productType": "build_your_own",
        "category": "Build Your Scoop",
        "description": "A semi-customized scoop packed around your colours, categories, and occasion notes.",
        "price": 1199,
        "image": "/assets/khazana-product-hero.png",
        "variants": [
            {"id": "byo-small", "name": "Budget BYO", "tier": "budget", "itemCount": "8 items + 1 surprise gift", "minItems": 8, "maxItems": 8, "surpriseGiftCount": 1, "rulesJson": json.dumps(["Choose up to 2 preferred categories", "Exclude up to 2 categories"]), "price": 699, "badge": "Simple", "line": "A few favourites", "sortOrder": 1},
            {"id": "byo-medium", "name": "Standard BYO", "tier": "standard", "itemCount": "14 items + 2 surprise gifts", "minItems": 14, "maxItems": 14, "surpriseGiftCount": 2, "rulesJson": json.dumps(["Choose up to 4 preferred categories", "Colour and occasion matching"]), "price": 1199, "badge": "Balanced", "line": "More category variety", "isDefault": True, "sortOrder": 2},
            {"id": "byo-large", "name": "Premium BYO", "tier": "premium", "itemCount": "22 items + 3 surprise gifts", "minItems": 22, "maxItems": 22, "surpriseGiftCount": 3, "rulesJson": json.dumps(["Choose up to 6 preferred categories", "Priority preference matching", "Gift-ready premium packing"]), "price": 1699, "badge": "Gift Box", "line": "A generous custom bundle", "sortOrder": 3},
        ],
    },
]

INDIVIDUALS = [
    {"id": "scrunchie", "name": "Cloud Soft Scrunchie", "slug": "cloud-soft-scrunchie", "category": "Hair Accessories", "description": "Soft pastel scrunchie for everyday styling.", "price": 89, "badge": "New", "icon": "✿", "color": "#FFD1DC"},
    {"id": "pen", "name": "Pastel Gel Pen Set", "slug": "pastel-gel-pen-set", "category": "Cute Pens", "description": "Smooth gel pens in happy pastel colours.", "price": 149, "badge": "Best", "icon": "✎", "color": "#E6E6FA"},
    {"id": "mirror", "name": "Pocket Mirror", "slug": "pocket-mirror", "category": "Pocket Mirrors", "description": "Tiny mirror for bags, desks, and gifting.", "price": 129, "badge": "Gift", "icon": "◐", "color": "#CDF6F0"},
    {"id": "stickers", "name": "Sticker & Note Pack", "slug": "sticker-note-pack", "category": "Stickers & Notes", "description": "A cute stationery pack for journaling.", "price": 99, "badge": "Under ₹99", "icon": "✦", "color": "#FFE8A3"},
    {"id": "clip", "name": "Mini Hair Clip Pair", "slug": "mini-hair-clip-pair", "category": "Hair Accessories", "description": "Pair of mini clips for soft daily looks.", "price": 79, "badge": "Cute", "icon": "♡", "color": "#F0FFF0"},
    {"id": "charm", "name": "Keychain Charm", "slug": "keychain-charm", "category": "Keychains & Charms", "description": "Small charm for bags, keys, and pouches.", "price": 119, "badge": "New", "icon": "♢", "color": "#D8F5E6"},
    {"id": "mini", "name": "Beauty Mini", "slug": "beauty-mini", "category": "Beauty Minis", "description": "A tiny self-care add-on for your box.", "price": 169, "badge": "Pocket", "icon": "◌", "color": "#FFD6E8"},
    {"id": "gift", "name": "Surprise Gift Add-on", "slug": "surprise-gift-add-on", "category": "Surprise Gifts", "description": "A small extra surprise packed with care.", "price": 199, "badge": "Add-on", "icon": "✧", "color": "#E4FFFA"},
]

INVENTORY = [
    {"id": "stationery", "name": "Stationery minis", "category": "Stationery", "stock": 82, "costPrice": 28, "sellPrice": 99},
    {"id": "hair", "name": "Hair accessories", "category": "Hair Accessories", "stock": 54, "costPrice": 22, "sellPrice": 89},
    {"id": "charms", "name": "Keychains & charms", "category": "Keychains & Charms", "stock": 37, "costPrice": 35, "sellPrice": 119},
    {"id": "beauty", "name": "Beauty minis", "category": "Beauty Minis", "stock": 29, "costPrice": 55, "sellPrice": 169},
    {"id": "mirrors", "name": "Pocket mirrors", "category": "Pocket Mirrors", "stock": 21, "costPrice": 42, "sellPrice": 129},
]

PROMOTIONS = [
    {
        "id": "free-shipping-499",
        "name": "Free shipping over 499",
        "title": "Free shipping above ₹499",
        "message": "Your prepaid order ships free when the cart reaches ₹499.",
        "promotionType": "free_shipping",
        "freeShipping": True,
        "minSubtotal": 499,
        "automatic": True,
        "bannerPlacement": "top",
    },
    {
        "id": "desk-duo",
        "name": "Desk Duo",
        "title": "Desk Duo: save ₹49",
        "message": "Pair the Pastel Gel Pen Set with the Sticker & Note Pack and save ₹49 automatically.",
        "promotionType": "combo",
        "discountType": "fixed",
        "discountValue": 49,
        "automatic": True,
        "bannerPlacement": "catalog",
        "productIds": ["pen", "stickers"],
    },
]


async def main() -> None:
    await db.connect()
    try:
        async with db.tx() as transaction:
            for source_product in PRODUCTS:
                product = {**source_product}
                variants = product.pop("variants")
                await transaction.product.upsert(
                    where={"id": product["id"]},
                    data={
                        "create": {**product, "variants": {"create": variants}},
                        "update": product,
                    },
                )
                for variant in variants:
                    await transaction.variant.upsert(
                        where={"id": variant["id"]},
                        data={
                            "create": {**variant, "productId": product["id"]},
                            "update": variant,
                        },
                    )

            for item in INDIVIDUALS:
                await transaction.product.upsert(
                    where={"id": item["id"]},
                    data={
                        "create": {**item, "productType": "individual"},
                        "update": item,
                    },
                )

            for item in INVENTORY:
                await transaction.inventoryitem.upsert(
                    where={"id": item["id"]},
                    data={"create": item, "update": item},
                )

            now = datetime.now(timezone.utc)
            for source_promotion in PROMOTIONS:
                promotion = {**source_promotion}
                product_ids = promotion.pop("productIds", [])
                promotion["startsAt"] = now - timedelta(days=1)
                promotion["endsAt"] = now + timedelta(days=365)
                await transaction.promotion.upsert(
                    where={"id": promotion["id"]},
                    data={
                        "create": {
                            **promotion,
                            "products": {"create": [{"productId": product_id} for product_id in product_ids]},
                        },
                        "update": promotion,
                    },
                )

            customer = await transaction.customer.upsert(
                where={"email": "demo@example.com"},
                data={
                    "create": {
                        "id": "demo-customer",
                        "name": "Demo Customer",
                        "phone": "+91 90000 00000",
                        "email": "demo@example.com",
                        "address": "Demo address, Jaipur 302001",
                    },
                    "update": {},
                },
            )

            await transaction.order.upsert(
                where={"id": "KS-DEMO-1024"},
                data={
                    "create": {
                        "id": "KS-DEMO-1024",
                        "customerId": customer.id,
                        "orderNote": "No earrings, prefer pink stationery.",
                        "exclusions": "Earrings",
                        "paymentStatus": "paid",
                        "fulfilmentStatus": "packed",
                        "subtotal": 999,
                        "shippingFee": 0,
                        "total": 999,
                        "trackingNumber": "SHIP123456",
                        "items": {
                            "create": [
                                {
                                    "id": "KS-DEMO-1024-1",
                                    "productId": "mystery-scoop",
                                    "productName": "Mystery Scoop",
                                    "variantId": "medium",
                                    "variantName": "Medium Scoop",
                                    "itemCount": "12-15 products",
                                    "quantity": 1,
                                    "price": 999,
                                    "preferencesJson": "{}",
                                }
                            ]
                        },
                    },
                    "update": {},
                },
            )

            await transaction.review.upsert(
                where={"productId_customerId": {"productId": "mystery-scoop", "customerId": customer.id}},
                data={
                    "create": {
                        "id": "demo-review-mystery",
                        "productId": "mystery-scoop",
                        "customerId": customer.id,
                        "rating": 5,
                        "title": "Thoughtful and genuinely fun",
                        "body": "The exclusions were followed and the item count matched the selected tier.",
                        "verified": True,
                    },
                    "update": {},
                },
            )
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
