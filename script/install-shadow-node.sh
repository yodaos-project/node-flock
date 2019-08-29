#!/bin/bash
set -ex

if test -z "$1"; then
  shadow_node_version=`cat package.json | jq -r '.engine."shadow-node"'`
else
  shadow_node_version="$1"
fi
url="https://github.com/yodaos-project/ShadowNode/releases/download/v$shadow_node_version/shadow-node-v$shadow_node_version-$(uname)-$(uname -m).tar.gz"
file_name="shadow-node-v$shadow_node_version-$(uname)-$(uname -m).tar.gz"

cd /tmp
  wget $url
  tar -xzf $file_name

  sudo=`command -v sudo || true`
  command $sudo cp -r ./usr/* /usr
cd -

type iotjs
iotjs --version || true
