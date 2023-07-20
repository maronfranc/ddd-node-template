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
# Add flag `--force-recreate` to flush previous container data if the file system is ramfs.
docker-compose --file ./docker/test/docker-compose.yml up
```
#### Terminal 2
```sh
# yarn or other package manager
cd api && yarn
yarn test
yarn start:dev
```

### Production build
Production [docker-compose](./docker/prod/docker-compose.yml) is running an API container using the [.api.env](./docker/prod/.api.env) vars.
```sh
# Add `--build` flag to update api code.
docker-compose --file ./docker/prod/docker-compose.yml up 
```

### API requests
```sh
DEV_API_HOST=http://localhost:3000
PROD_API_HOST=http://localhost:4001
API_HOST=${PROD_API_HOST}

# Health check.
curl ${API_HOST}/healthcheck

# Create example in database.
curl -XPOST ${API_HOST}/example/create \
  -H "Content-Type: application/json" \
  --data '{"title": "Manual_test_example"}' 
# List created examples.
curl ${API_HOST}/example
```
