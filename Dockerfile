FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

FROM base AS build

WORKDIR /app

COPY . .

RUN npm run build

FROM base AS runtime

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public


EXPOSE 3000

CMD ["npm", "start"]