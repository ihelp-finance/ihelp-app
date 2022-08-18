#!/bin/bash

context="."
DOCKER_BUILDKIT=1 docker build --no-cache -t ihelp-dev -f docker/Dockerfile-dev $context
