#!/bin/bash
odir=dump-$(date +%F)
mongodump -h 127.0.0.1 --port 3001 -d meteor -o ${odir}
tar cjf ${odir}.tar.bz2 ${odir}
rm -r ${odir}
