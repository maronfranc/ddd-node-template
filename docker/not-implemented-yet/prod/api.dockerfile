FROM node:18-alpine AS builder
LABEL author="github.com/maronfranc" 
LABEL description="Node api with domain-driven-development example"

WORKDIR /usr/node-api
# Docker compose context is building on root folder that is the reason of `./api`.
COPY ./api ./
RUN yarn
RUN yarn build

FROM node:18-alpine AS prod-builder
WORKDIR /usr/node-api
COPY --from=builder /usr/node-api/ddd-build /usr/build/node-api
WORKDIR /usr/build/node-api
RUN yarn --production

FROM node:18-alpine AS production
WORKDIR /usr/build/node-api
COPY --from=prod-builder /usr/build/node-api ./
USER node
EXPOSE 4001

CMD node ./src/index.js
