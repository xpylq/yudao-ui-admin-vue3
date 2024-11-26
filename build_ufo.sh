#!/bin/bash
pnpm build:test
rm md_admin.zip
zip -r md_admin.zip md_admin/
scp -r md_admin.zip root@137.220.202.203:/data/nginx/www/