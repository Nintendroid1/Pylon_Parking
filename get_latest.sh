#!/bin/bash

FRONTEND_BRANCH="frontend"
BACKEND_BRANCH="node-server"

FRONTEND_DIR="frontend/"
BACKEND_DIR="backend/"

# Get the latest tags
echo "Fetching latest tags..."
git fetch --tags

function get_latest_frontend() {
    local BRANCH
    local DIR
    BRANCH=$FRONTEND_BRANCH
    DIR=$FRONTEND_DIR

    local latestTag
    latestTag=$(git describe --tags --abbrev=0 $BRANCH)
    echo "Latest FE Tag: $latestTag"
    git checkout $latestTag $DIR
}

function get_latest_backend() {
    local BRANCH
    local DIR
    BRANCH=$BACKEND_BRANCH
    DIR=$BACKEND_DIR

    local latestTag
    latestTag=$(git describe --tags --abbrev=0 $BRANCH)
    echo "Latest BE Tag: $latestTag"
    git checkout $latestTag $DIR
}

get_latest_backend
get_latest_frontend
