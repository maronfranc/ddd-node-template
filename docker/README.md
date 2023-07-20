# Docker
## Requirement
- Docker
- Docker compose

## Start environment
### Test container
#### Terminal 1
```sh
cd test
# Add flag `--force-recreate` to flush previous container data.
docker-compose up
```
#### Terminal 2: start local api
```sh
cd ../api  # Move to api folder with package.json
yarn test # Yarn or any other package manager command
yarn start:dev
```

### Dev container
Required local node installation.
#### Terminal 1: start docker database container
```sh
cd dev
docker-compose up 
```
#### Terminal 2: start local api
```sh
cd ../api  # Move to api folder with package.json
yarn start:dev # Yarn or any other package manager command
```

### Prod container
#### Terminal 1
```sh
cd prod
docker-compose up 
```
