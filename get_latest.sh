#!/bin/bash

FRONTEND_BRANCH="frontend"
BACKEND_BRANCH="node-server"

FRONTEND_DIR="frontend/"
BACKEND_DIR="backend/"

function get_latest_frontend() {
    local BRANCH
    local DIR
    BRANCH=$FRONTEND_BRANCH
    DIR=$FRONTEND_DIR

    local latestTag
    latestTag=$(git describe --tags --abbrev=0 $BRANCH)
    printf "Latest FE Tag: %s" "$latestTag"
    git checkout $latestTag -- $DIR
}

function get_latest_backend() {
    local BRANCH
    local DIR
    BRANCH=$BACKEND_BRANCH
    DIR=$BACKEND_DIR

    local latestTag
    latestTag=$(git describe --tags --abbrev=0 $BRANCH)
    printf "Latest BE Tag: %s" "$latestTag"
    git checkout $latestTag -- $DIR
}

if [ -z $(git status --untracked-files=no --porcelain) ]
then
    git pull
    # Get the latest tags
    echo "Fetching latest tags..."
    git fetch --tags

    BE_OUT=$(get_latest_backend)
    FE_OUT=$(get_latest_frontend)
    git cm "Updated from $BE_OUT and $FE_OUT"
    git push
else
    echo "There are unstaged files in the current working directory"
    echo -e "Please commit these before updating to the latest releases\n"
    git status --untracked-files=no --porcelain
fi
