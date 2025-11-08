FROM nginx:1.27-alpine

# Copy templated configs once they exist.
COPY conf.d/ /etc/nginx/templates/

# Provide default health check until upstream apps are in place.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1
