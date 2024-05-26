FROM node:20.13.1-alpine3.19 AS BUILD

WORKDIR /api

COPY . .

RUN npm install
RUN npm run build

FROM node:20.13.1-alpine3.19 AS PROD 

WORKDIR /api

COPY --chown=node:node --from=BUILD /api/dist ./dist
COPY --chown=node:node --from=BUILD /api/node_modules ./node_modules

EXPOSE 3000

RUN apk add --no-cache openssl

CMD ["sh", "-c", "node dist/src/main.js"]
