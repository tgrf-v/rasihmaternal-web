#!/bin/sh
set -e

echo "==> Starting RASIH Maternal Container Entrypoint..."

# Create necessary runtime directories if missing
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/app/public

# Fix permissions for web server
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create storage symlink
if [ ! -L /var/www/html/public/storage ]; then
    echo "==> Linking storage..."
    php /var/www/html/artisan storage:link || true
fi

# Run optimization & caching if APP_KEY exists
if [ -n "$APP_KEY" ]; then
    echo "==> Optimizing Laravel config, routes, and views..."
    php /var/www/html/artisan config:cache || true
    php /var/www/html/artisan route:cache || true
    php /var/www/html/artisan view:cache || true

    # Optional auto-migration in production if DB is configured
    if [ "$AUTO_MIGRATE" = "true" ] || [ "$RUN_MIGRATIONS" = "true" ]; then
        echo "==> Running database migrations..."
        php /var/www/html/artisan migrate --force || true
    fi
else
    echo "==> WARNING: APP_KEY is empty! Please configure APP_KEY in Dokploy Environment Variables."
fi

echo "==> Starting Supervisord (Nginx + PHP-FPM + FastAPI ML)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
