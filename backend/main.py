import json
import os
import secrets
from datetime import datetime, timezone
from typing import Annotated, Any
from uuid import uuid4

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from jwt import PyJWKClient
from pydantic import BaseModel, EmailStr, Field
from prisma.errors import RecordNotFoundError, UniqueViolationError

try:
    from backend.db import db, lifespan
except ModuleNotFoundError:
    from db import db, lifespan

load_dotenv()

app = FastAPI(title="KhazanaScoop API", version="1.0.0", lifespan=lifespan)
allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "khazana-admin")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_JWT_AUDIENCE = os.getenv("SUPABASE_JWT_AUDIENCE", "authenticated")
admin_tokens: set[str] = set()
jwks_client = PyJWKClient(f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json", cache_keys=True) if SUPABASE_URL else None


class AuthUser(BaseModel):
    id: str
    email: EmailStr


class VariantOut(BaseModel):
    id: str
    name: str
    tier: str
    item_count: str
    min_items: int
    max_items: int
    surprise_gift_count: int = 0
    rules: list[str] = Field(default_factory=list)
    price: int
    compare_at_price: int | None = None
    badge: str | None = None
    line: str | None = None
    is_default: bool = False


class ProductOut(BaseModel):
    id: str
    name: str
    slug: str
    product_type: str
    category: str
    description: str
    price: int
    image: str | None = None
    badge: str | None = None
    icon: str | None = None
    color: str | None = None
    status: str = "active"
    average_rating: float = 0
    review_count: int = 0
    variants: list[VariantOut] = Field(default_factory=list)


class ProductUpsertIn(BaseModel):
    name: str
    slug: str
    product_type: str = "individual"
    category: str
    description: str
    price: int = Field(ge=0)
    image: str | None = None
    badge: str | None = None
    icon: str | None = None
    color: str | None = None
    status: str = "active"


class CartItemIn(BaseModel):
    product_id: str
    variant_id: str
    quantity: int = Field(ge=1)
    preferences: dict[str, str] = Field(default_factory=dict)


class CustomerIn(BaseModel):
    name: str = Field(min_length=2)
    phone: str = Field(min_length=6)
    email: EmailStr
    address: str = Field(min_length=8)


class CheckoutIn(BaseModel):
    customer: CustomerIn
    items: list[CartItemIn]
    order_note: str = Field(default="", max_length=2000)
    exclusions: str = Field(default="", max_length=1000)
    promotion_code: str | None = None


class LoginIn(BaseModel):
    password: str


class TokenOut(BaseModel):
    token: str


class OrderItemOut(BaseModel):
    product_id: str
    product_name: str
    variant_id: str
    variant_name: str
    item_count: str | None = None
    quantity: int
    price: int
    preferences: dict[str, str] = Field(default_factory=dict)


class CustomerOut(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    address: str
    created_at: datetime | None = None


class OrderOut(BaseModel):
    id: str
    customer: CustomerOut
    items: list[OrderItemOut]
    order_note: str
    exclusions: str
    payment_status: str
    fulfilment_status: str
    subtotal: int
    discount_total: int
    shipping_fee: int
    total: int
    promotion_code: str | None = None
    tracking_number: str
    created_at: datetime


class OrderPatch(BaseModel):
    fulfilment_status: str | None = None
    tracking_number: str | None = None


class InventoryItemOut(BaseModel):
    id: str
    name: str
    category: str
    cost_price: int
    sell_price: int
    stock: int
    low_stock_at: int
    status: str
    image: str | None = None


class InventoryPatch(BaseModel):
    stock: int | None = Field(default=None, ge=0)
    cost_price: int | None = Field(default=None, ge=0)
    sell_price: int | None = Field(default=None, ge=0)
    status: str | None = None


class AdminStatsOut(BaseModel):
    revenue: int
    paid_orders: int
    unfulfilled_orders: int
    products: int
    inventory_units: int
    low_stock_items: int


class PromotionOut(BaseModel):
    id: str
    name: str
    title: str
    message: str
    code: str | None = None
    promotion_type: str
    discount_type: str
    discount_value: int
    min_subtotal: int
    free_shipping: bool
    automatic: bool
    banner_placement: str
    starts_at: datetime
    ends_at: datetime | None = None
    product_ids: list[str] = Field(default_factory=list)


class PromotionIn(BaseModel):
    name: str
    title: str
    message: str
    code: str | None = None
    promotion_type: str
    discount_type: str = "none"
    discount_value: int = Field(default=0, ge=0)
    min_subtotal: int = Field(default=0, ge=0)
    free_shipping: bool = False
    automatic: bool = True
    banner_placement: str = "top"
    starts_at: datetime
    ends_at: datetime | None = None
    product_ids: list[str] = Field(default_factory=list)


class ReviewOut(BaseModel):
    id: str
    product_id: str
    customer_name: str
    rating: int
    title: str
    body: str
    verified: bool
    created_at: datetime


class ReviewIn(BaseModel):
    rating: int = Field(ge=1, le=5)
    title: str = Field(min_length=2, max_length=100)
    body: str = Field(min_length=5, max_length=1000)


def require_admin(authorization: str = Header(default="")) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or token not in admin_tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin login required")
    return token


def decode_supabase_token(token: str) -> AuthUser:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase authentication is not configured")
    try:
        if SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience=SUPABASE_JWT_AUDIENCE,
            )
        else:
            if jwks_client is None:
                raise HTTPException(status_code=503, detail="Supabase authentication is not configured")
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256", "ES256"],
                audience=SUPABASE_JWT_AUDIENCE,
            )
        return AuthUser(id=payload["sub"], email=payload["email"])
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired session") from exc


