FROM --platform=linux/amd64 node:20-alpine AS base

WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

ARG NEXT_PUBLIC_MIXPANEL_TOKEN
ENV NEXT_PUBLIC_MIXPANEL_TOKEN=$NEXT_PUBLIC_MIXPANEL_TOKEN

ENV NEXT_PUBLIC_ENV=production
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_fNRx5zhRbDPYOphCeUqHc8jF
ENV NEXT_PUBLIC_STRIPE_LITE_PRICE_ID=price_1PQwOSHZr7phObUUzHxeMYlu
ENV NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1PR0njHZr7phObUUcFvgFXB9
ENV NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID=price_1PR0oVHZr7phObUUP0pSSyhL

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