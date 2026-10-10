# Shopkart — Full-Stack (React + Django)

A real client/server rebuild of the earlier single-file demo: a Django REST
API backend with a SQLite database, and a React (Vite) frontend that talks
to it over HTTP. This is still a learning/demo project, not production
software — see "What's still missing for production" below.

## Architecture
```
React (Vite, :5173)  --fetch-->  Django REST Framework API (:8000)  -->  SQLite
  ProductGrid, Cart,                /api/products/
  Checkout components               /api/orders/
```
The Vite dev server proxies `/api/*` to Django (see `frontend/vite.config.js`),
so the frontend never needs to know the backend's hostname in development.

## Backend setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate        # creates db.sqlite3 and seeds 16 products
python manage.py createsuperuser  # optional, to view orders in /admin/
python manage.py runserver      # http://127.0.0.1:8000
```
Endpoints:
- `GET  /api/products/` — list products (`?category=Fashion`, `?search=shirt`)
- `GET  /api/products/<id>/` — one product
- `POST /api/orders/` — place an order (validates stock, computes total server-side)
- `GET  /api/orders/<order_id>/` — look up an order
- `/admin/` — Django admin to view/manage products and orders

## Frontend setup (React)
```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```
Run the backend first (or alongside) — the product grid fetches from it on load.

## What was verified vs. assumed
This code was written and reviewed by hand, following standard Django/DRF and
React/Vite conventions. The sandbox this was built in has no network access,
so `pip install` / `npm install` and an actual server boot could not be run
here to confirm it starts cleanly. Run the two setup steps above in your own
environment; if anything errors, the error message will point at the exact
line to fix (most likely culprits: Python/Node version mismatches, or a typo
I didn't catch).

## What's still missing for production
- No user accounts/login — anyone can place orders anonymously
- No real payment gateway (Razorpay, Stripe, etc.) — `placeOrder` just writes
  to the database
- `SECRET_KEY` is hardcoded and `DEBUG=True` — both must change before deploy
- No automated tests
- SQLite is fine for development; production would use Postgres
- No image uploads — products use emoji as placeholder art
- No order status updates / shipment tracking beyond the `status` field
