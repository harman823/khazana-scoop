from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from prisma import Prisma

db = Prisma()


async def connect_db() -> None:
    if not db.is_connected():
        await db.connect()


async def disconnect_db() -> None:
    if db.is_connected():
        await db.disconnect()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    await connect_db()
    try:
        yield
    finally:
        await disconnect_db()
