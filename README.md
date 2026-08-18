# MONVÉR

Premium leather-goods e-commerce — **Rails backend** + **React (Vite) frontend** + **Go real-time service**.

MONVÉR is a unisex leather-goods brand (wallets, card holders, belts, bags, wash bags, travel & accessories). Storefront is in French, priced in TND, with delivery across Tunisia and cash on delivery.

📖 **Full architecture guide:** [docs/HOW_IT_WORKS.md](docs/HOW_IT_WORKS.md)

## Run

```powershell
cd "c:\Users\Ala Ghabi\kids-shop"
npm run setup
npm run dev
```

| What | URL |
|------|-----|
| **React UI** (shop + admin) | http://localhost:3000 |
| **Rails JSON API** | http://localhost:3001 |
| Admin login | http://localhost:3000/connexion |

**Staff:** `admin@monver.com` / `password123`

## Split of work

| Layer | Folder | Does |
|-------|--------|------|
| **Frontend** | `frontend/` | React (CRA) — pages, routing, display only |
| **Backend** | `api/` | Models, cart, orders, auth, admin API, jobs, security |

React talks to Rails via **JSON REST** + **session cookies** (proxied in dev).

Cart lives on the **server** (`CartManager` + `/api/v1/cart`), not in `localStorage`.

**Favorites** are stored in a **browser cookie** (`kidelio_favs`) — no login required. Page: `/favoris`.

## Production

```powershell
npm run build
cd api
bundle exec rails server -p 3000
```

Build copies React into `api/public/` — one server serves UI + `/api`.

## Legacy folders

- `web/`, `admin/` — old split React apps, ignore
- `api/app/views/store`, `api/app/controllers/store` — unused HTML; API + React is the path
