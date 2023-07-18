FROM node:18-alpine AS builder
WORKDIR /usr/ddd-node-api
# Docker compose context is building on root folder that is the reason of `./api`.
COPY ./api ./
RUN yarn
RUN yarn build

FROM node:18-alpine AS prod-builder
WORKDIR /usr/ddd-node-api
COPY --from=builder /usr/ddd-node-api/ddd-build /usr/ddd-node-api/ddd-build
WORKDIR /usr/ddd-node-api/ddd-build
RUN yarn --production

FROM node:18-alpine AS production
WORKDIR /usr/ddd-node-api-build
COPY --from=prod-builder /usr/ddd-node-api/ddd-build ./
EXPOSE 4001
CMD node ./src/index.js
