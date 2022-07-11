#!/bin/bash

rm /etc/nginx/sites-enabled/default > /dev/null 2>&1

#ln /core/nginx/docker_nginx.conf /etc/nginx/sites-enabled/default
cp /core/nginx/docker_nginx.conf /etc/nginx/nginx.conf

service nginx restart
