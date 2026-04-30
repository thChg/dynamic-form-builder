FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm install
RUN npx prisma generate

COPY . .

CMD ["npm", "start"]