def optional_user(authorization: str = Header(default="")) -> AuthUser | None:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return decode_supabase_token(token)


def require_user(user: Annotated[AuthUser | None, Depends(optional_user)]) -> AuthUser:
    if user is None:
        raise HTTPException(status_code=401, detail="Sign in required")
    return user


def safe_json_list(value: str | None) -> list[str]:
    try:
        parsed = json.loads(value or "[]")
        return [str(item) for item in parsed] if isinstance(parsed, list) else []
    except json.JSONDecodeError:
        return []


def product_to_out(product, review_stats: tuple[float, int] = (0, 0)) -> ProductOut:
    average, count = review_stats
    return ProductOut(
        id=product.id,
        name=product.name,
        slug=product.slug,
        product_type=product.productType,
        category=product.category,
        description=product.description,
        price=product.price,
        image=product.image,
        badge=product.badge,
        icon=product.icon,
        color=product.color,
        status=product.status,
        average_rating=average,
        review_count=count,
        variants=[
            VariantOut(
                id=variant.id,
                name=variant.name,
                tier=variant.tier,
                item_count=variant.itemCount,
                min_items=variant.minItems,
                max_items=variant.maxItems,
                surprise_gift_count=variant.surpriseGiftCount,
                rules=safe_json_list(variant.rulesJson),
                price=variant.price,
                compare_at_price=variant.compareAtPrice,
                badge=variant.badge,
                line=variant.line,
                is_default=variant.isDefault,
            )
            for variant in sorted(product.variants or [], key=lambda item: item.sortOrder)
        ],
    )


def customer_to_out(customer) -> CustomerOut:
    return CustomerOut(
        id=customer.id,
        name=customer.name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address,
        created_at=customer.createdAt,
    )


def order_to_out(order) -> OrderOut:
    return OrderOut(
        id=order.id,
        customer=customer_to_out(order.customer),
        items=[
            OrderItemOut(
                product_id=item.productId,
                product_name=item.productName,
                variant_id=item.variantId,
                variant_name=item.variantName,
                item_count=item.itemCount,
                quantity=item.quantity,
                price=item.price,
                preferences=json.loads(item.preferencesJson or "{}"),
            )
            for item in (order.items or [])
        ],
        order_note=order.orderNote,
        exclusions=order.exclusions,
        payment_status=order.paymentStatus,
        fulfilment_status=order.fulfilmentStatus,
        subtotal=order.subtotal,
        discount_total=order.discountTotal,
        shipping_fee=order.shippingFee,
        total=order.total,
        promotion_code=order.promotionCode,
        tracking_number=order.trackingNumber,
        created_at=order.createdAt,
    )


def inventory_to_out(item) -> InventoryItemOut:
    return InventoryItemOut(
        id=item.id,
        name=item.name,
        category=item.category,
        cost_price=item.costPrice,
        sell_price=item.sellPrice,
        stock=item.stock,
        low_stock_at=item.lowStockAt,
        status=item.status,
        image=item.image,
    )


