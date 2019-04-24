#!/bin/bash
cd /code
echo ${AWS_ACCESS_KEY}:${AWS_SECRET_KEY} > /root/.passwd-s3fs && chmod 600 /root/.passwd-s3fs
export AWS_REGION=${AWS_REGION:-ap-southeast-2}
s3fs -o passwd_file=/root/.passwd-s3fs -o url=https://s3-${AWS_REGION}.amazonaws.com ${S3_BUCKET} /root/images

# this runs meteor in debug mode, see meteor build for production
# meteor --allow-superuser npm start

# production code
cd /root/build/bundle/
export ROOT_URL=http://example.com
export PORT=3000
export METEOR_SETTINGS=$(cat /code/utils/settings_datarock.json)
meteor node main.js
###
