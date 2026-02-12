import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { readItems, writeItems } from '@/lib/items-store';
import { Item } from '@/lib/types';

export async function GET() {
  const items = await readItems();
  return NextResponse.json(items);
}

function normalizePayload(payload: Partial<Item>) {
  return {
    name: payload.name?.trim() ?? '',
    category: payload.category?.trim() ?? '',
    description: payload.description?.trim() ?? '',
    price: Number(payload.price ?? 0),
    imageUrl: payload.imageUrl?.trim() ?? '',
    phone: payload.phone?.trim() ?? '',
    email: payload.email?.trim() ?? ''
  };
}

function isValid(payload: ReturnType<typeof normalizePayload>) {
  return (
    payload.name.length > 0 &&
    payload.category.length > 0 &&
    payload.description.length > 0 &&
    payload.price >= 0 &&
    payload.imageUrl.length > 0 &&
    payload.phone.length > 0 &&
    payload.email.length > 0
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Item>;
  const payload = normalizePayload(body);

  if (!isValid(payload)) {
    return NextResponse.json({ message: 'Invalid item payload.' }, { status: 400 });
  }

  const items = await readItems();
  const newItem: Item = {
    id: randomUUID(),
    ...payload
  };

  items.unshift(newItem);
  await writeItems(items);

  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as Partial<Item> & { id?: string };

  if (!body.id) {
    return NextResponse.json({ message: 'Item ID is required.' }, { status: 400 });
  }

  const payload = normalizePayload(body);

  if (!isValid(payload)) {
    return NextResponse.json({ message: 'Invalid item payload.' }, { status: 400 });
  }

  const items = await readItems();
  const index = items.findIndex((item) => item.id === body.id);

  if (index === -1) {
    return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  }

  const updatedItem: Item = {
    id: body.id,
    ...payload
  };

  items[index] = updatedItem;
  await writeItems(items);

  return NextResponse.json(updatedItem);
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as { id?: string };

  if (!body.id) {
    return NextResponse.json({ message: 'Item ID is required.' }, { status: 400 });
  }

  const items = await readItems();
  const nextItems = items.filter((item) => item.id !== body.id);

  if (nextItems.length === items.length) {
    return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  }

  await writeItems(nextItems);
  return NextResponse.json({ success: true });
}
