# iHelp Protocol Distributed Application (Dapp)

This  project implements a react client with a node.js/express server.

For production, the project is designed to be deployed as a series of k8s microservice deployments.

For development, the server and client apps can be deployed as a single monolithic docker container. Development mode starts with hot reload and watch services on the server and client sides.

#### Monolithic development instructions using docker:

The below instructions are to run the app in a turnkey dev-mode fashion completely inside the provided docker container. We recommend this approach so the node modules match the version running inside the container:

```
# install docker (if not installed already)
# curl -fsSL https://get.docker.com -o get-docker.sh
# sh get-docker.sh
# on mac or windows, you can also use Docker Desktop

# create the starter db so there is some data in the database for dev purposes
cd modules/postgresql
tar xzvf starter_db.tgz
cd ../../

# start the docker container
./start.sh

# inside the docker container install the node modules
yarn install
cd client
yarn install
cd ../

# start the server and client apps
npm start
```

If you are running on a linux environment, you can also install the modules outside the container with the same nodejs version (v12) and run the app directly in dev mode:

```
# install nvm and use node v12 for the current state of this app
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v12
nvm use v12

# install docker (if not installed already)
# curl -fsSL https://get.docker.com -o get-docker.sh
# sh get-docker.sh

# install the node modules
yarn install
cd client
yarn install
cd ../

# create the starter db so there is some data in the database for dev purposes
cd modules/postgresql
tar xzvf starter_db.tgz
cd ../../

# start the service in dev mode
./start.sh dev
```

After starting the service, you can test the dev service is running with the below commands:

```
curl http://localhost:8000/api/v1/data
{
    "charities": "/api/v1/data/charities",
    "stats": "/api/v1/data/stats",
    "totalinterestbycharities": "/api/v1/data/totalinterestbycharities",
    "nickname": "/api/v1/data/nickname",
    "topcharities": "/api/v1/data/topcharities",
    "userstats": "/api/v1/data/userstats",
    "stakingstats": "/api/v1/data/stakingstats",
    "contribovertime": "/api/v1/data/contribovertime",
    "topcontributors": "/api/v1/data/topcontributors",
    "contracts": "/api/v1/data/contracts"
}
```

By default, the dapp uses the contracts/hardhat-contracts.json file to point to a specific set of contracts.

You can use the nginx/outer_example.conf config as an example to proxy a 80/443 port of a web server to the running 8000 port in the container.
