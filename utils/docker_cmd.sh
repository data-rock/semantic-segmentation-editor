#!/bin/bash
cd /code
echo ${AWS_ACCESS_KEY}:${AWS_SECRET_KEY} > /root/.passwd-s3fs && chmod 600 /root/.passwd-s3fs
s3fs ${S3_BUCKET} /root/images -o passwd_file=/root/.passwd-s3fs
meteor --allow-superuser npm start # this runs meteor in debug mode, see meteor build for production
