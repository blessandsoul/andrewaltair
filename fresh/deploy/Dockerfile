FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Copy standalone build
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
