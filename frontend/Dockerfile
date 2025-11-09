FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies once package.json exists.
COPY package.json package-lock.json* ./
# RUN npm ci

COPY . ./

# Build assets when Next.js project is in place.
# RUN npm run build

EXPOSE 3000

CMD ["bash", "-lc", "echo Frontend container placeholder; tail -f /dev/null"]
# CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
# Swap to production start command after implementing SSR build:
# CMD ["npm", "run", "start"]
