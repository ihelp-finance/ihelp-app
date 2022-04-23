#!/bin/bash

rundir="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

cd $rundir

echo RUNNING REFRESH TOKENS $(date) > REFRESHTOKENS.log 2>&1

sleep 99999

# timeout 120s /usr/local/bin/node offchaintest.js >> REFRESHTOKENS.log 2>&1

# curl "https://heartbeat.uptimerobot.com/m790172323-b3d887182ce0abcfcd3a8ca01eb842816a4ae1f1" >> REFRESHTOKENS.log 2>&1