def promotion_to_out(promotion) -> PromotionOut:
    return PromotionOut(
        id=promotion.id,
        name=promotion.name,
        title=promotion.title,
        message=promotion.message,
        code=promotion.code,
        promotion_type=promotion.promotionType,
        discount_type=promotion.discountType,
        discount_value=promotion.discountValue,
        min_subtotal=promotion.minSubtotal,
        free_shipping=promotion.freeShipping,
        automatic=promotion.automatic,
        banner_placement=promotion.bannerPlacement,
        starts_at=promotion.startsAt,
        ends_at=promotion.endsAt,
        product_ids=[entry.productId for entry in (promotion.products or [])],
    )


async def review_stats_by_product(product_ids: list[str]) -> dict[str, tuple[float, int]]:
    if not product_ids:
        return {}
    reviews = await db.review.find_many(where={"productId": {"in": product_ids}, "status": "published"})
    grouped: dict[str, list[int]] = {}
    for review in reviews:
        grouped.setdefault(review.productId, []).append(review.rating)
    return {
        product_id: (round(sum(ratings) / len(ratings), 1), len(ratings))
        for product_id, ratings in grouped.items()
    }


async def resolve_order_item(client, item: CartItemIn) -> dict[str, Any]:
    product = await client.product.find_unique(where={"id": item.product_id}, include={"variants": True})
    if product is None or product.status != "active":
        raise HTTPException(status_code=404, detail="Product not found")
    variant_name = product.category
    item_count = None
    price = product.price
    if product.variants:
        variant = next((entry for entry in product.variants if entry.id == item.variant_id), None)
        if variant is None:
            raise HTTPException(status_code=400, detail=f"Invalid variant for {product.name}")
        variant_name = variant.name
        item_count = variant.itemCount
        price = variant.price
    elif item.variant_id != "standard":
        raise HTTPException(status_code=400, detail=f"Invalid variant for {product.name}")
    return {
        "id": uuid4().hex,
        "productId": product.id,
        "productName": product.name,
        "variantId": item.variant_id,
        "variantName": variant_name,
        "itemCount": item_count,
        "quantity": item.quantity,
        "price": price,
        "preferencesJson": json.dumps(item.preferences),
    }


async def active_promotions(client, code: str | None = None):
    now = datetime.now(timezone.utc)
    promotions = await client.promotion.find_many(
        where={"status": "active", "startsAt": {"lte": now}},
        include={"products": True},
        order={"startsAt": "desc"},
    )
    return [
        promotion
        for promotion in promotions
        if (promotion.endsAt is None or promotion.endsAt >= now)
        and (promotion.automatic or (code and promotion.code and promotion.code.lower() == code.lower()))
    ]


def calculate_promotions(promotions, items: list[dict[str, Any]], subtotal: int) -> tuple[int, bool, str | None]:
    quantities: dict[str, int] = {}
    for item in items:
        quantities[item["productId"]] = quantities.get(item["productId"], 0) + item["quantity"]
    best_discount = 0
    free_shipping = False
    applied_codes: list[str] = []
    for promotion in promotions:
        if subtotal < promotion.minSubtotal:
            continue
        if promotion.promotionType == "combo":
            required = {entry.productId: entry.quantity for entry in promotion.products or []}
            if not required or any(quantities.get(product_id, 0) < quantity for product_id, quantity in required.items()):
                continue
        discount = 0
        if promotion.discountType == "percentage":
            discount = subtotal * promotion.discountValue // 100
        elif promotion.discountType == "fixed":
            discount = promotion.discountValue
        best_discount = max(best_discount, min(discount, subtotal))
        free_shipping = free_shipping or promotion.freeShipping
        if promotion.code:
            applied_codes.append(promotion.code)
        elif promotion.automatic:
            applied_codes.append(promotion.name)
    return best_discount, free_shipping, ",".join(applied_codes) or None


@app.get("/api/health")
async def health() -> dict[str, str | bool]:
    await db.product.count()
    return {"status": "ok", "database": "connected", "orm": "prisma", "connected": db.is_connected()}


