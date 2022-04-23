#!/bin/bash

source $PWD/.env

docker run  -it --network ihelp_network -p 8001:8001 --name=pgadmin \
-e "PGADMIN_DEFAULT_EMAIL=$PGADMIN_DEFAULT_EMAIL" \
-e "PGADMIN_DEFAULT_PASSWORD=$PGADMIN_DEFAULT_PASSWORD" \
-e "PGADMIN_LISTEN_PORT=$PGADMIN_LISTEN_PORT" \
 dpage/pgadmin4
