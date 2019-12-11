#!/usr/bin/env bash

set -exo pipefail;

DEV_DEPS="@types/jest jest ts-jest"

ORIG_DIR=$(pwd)
function finish {
  if [ ! $? -eq 0 ] ; then
    echo "There are failing tests"
  else
    echo "All tests passed!"
  fi
  cd "$ORIG_DIR"
}
trap finish EXIT

function setup {
  local FLAG=$1
  cd "$(mktemp -d)"
  npm init -y
  npx $ORIG_DIR $FLAG
  ls -a
}

function setup_jest_test {
  npm i -D $DEV_DEPS typescript
  mkdir src
  cp $ORIG_DIR/tsconfig.json .
  cp -r $ORIG_DIR/__tests__ src
}

function common_test {
  CONFIG_FILE="jest.config.js"
  echo "'$CONFIG_FILE' should exist"
  [ -e "$CONFIG_FILE" ]

  PEER="jest"
  echo "'$PEER' should be installed"
  [ -d "node_modules/$PEER" ]

  setup_jest_test
  echo "'npm run test' should run example test"
  npm run test
}

function install_test {
  setup

  common_test

  SELF="@eliasnorrby/jest-config"
  echo "'$SELF' should be installed"
  [ -d "node_modules/$SELF" ]
}

function no_install_test {
  setup "--no-install"

  common_test

  SELF="@eliasnorrby/jest-config"
  echo "'$SELF' should not be installed"
  [ ! -d "node_modules/$SELF" ]
}

function help_test {
  npx $ORIG_DIR --help | grep "Usage"
}

install_test

no_install_test

help_test
