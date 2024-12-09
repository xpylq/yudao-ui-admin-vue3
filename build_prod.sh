#!/bin/bash
pnpm build:prod
rm md_admin.zip
zip -r md_admin.zip md_admin/
scp -r -P9527 md_admin.zip root@137.220.227.153:/data/nginx/www/
# scp -r -P9527 ~/Downloads/dist.zip root@137.220.227.153:/data/nginx/www/