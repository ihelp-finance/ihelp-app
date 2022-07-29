#!/bin/bash

for statement in `cat /env/.env`; do
    export $statement
done
