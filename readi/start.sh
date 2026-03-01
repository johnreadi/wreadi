#!/bin/sh
# Forcer le hostname à 0.0.0.0 en modifiant server.js au runtime
sed -i "s/process.env.HOSTNAME || '0.0.0.0'/'0.0.0.0'/g" server.js
node server.js
