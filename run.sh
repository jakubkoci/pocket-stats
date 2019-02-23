#!/bin/bash

node -v

yarn install
# Build is needed only for local development, CI builds the app automatically and deploys only output.
# yarn build
yarn start