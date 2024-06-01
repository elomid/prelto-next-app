FROM --platform=linux/amd64 node:20-alpine AS base

WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package*.json ./

RUN npm ci

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