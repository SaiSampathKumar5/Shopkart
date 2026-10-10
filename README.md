# 🛒 Shopkart

A full-stack e-commerce web app inspired by Flipkart. Browse products, search and filter by category, manage a cart, and place orders that are saved in a real database.

**Live demo:** https://shopkart-three-rho.vercel.app
**API:** https://shopkart-hgc3.onrender.com/api/products/

## Features

- Product catalog with 16 seeded products across Electronics, Fashion, Home and Books
- Search by name and filter by category (handled by the API)
- Shopping cart with quantity controls, persisted in the browser
- Checkout with delivery details and an order confirmation ID
- Orders and order items stored in PostgreSQL
- Django admin panel to manage products, stock and orders

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript (ES6+), CSS3 |
| Backend | Python, Django 5, Django REST Framework |
| Database | PostgreSQL (Neon) in production, SQLite locally |
| Hosting | Vercel (frontend), Render (backend), Neon (database) |
| Other | django-cors-headers, WhiteNoise, Gunicorn, dj-database-url |

## Architecture

```
React (Vite)  ──fetch──▶  Django REST API  ──ORM──▶  PostgreSQL
  Vercel                     Render                    Neon
```

The frontend is a separate app that talks to the backend only through the REST API. Cart state lives in React and `localStorage`; products and orders live in the database.

## Design decisions

- **Server-side pricing:** the client sends only product IDs and quantities. The server looks up prices and computes the total, so totals can't be tampered with.
- **Atomic orders:** the order, its items and the stock decrement are created inside one database transaction, so they succeed or fail together.
- **Stock validation:** an order is rejected if any item is out of stock.
- **Decoupled API:** any other client (for example a mobile app) could reuse the same endpoints.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products/` | List products. Supports `?category=Fashion` and `?search=shirt` |
| GET | `/api/products/<id>/` | Get one product |
| POST | `/api/orders/` | Place an order |
| GET | `/api/orders/<order_id>/` | Look up an order |

Example order request:

```json
{
  "customer_name": "Asha Rao",
  "address": "12 MG Road",
  "city": "Hyderabad",
  "pincode": "500001",
  "items": [{ "product_id": 1, "quantity": 2 }]
}
```

## Project structure

```
shopkart/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── build.sh
│   ├── shopkart_backend/     # settings, urls, wsgi
│   └── store/                # models, serializers, views, migrations
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── api.js
        └── components/       # Header, ProductGrid, CartDrawer, CheckoutModal, ...
```

## Run it locally

You need Python 3.10+ and Node.js 18+.

### 1. Backend

```bash
cd shopkart/backend
python -m venv venv
# Windows: venv\Scripts\activate    Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate        # creates the database and seeds 16 products
python manage.py createsuperuser
python manage.py runserver      # http://127.0.0.1:8000
```

### 2. Frontend

In a second terminal:

```bash
cd shopkart/frontend
npm install
npm run dev                     # http://localhost:5173
```

In development, Vite proxies `/api` requests to Django, so no extra configuration is needed.

## Deployment

The app is deployed on free tiers:

- **Database:** Neon (PostgreSQL)
- **Backend:** Render web service
  - Root directory: `shopkart/backend`
  - Build command: `bash build.sh`
  - Start command: `gunicorn shopkart_backend.wsgi:application`
- **Frontend:** Vercel
  - Root directory: `shopkart/frontend`
  - Environment variable `VITE_API_BASE` set to the backend URL

Backend environment variables: `DATABASE_URL`, `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `FRONTEND_URL`, `CSRF_TRUSTED_ORIGINS`, and `DJANGO_SUPERUSER_USERNAME` / `DJANGO_SUPERUSER_EMAIL` / `DJANGO_SUPERUSER_PASSWORD`.

Pushing to the `main` branch redeploys both services automatically.

## Known limitations

- No user accounts or login; orders are anonymous
- No real payment gateway; placing an order only writes to the database
- No automated tests yet
- Products use emoji instead of real images
- Two simultaneous orders for the last item could both pass the stock check (needs row locking)
- The free backend sleeps after inactivity

## Roadmap

- [ ] User accounts with JWT authentication and order history
- [ ] Payment integration (Razorpay or Stripe)
- [ ] Product detail pages with images and reviews
- [ ] Automated tests (pytest and React Testing Library)
- [ ] Row-level locking (`select_for_update`) for stock updates
- [ ] Docker setup

## Author

Built by [SaiSampathKumar5](https://github.com/SaiSampathKumar5).
