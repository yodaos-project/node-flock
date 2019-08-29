#!/bin/bash

brew update

PKGS="
  cmake
  node
  jq
"

for pkg in $PKGS
do
  brew install $pkg
done
