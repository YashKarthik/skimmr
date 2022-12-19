#!/bin/bash

for i in {1..15}
do
  curl http://localhost:8888/.netlify/functions/gpt-summarize -H 'Content-Type: application/json'  -d '{ "body": "hola amigo" }'
done