@app.get("/api/products", response_model=list[ProductOut])
async def get_products(
    q: str | None = None,
    product_type: str | None = None,
    categories: list[str] = Query(default=[]),
    colors: list[str] = Query(default=[]),
    min_price: int | None = Query(default=None, ge=0),
    max_price: int | None = Query(default=None, ge=0),
    sort: str = "featured",
) -> list[ProductOut]:
    where: dict[str, Any] = {"status": "active"}
    if product_type:
        where["productType"] = product_type
    if categories:
        where["category"] = {"in": categories}
    if colors:
        where["color"] = {"in": colors}
    if min_price is not None or max_price is not None:
        where["price"] = {}
        if min_price is not None:
            where["price"]["gte"] = min_price
        if max_price is not None:
            where["price"]["lte"] = max_price
    order = {"price": "asc"} if sort == "price-low" else {"price": "desc"} if sort == "price-high" else {"name": "asc"} if sort == "name" else {"createdAt": "asc"}
    products = await db.product.find_many(where=where, include={"variants": True}, order=order)
    if q:
        needle = q.casefold()
        products = [
            product for product in products
            if needle in f"{product.name} {product.category} {product.description}".casefold()
        ]
    stats = await review_stats_by_product([product.id for product in products])
    return [product_to_out(product, stats.get(product.id, (0, 0))) for product in products]


@app.get("/api/products/{slug}", response_model=ProductOut)
async def get_product(slug: str) -> ProductOut:
    product = await db.product.find_unique(where={"slug": slug}, include={"variants": True})
    if product is None or product.status != "active":
        raise HTTPException(status_code=404, detail="Product not found")
    stats = await review_stats_by_product([product.id])
    return product_to_out(product, stats.get(product.id, (0, 0)))


@app.get("/api/promotions", response_model=list[PromotionOut])
async def get_promotions() -> list[PromotionOut]:
    return [promotion_to_out(promotion) for promotion in await active_promotions(db)]


@app.get("/api/products/{product_id}/reviews", response_model=list[ReviewOut])
async def get_reviews(product_id: str) -> list[ReviewOut]:
    reviews = await db.review.find_many(
        where={"productId": product_id, "status": "published"},
        include={"customer": True},
        order={"createdAt": "desc"},
    )
    return [
        ReviewOut(
            id=review.id,
            product_id=review.productId,
            customer_name=review.customer.name,
            rating=review.rating,
            title=review.title,
            body=review.body,
            verified=review.verified,
            created_at=review.createdAt,
        )
        for review in reviews
    ]


@app.post("/api/products/{product_id}/reviews", response_model=ReviewOut, status_code=201)
async def create_review(product_id: str, payload: ReviewIn, user: Annotated[AuthUser, Depends(require_user)]) -> ReviewOut:
    customer = await db.customer.find_unique(where={"authUserId": user.id})
    if customer is None:
        raise HTTPException(status_code=400, detail="Complete a checkout before reviewing")
    product = await db.product.find_unique(where={"id": product_id})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    ordered = await db.orderitem.find_first(
        where={"productId": product_id, "order": {"customerId": customer.id, "paymentStatus": "paid"}}
    )
    try:
        review = await db.review.upsert(
            where={"productId_customerId": {"productId": product_id, "customerId": customer.id}},
            data={
                "create": {
                    "id": uuid4().hex,
                    "productId": product_id,
                    "customerId": customer.id,
                    "rating": payload.rating,
                    "title": payload.title,
                    "body": payload.body,
                    "verified": ordered is not None,
                },
                "update": {
                    "rating": payload.rating,
                    "title": payload.title,
                    "body": payload.body,
                    "verified": ordered is not None,
                    "status": "published",
                },
            },
            include={"customer": True},
        )
    except UniqueViolationError as exc:
        raise HTTPException(status_code=409, detail="Review already exists") from exc
    return ReviewOut(
        id=review.id,
        product_id=review.productId,
        customer_name=review.customer.name,
        rating=review.rating,
        title=review.title,
        body=review.body,
        verified=review.verified,
        created_at=review.createdAt,
    )


