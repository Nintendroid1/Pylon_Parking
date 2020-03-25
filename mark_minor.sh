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
