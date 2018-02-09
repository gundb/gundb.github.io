#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
{
  rimraf .cache dist && \
  yarn build && \

  fn=c9b06c90ea474e18e3e2357079222bfb.js && \
  grep $fn dist/index.html && \
  cs=$(sha1sum dist/$fn) && \
  set -- $cs && \
  sed -i "s/${fn}/${fn}?bst=${1}/g" dist/index.html && \

  fn=2d361c095c89a2687bbcf9f7866d31f4.css && \
  grep $fn dist/index.html && \
  cs=$(sha1sum dist/$fn) && \
  set -- $cs && \
  sed -i "s/${fn}/${fn}?bst=${1}/g" dist/index.html && \

  find .. -maxdepth 1 -type f -not -name 'navigation.json' -delete && \
  cp dist/* .. && \
  cp 301/* .. && \
  rsync -aP --delete --exclude='.git/' --exclude='.cache/' --exclude='dist/' --exclude node_modules /var/www/gundocs/gundb/docs/ /media/sf_gundocs/gundb/docs && \

  echo -e "${GREEN}=== Success ===${NC}"
}  || {
  echo -e "${RED}!!!!!!!!!! Error !!!!!!!!!!${NC}"
}