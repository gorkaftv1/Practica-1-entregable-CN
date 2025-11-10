FROM node:20-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./

RUN npm i

COPY --chown=appuser:appgroup . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

USER appuser

CMD ["node", "app.js"]