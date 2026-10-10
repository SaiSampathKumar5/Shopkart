#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
# Free Render plans have no shell, so create the admin from env vars (skips if it exists)
python manage.py createsuperuser --noinput || true
