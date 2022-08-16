#!/bin/bash

echo "Starting Evolution container"
docker-compose -f docker-compose-dev.yml up --build
