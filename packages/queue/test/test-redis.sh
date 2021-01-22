#!/bin/sh

id=$(docker run --rm -p 127.0.0.1:6379:6379 -d redis:latest)

jest

docker stop "${id}"
