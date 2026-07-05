# Coloque este arquivo em task-systems/backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Use o requirements.txt corrigido em backend-fixes/requirements.txt, que já
# inclui psycopg2-binary (driver Postgres), gunicorn (servidor de produção)
# e whitenoise (serve estáticos do admin/Swagger com DEBUG=False)
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY . .

# SECRET_KEY temporária só para o collectstatic conseguir rodar durante o
# build. Em tempo de execução, o docker-compose/k8s sobrescreve com o valor real.
ENV SECRET_KEY=temporary-build-key-not-used-in-production
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
