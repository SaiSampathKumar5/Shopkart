# Free deployment: Render (API) + Neon (Postgres) + Vercel (React)

Free-tier limits change often; confirm current limits on each site before relying on them.

## 1. Push to GitHub
Put the `shopkart` folder in a GitHub repo (backend/ and frontend/ at the root of the repo).

## 2. Database: Neon (free Postgres)
Create a project at neon.tech and copy the connection string (postgresql://...). Use this instead of
Render's own free Postgres, which has an expiry.

## 3. Backend: Render web service
New > Web Service > connect repo.
- Root Directory: backend
- Runtime: Python 3 (set env PYTHON_VERSION = 3.11.9)
- Build Command: ./build.sh
- Start Command: gunicorn shopkart_backend.wsgi:application
- Instance type: Free

Environment variables:
- DATABASE_URL = your Neon connection string
- SECRET_KEY = output of: python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"
- DEBUG = False
- ALLOWED_HOSTS = your-service.onrender.com
- CSRF_TRUSTED_ORIGINS = https://your-service.onrender.com
- FRONTEND_URL = (fill in after step 4)
- DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_EMAIL / DJANGO_SUPERUSER_PASSWORD

Test: https://your-service.onrender.com/api/products/

## 4. Frontend: Vercel
Import the repo. Root Directory: frontend. Framework: Vite.
Environment variable: VITE_API_BASE = https://your-service.onrender.com
Deploy, then copy the Vercel URL into FRONTEND_URL on Render (no trailing slash) and redeploy the backend.

## Notes
- Free Render services sleep after inactivity; the first request can take about a minute.
- Don't use free tiers for a real store with real customers.
