import asyncio

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
            {"id": "small", "name": "Small Scoop", "itemCount": "7-8 products", "price": 549, "badge": "Starter Pick", "line": "Best for first orders"},
            {"id": "medium", "name": "Medium Scoop", "itemCount": "12-15 products", "price": 999, "badge": "Best Value", "line": "Most loved size", "isDefault": True},
            {"id": "large", "name": "Large Scoop", "itemCount": "20-22 products", "price": 1499, "badge": "Big Surprise", "line": "For gifting or hauls"},
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
            {"id": "byo-small", "name": "Small BYO", "itemCount": "8-9 items", "price": 699, "badge": "Simple", "line": "A few favorites"},
            {"id": "byo-medium", "name": "Medium BYO", "itemCount": "14-15 items", "price": 1199, "badge": "Balanced", "line": "More category mix", "isDefault": True},
            {"id": "byo-large", "name": "Large BYO", "itemCount": "22-25 items", "price": 1699, "badge": "Gift Box", "line": "Big custom bundle"},
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
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
