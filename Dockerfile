# ==========================================
# Stage 1: Build Frontend Assets (Vite + React)
# ==========================================
FROM node:20-bookworm-slim AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production Server (PHP 8.3 + Nginx + Python ML + Supervisor)
# ==========================================
FROM php:8.3-fpm-bookworm AS production

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV OMP_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV NUMEXPR_NUM_THREADS=1
ENV MALLOC_ARENA_MAX=2

WORKDIR /var/www/html

# Install system dependencies, Nginx, Supervisor, Python3, and libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    python3 \
    python3-pip \
    python3-venv \
    git \
    unzip \
    curl \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    libgomp1 \
    default-mysql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    bcmath \
    mbstring \
    opcache \
    pcntl \
    zip \
    gd

# Install Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Setup Python Virtual Environment and Install ML dependencies
RUN python3 -m venv /opt/venv
COPY ml_service/requirements.txt /tmp/ml_requirements.txt
RUN /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r /tmp/ml_requirements.txt \
    && rm -f /tmp/ml_requirements.txt

# Copy Docker configuration files
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php-fpm-pool.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy Application Source Code
COPY . /var/www/html

# Copy compiled frontend assets from Stage 1
COPY --from=frontend /app/public/build /var/www/html/public/build

# Install PHP composer production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set proper ownership and permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
