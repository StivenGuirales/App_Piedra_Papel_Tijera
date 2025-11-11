# Usar imagen oficial de PHP con Apache
FROM php:8.2-apache

# Habilitar mod_rewrite para Apache (para las rutas de la API)
RUN a2enmod rewrite

# Copiar el archivo PHP al contenedor
COPY index.php /var/www/html/
COPY .htaccess /var/www/html/

# Crear directorio para datos persistentes
RUN mkdir -p /var/www/html/data && chmod -R 777 /var/www/html/data

# Exponer el puerto 80
EXPOSE 80