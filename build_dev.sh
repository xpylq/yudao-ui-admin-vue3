#!/bin/bash
set -ex
pnpm build:dev
rm md_admin.zip
zip -r md_admin.zip md_admin/
cp md_admin.zip /Users/consul/work/nginx/www/
if [ -d /Users/consul/work/nginx/www/md_admin ]; then
  rm -rf /Users/consul/work/nginx/www/md_admin
fi
unzip /Users/consul/work/nginx/www/md_admin.zip -d /Users/consul/work/nginx/www/

