#!/bin/bash

BRANCH_NAME="frontend"
latestTag=$(git describe --tags --abbrev=0 $BRANCH_NAME)

latestVersion=${latestTag//-*/ }
latestVersion=${latestVersion#v}
versionBits=(${latestVersion//./ })
latestMajor=${versionBits[0]}
latestMinor=${versionBits[1]}
echo "$latestVersion"
echo "$latestMajor"
echo "$latestMinor"

next_minor="v$latestMajor.$(( latestMinor + 1 ))-$BRANCH_NAME"
echo "Next Minor: $next_minor"




#git describe --tags $(git rev-list --tags --max-count=1)

##Get the highest tag number
#VERSION=`git describe --abbrev=0 --tags`
#VERSION=${VERSION:-'0.0.0'}

##Get number parts
#MAJOR="${VERSION%%.*}"; VERSION="${VERSION#*.}"
#MINOR="${VERSION%%.*}"; VERSION="${VERSION#*.}"
#PATCH="${VERSION%%.*}"; VERSION="${VERSION#*.}"

##Increase version
#PATCH=$((PATCH+1))

##Get current hash and see if it already has a tag
#GIT_COMMIT=`git rev-parse HEAD`
#NEEDS_TAG=`git describe --contains $GIT_COMMIT`

##Create new tag
#NEW_TAG="$MAJOR.$MINOR.$PATCH"
#echo "Updating to $NEW_TAG"

##Only tag if no tag already (would be better if the git describe command above could have a silent option)
#if [ -z "$NEEDS_TAG" ]; then
#    echo "Tagged with $NEW_TAG (Ignoring fatal:cannot describe - this means commit is untagged) "
#    git tag $NEW_TAG
#else
#    echo "Already a tag on this commit"
#fi