@app.post("/api/checkout", response_model=OrderOut, status_code=201)
async def create_checkout(
    payload: CheckoutIn,
    user: Annotated[AuthUser | None, Depends(optional_user)],
) -> OrderOut:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    if user and user.email.casefold() != str(payload.customer.email).casefold():
        raise HTTPException(status_code=400, detail="Checkout email must match the signed-in account")
    async with db.tx() as transaction:
        resolved_items = [await resolve_order_item(transaction, item) for item in payload.items]
        subtotal = sum(item["price"] * item["quantity"] for item in resolved_items)
        promotions = await active_promotions(transaction, payload.promotion_code)
        discount_total, free_shipping, promotion_code = calculate_promotions(promotions, resolved_items, subtotal)
        discounted_subtotal = max(0, subtotal - discount_total)
        shipping_fee = 0 if free_shipping or discounted_subtotal >= 499 else 49
        existing_customer = await transaction.customer.find_unique(where={"email": str(payload.customer.email)})
        if existing_customer and existing_customer.authUserId and user is None:
            raise HTTPException(status_code=401, detail="Sign in to checkout with this account email")
        customer_update = {
            "name": payload.customer.name,
            "phone": payload.customer.phone,
            "address": payload.customer.address,
        }
        if user:
            customer_update["authUserId"] = user.id
        customer = await transaction.customer.upsert(
            where={"email": str(payload.customer.email)},
            data={
                "create": {
                    "id": uuid4().hex,
                    "authUserId": user.id if user else None,
                    "name": payload.customer.name,
                    "phone": payload.customer.phone,
                    "email": str(payload.customer.email),
                    "address": payload.customer.address,
                },
                "update": customer_update,
            },
        )
        order = await transaction.order.create(
            data={
                "id": f"KS-{uuid4().hex[:8].upper()}",
                "customerId": customer.id,
                "orderNote": payload.order_note,
                "exclusions": payload.exclusions,
                "paymentStatus": "paid",
                "fulfilmentStatus": "unfulfilled",
                "subtotal": subtotal,
                "discountTotal": discount_total,
                "shippingFee": shipping_fee,
                "total": discounted_subtotal + shipping_fee,
                "promotionCode": promotion_code,
                "items": {"create": resolved_items},
            },
            include={"customer": True, "items": True},
        )
    return order_to_out(order)


@app.get("/api/my-orders", response_model=list[OrderOut])
async def get_my_orders(
    user: Annotated[AuthUser | None, Depends(optional_user)],
    email: EmailStr | None = Query(default=None),
) -> list[OrderOut]:
    if user:
        customer = await db.customer.find_unique(where={"authUserId": user.id})
    elif email and os.getenv("ALLOW_GUEST_ORDER_LOOKUP", "false").lower() == "true":
        customer = await db.customer.find_unique(where={"email": str(email)})
    else:
        raise HTTPException(status_code=401, detail="Sign in to view orders")
    if customer is None:
        return []
    orders = await db.order.find_many(
        where={"customerId": customer.id},
        include={"customer": True, "items": True},
        order={"createdAt": "desc"},
    )
    return [order_to_out(order) for order in orders]


