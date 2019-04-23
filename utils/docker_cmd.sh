#!/bin/bash
cd /code
echo ${AWS_ACCESS_KEY}:${AWS_SECRET_KEY} > /root/.passwd-s3fs && chmod 600 /root/.passwd-s3fs
s3fs ${S3_BUCKET} /root/images -o passwd_file=/root/.passwd-s3fs

# this runs meteor in debug mode, see meteor build for production
meteor --allow-superuser npm start

# production code
# cd /root/build/bundle/
# export ROOT_URL=http://example.com
# export PORT=3000
# export METEOR_SETTINGS=$(cat /code/settings.json)
# meteor node main.js
###
