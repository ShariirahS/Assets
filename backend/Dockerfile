FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies required for building wheels.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definitions. Replace with uv/poetry when the project is ready.
COPY pyproject.toml ./
# COPY poetry.lock ./

RUN pip install --upgrade pip
# pip install -r requirements.txt

COPY . ./

# Collect static files and run migrations once Django project exists.
# RUN python manage.py collectstatic --noinput
# RUN python manage.py migrate

EXPOSE 8000

CMD ["/bin/sh", "-c", "echo Backend container placeholder; tail -f /dev/null"]
# CMD ["python manage.py runserver 0.0.0.0:8000"]
# Replace the command above with gunicorn once the Django app is live:
# CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
