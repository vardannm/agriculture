# GreenField Agriculture Catalog (Next.js)

A Next.js website for agriculture items where users cannot buy online. They can only place orders by phone call or email.

## Features

- Public catalog page with agriculture item cards.
- **No checkout flow**. Every product has:
  - Call to order button
  - Email inquiry button
- Admin panel (`/admin`) to:
  - Add items
  - Edit item details
  - Remove items
  - Change price
  - Change photo URL
- Data stored in `data/items.json`.

## Run locally

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000` for catalog
- `http://localhost:3000/admin` for admin
