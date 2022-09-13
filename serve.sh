#!/bin/bash

# install the modules
# yarn install
# cd client
# yarn install
# cd ../

# link and start nginx
cd nginx
./dockerLink.sh
cd ../

# change the postgres data permissions
chown postgres /var/lib/postgresql/data -R
chmod 0700 /var/lib/postgresql/data -R

# start postgresql
#service postgresql start
echo "starting postgres-14..."
docker-entrypoint.sh -c 'shared_buffers=256MB' -c 'max_connections=200' > /tmp/pg.log 2>&1 &

echo "127.0.0.1 ihelp-db" >> /etc/hosts

# client/node_modules/react-scripts/scripts/start.js
# paste below above this line: openBrowser(urls.localUrlForBrowser);
# devServer.keepAliveTimeout = 0;

export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm install v16
nvm use v16
npm install yarn -g

# link the web3modal project
BACK="$PWD"
cd client/src/modules/web3modal
yarn link
cd $BACK
cd client 
yarn link web3modal
cd $BACK

# start the service
if [[ "$MODE" == "prod" ]];then
    npm run production
elif [[ "$MODE" == "dev" ]];then
    npm start
else
    /bin/bash
fi

