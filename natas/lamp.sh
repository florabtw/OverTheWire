#!/bin/bash

docker stop lamp

docker run                           \
    --rm                             \
    -d                               \
    -p 3000:80                       \
    --name lamp                      \
    -v /var/www/natas:/var/www/html  \
    -v lamp:/var/lib/mysql           \
    fauria/lamp