@app.post("/api/admin/login", response_model=TokenOut)
async def admin_login(payload: LoginIn) -> TokenOut:
    if not secrets.compare_digest(payload.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Incorrect admin password")
    token = secrets.token_urlsafe(32)
    admin_tokens.add(token)
    return TokenOut(token=token)


@app.get("/api/admin/stats", response_model=AdminStatsOut)
async def get_admin_stats(_: str = Depends(require_admin)) -> AdminStatsOut:
    orders = await db.order.find_many()
    products = await db.product.find_many()
    inventory = await db.inventoryitem.find_many()
    paid = [order for order in orders if order.paymentStatus == "paid"]
    return AdminStatsOut(
        revenue=sum(order.total for order in paid),
        paid_orders=len(paid),
        unfulfilled_orders=len([order for order in orders if order.fulfilmentStatus == "unfulfilled"]),
        products=len(products),
        inventory_units=sum(item.stock for item in inventory),
        low_stock_items=len([item for item in inventory if item.stock <= item.lowStockAt]),
    )


@app.get("/api/admin/orders", response_model=list[OrderOut])
async def get_orders(_: str = Depends(require_admin)) -> list[OrderOut]:
    orders = await db.order.find_many(include={"customer": True, "items": True}, order={"createdAt": "desc"})
    return [order_to_out(order) for order in orders]


@app.patch("/api/admin/orders/{order_id}", response_model=OrderOut)
async def update_order(order_id: str, patch: OrderPatch, _: str = Depends(require_admin)) -> OrderOut:
    data = {}
    if patch.fulfilment_status is not None:
        data["fulfilmentStatus"] = patch.fulfilment_status
    if patch.tracking_number is not None:
        data["trackingNumber"] = patch.tracking_number
    if not data:
        raise HTTPException(status_code=400, detail="No order fields supplied")
    try:
        order = await db.order.update(where={"id": order_id}, data=data, include={"customer": True, "items": True})
    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Order not found") from exc
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_to_out(order)


@app.get("/api/admin/inventory", response_model=list[InventoryItemOut])
async def get_inventory(_: str = Depends(require_admin)) -> list[InventoryItemOut]:
    return [inventory_to_out(item) for item in await db.inventoryitem.find_many(order={"name": "asc"})]


@app.patch("/api/admin/inventory/{item_id}", response_model=InventoryItemOut)
async def update_inventory(item_id: str, patch: InventoryPatch, _: str = Depends(require_admin)) -> InventoryItemOut:
    data = {}
    if patch.stock is not None:
        data["stock"] = patch.stock
    if patch.cost_price is not None:
        data["costPrice"] = patch.cost_price
    if patch.sell_price is not None:
        data["sellPrice"] = patch.sell_price
    if patch.status is not None:
        data["status"] = patch.status
    if not data:
        raise HTTPException(status_code=400, detail="No inventory fields supplied")
    try:
        item = await db.inventoryitem.update(where={"id": item_id}, data=data)
    except RecordNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Inventory item not found") from exc
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return inventory_to_out(item)


@app.get("/api/admin/products", response_model=list[ProductOut])
async def get_admin_products(_: str = Depends(require_admin)) -> list[ProductOut]:
    products = await db.product.find_many(include={"variants": True}, order={"createdAt": "asc"})
    stats = await review_stats_by_product([product.id for product in products])
    return [product_to_out(product, stats.get(product.id, (0, 0))) for product in products]


@app.post("/api/admin/products", response_model=ProductOut, status_code=201)
async def create_product(payload: ProductUpsertIn, _: str = Depends(require_admin)) -> ProductOut:
    try:
        product = await db.product.create(
            data={
                "id": uuid4().hex,
                "name": payload.name,
                "slug": payload.slug,
                "productType": payload.product_type,
                "category": payload.category,
                "description": payload.description,
                "price": payload.price,
                "image": payload.image,
                "badge": payload.badge,
                "icon": payload.icon,
                "color": payload.color,
                "status": payload.status,
            },
            include={"variants": True},
        )
    except UniqueViolationError as exc:
        raise HTTPException(status_code=409, detail="A product with this slug already exists") from exc
    return product_to_out(product)


@app.get("/api/admin/customers", response_model=list[CustomerOut])
async def get_customers(_: str = Depends(require_admin)) -> list[CustomerOut]:
    return [customer_to_out(customer) for customer in await db.customer.find_many(order={"createdAt": "desc"})]


@app.get("/api/admin/promotions", response_model=list[PromotionOut])
async def get_admin_promotions(_: str = Depends(require_admin)) -> list[PromotionOut]:
    promotions = await db.promotion.find_many(include={"products": True}, order={"startsAt": "desc"})
    return [promotion_to_out(promotion) for promotion in promotions]


@app.post("/api/admin/promotions", response_model=PromotionOut, status_code=201)
async def create_promotion(payload: PromotionIn, _: str = Depends(require_admin)) -> PromotionOut:
    promotion = await db.promotion.create(
        data={
            "id": uuid4().hex,
            "name": payload.name,
            "title": payload.title,
            "message": payload.message,
            "code": payload.code,
            "promotionType": payload.promotion_type,
            "discountType": payload.discount_type,
            "discountValue": payload.discount_value,
            "minSubtotal": payload.min_subtotal,
            "freeShipping": payload.free_shipping,
            "automatic": payload.automatic,
            "bannerPlacement": payload.banner_placement,
            "startsAt": payload.starts_at,
            "endsAt": payload.ends_at,
            "products": {
                "create": [{"productId": product_id} for product_id in payload.product_ids]
            },
        },
        include={"products": True},
    )
    return promotion_to_out(promotion)
