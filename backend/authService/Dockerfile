FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm start"]