import json
import os
import secrets
from datetime import datetime
from uuid import uuid4

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from prisma.errors import RecordNotFoundError, UniqueViolationError

try:
    from backend.db import db, lifespan
except ModuleNotFoundError:
    from db import db, lifespan

load_dotenv()

app = FastAPI(title="KhazanaScoop MVP API", version="0.3.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "khazana-admin")
admin_tokens: set[str] = set()


class VariantOut(BaseModel):
    id: str
    name: str
    item_count: str
    price: int
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
    order_note: str = ""


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
    payment_status: str
    fulfilment_status: str
    subtotal: int
    shipping_fee: int
    total: int
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


def require_admin(authorization: str = Header(default="")) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or token not in admin_tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin login required")
    return token


def product_to_out(product) -> ProductOut:
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
        variants=[
            VariantOut(
                id=variant.id,
                name=variant.name,
                item_count=variant.itemCount,
                price=variant.price,
                badge=variant.badge,
                line=variant.line,
                is_default=variant.isDefault,
            )
            for variant in (product.variants or [])
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
        payment_status=order.paymentStatus,
        fulfilment_status=order.fulfilmentStatus,
        subtotal=order.subtotal,
        shipping_fee=order.shippingFee,
        total=order.total,
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


async def resolve_order_item(client, item: CartItemIn) -> dict:
    product = await client.product.find_unique(where={"id": item.product_id}, include={"variants": True})
    if product is None:
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


@app.get("/api/health")
async def health() -> dict[str, str | bool]:
    await db.product.count()
    return {
        "status": "ok",
        "database": "connected",
        "orm": "prisma",
        "connected": db.is_connected(),
    }


@app.get("/api/products", response_model=list[ProductOut])
async def get_products(product_type: str | None = None, category: str | None = None) -> list[ProductOut]:
    where = {}
    if product_type:
        where["productType"] = product_type
    if category:
        where["category"] = category
    products = await db.product.find_many(where=where, include={"variants": True}, order={"createdAt": "asc"})
    return [product_to_out(product) for product in products]


@app.get("/api/products/{slug}", response_model=ProductOut)
async def get_product(slug: str) -> ProductOut:
    product = await db.product.find_unique(where={"slug": slug}, include={"variants": True})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_to_out(product)


@app.post("/api/checkout", response_model=OrderOut, status_code=201)
async def create_checkout(payload: CheckoutIn) -> OrderOut:
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    async with db.tx() as transaction:
        resolved_items = [await resolve_order_item(transaction, item) for item in payload.items]
        subtotal = sum(item["price"] * item["quantity"] for item in resolved_items)
        shipping_fee = 0 if subtotal >= 499 else 49

        customer = await transaction.customer.upsert(
            where={"email": payload.customer.email},
            data={
                "create": {
                    "id": uuid4().hex,
                    "name": payload.customer.name,
                    "phone": payload.customer.phone,
                    "email": payload.customer.email,
                    "address": payload.customer.address,
                },
                "update": {
                    "name": payload.customer.name,
                    "phone": payload.customer.phone,
                    "address": payload.customer.address,
                },
            },
        )
        order = await transaction.order.create(
            data={
                "id": f"KS-{uuid4().hex[:8].upper()}",
                "customerId": customer.id,
                "orderNote": payload.order_note,
                "paymentStatus": "paid",
                "fulfilmentStatus": "unfulfilled",
                "subtotal": subtotal,
                "shippingFee": shipping_fee,
                "total": subtotal + shipping_fee,
                "items": {"create": resolved_items},
            },
            include={"customer": True, "items": True},
        )
    return order_to_out(order)


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
    except RecordNotFoundError:
        raise HTTPException(status_code=404, detail="Order not found")
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_to_out(order)


@app.get("/api/admin/inventory", response_model=list[InventoryItemOut])
async def get_inventory(_: str = Depends(require_admin)) -> list[InventoryItemOut]:
    inventory = await db.inventoryitem.find_many(order={"name": "asc"})
    return [inventory_to_out(item) for item in inventory]


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
    except RecordNotFoundError:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return inventory_to_out(item)


@app.get("/api/admin/products", response_model=list[ProductOut])
async def get_admin_products(_: str = Depends(require_admin)) -> list[ProductOut]:
    products = await db.product.find_many(include={"variants": True}, order={"createdAt": "asc"})
    return [product_to_out(product) for product in products]


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
    except UniqueViolationError:
        raise HTTPException(status_code=409, detail="A product with this slug already exists")
    return product_to_out(product)


@app.get("/api/admin/customers", response_model=list[CustomerOut])
async def get_customers(_: str = Depends(require_admin)) -> list[CustomerOut]:
    customers = await db.customer.find_many(order={"createdAt": "desc"})
    return [customer_to_out(customer) for customer in customers]
