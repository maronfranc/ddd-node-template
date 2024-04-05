# ddd-node-template
An implementation of a domain-driven design [architecture](./api/src).

## Requirements
### Production requirements
- Docker and Docker Compose.
### Dev/test requirements
- Docker and Docker Compose.
- Npm or other package manager.
- Node.

## [Docker](./docker)
Container with infrastructure databases.

## Manual tests
### Dev/test build
#### Terminal 1
```sh
docker-compose --file ./docker/test/docker-compose.yml up
```
#### Terminal 2
```sh
# yarn or other package manager
cd api && yarn
yarn test
yarn dev
```
