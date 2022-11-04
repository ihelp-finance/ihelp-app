# iHelp Dapp Client

### Local Development Instructions

Install the client dependencies:

```
# install nvm (or node v16)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

# install and use v16
nvm install v16
nvm use v16

# install yarn
npm install yarn -g
```

```
# clone the repo
git clone git@github.com:ihelp-finance/ihelp-app.git

# install the client dependencies with yarn
cd client
yarn install
```

Link the custom web3modal module:
```
BACK="$PWD"
cd src/modules/web3modal
yarn link
cd $BACK
yarn link web3modal
```

Copy the env_template to a default .env
```
cp env_template .env
```

Start the project in dev mode on the desired port
```
PORT=8001 yarn run dev
```

Open your browser on http://localhost:8001 to show the app in hot reload mode connected to the production API.
