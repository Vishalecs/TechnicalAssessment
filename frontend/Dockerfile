FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve && apk add --no-cache curl

COPY --from=builder /app/dist ./dist

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:4173 || exit 1

CMD ["serve", "-s", "dist", "-l", "4173"]
