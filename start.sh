#!/bin/bash

docker network create -d bridge --subnet 172.20.0.0/16 ihelp_network > /dev/null 2>&1

if [[ "$1" == "production" ]];then
    MODE=prod
    echo "Starting in $MODE mode..."
    docker run -it --rm --network ihelp_network --ip=172.20.0.3 -w /core -e MODE=$MODE -v $PWD:/core -v $PWD/../env:/env -v $PWD/modules/postgresql/main:/var/lib/postgresql/10/main -v $PWD/modules/postgresql/data:/var/lib/postgresql/data -p 8000:80 --name ihelp_app mattshax/ihelp-dev ./serve.sh
elif [[ "$1" == "dev" ]];then
    MODE=dev
    echo "Starting in $MODE mode..."
    docker run -it --rm --network ihelp_network --ip=172.20.0.3 -w /core -e MODE=$MODE -v $PWD:/core -v $PWD/../env:/env -v $PWD/../ihelp-contracts/build:/build -v $PWD/modules/postgresql/main:/var/lib/postgresql/10/main -v $PWD/modules/postgresql/data:/var/lib/postgresql/data -p 5432:5432 -p 8000:80 --name ihelp_app mattshax/ihelp-dev ./serve.sh
else
    MODE=manual
    echo "Starting in $MODE mode..."
    docker run -it --rm --network ihelp_network --ip=172.20.0.3 -w /core -e MODE=$MODE -v $PWD:/core -v $PWD/../env:/env -v $PWD/../ihelp-contracts/build:/build -v $PWD/modules/postgresql/main:/var/lib/postgresql/10/main -v $PWD/modules/postgresql/data:/var/lib/postgresql/data -p 5432:5432 -p 8000:80 --name ihelp_app mattshax/ihelp-dev ./serve.sh
fi
