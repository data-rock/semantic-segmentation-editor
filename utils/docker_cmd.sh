#!/bin/bash
cd /code
s3fs S3_BUCKET /root/images -o passwd_file=/root/.passwd-s3fs
meteor --allow-superuser npm start
