# Image construite par la CI à partir du build Nx (dist/apps/web).
FROM nginx:1.27-alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/apps/web /usr/share/nginx/html

EXPOSE 8080
