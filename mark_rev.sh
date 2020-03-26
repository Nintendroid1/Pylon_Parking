#!/bin/bash

function mark_minor_tag() {
    local BRANCH_NAME
    local latestTag
    BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
    latestTag=$(git describe --tags --abbrev=0 $BRANCH_NAME)

    local latestVersion
    local latestVersion
    latestVersion=${latestTag//-*/ }
    latestVersion=${latestVersion#v}

    local versionBits
    local latestMajor
    local latestMinor
    versionBits=(${latestVersion//./ })
    latestMajor=${versionBits[0]}
    latestMinor=${versionBits[1]}

    local next_minor
    local NEW_TAG
    next_minor="$(( latestMinor + 1 ))"
    NEW_TAG="v$latestMajor.$next_minor-$BRANCH_NAME"
    # echo "Current Tag: $latestTag"
    echo "New Tag: $NEW_TAG (Ignoring fatal:cannot describe - this means commit is untagged) "
    git tag $NEW_TAG
    git push origin $NEW_TAG
}

function mark_major_tag() {
    local BRANCH_NAME
    local latestTag
    BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
    latestTag=$(git describe --tags --abbrev=0 $BRANCH_NAME)

    local latestVersion
    local latestVersion
    latestVersion=${latestTag//-*/ }
    latestVersion=${latestVersion#v}

    local versionBits
    local latestMajor
    local latestMinor
    versionBits=(${latestVersion//./ })
    latestMajor=${versionBits[0]}
    latestMinor=${versionBits[1]}

    local next_major
    local next_minor
    local NEW_TAG
    next_minor="0"
    next_major="$(( latestMajor + 1 ))"
    NEW_TAG="v$next_major.$next_minor-$BRANCH_NAME"
    # echo "Current Tag: $latestTag"
    echo "New Tag: $NEW_TAG (Ignoring fatal:cannot describe - this means commit is untagged) "
    git tag $NEW_TAG
    git push origin $NEW_TAG
}

function mark_rev() {
    GIT_COMMIT=`git rev-parse HEAD`
    NEEDS_TAG=`git describe --contains $GIT_COMMIT`

    ##Only tag if no tag already (would be better if the git describe command above could have a silent option)
    if [ -z "$NEEDS_TAG" ]; then
        if [ "$1" == "major" ]
        then
            mark_major_tag
        elif [ "$1" == "minor" ]
        then
            mark_minor_tag
        fi
    else
        BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
        latestTag=$(git describe --tags --abbrev=0 $BRANCH_NAME)
        echo "Already a tag on this commit: $latestTag'"
    fi
}

function print_help() {
    printf "%sUsage: ./mark_rev.sh [minor|major|del]\n" "${1//_/ }"
    printf "%s\t minor : Mark the current commit as a minor revision (1.0 -> 1.1)\n" "${1//_/ }"
    printf "%s\t major : Mark the current commit as a major revision (1.0 -> 2.0)\n" "${1//_/ }"
    printf "%s\t del   : Remove the tag on the current commit\n" "${1//_/ }"
    printf "\n%sIf no option specified, Default behavior is './mark_rev.sh minor'\n" "${1//_/ }"
}

if [ $# -ge 1 ]
then
    if [ "$1" == "--help" ] || [ "$1" == "help" ] || [ "$1" == "-h" ]
    then
        print_help
    elif [ "$1" == "del" ]
    then
        GIT_COMMIT=`git rev-parse HEAD`
        CUR_TAG=`git describe --contains $GIT_COMMIT`

        # If no tag exists there is nothing to delete
        if [ -z "$CUR_TAG" ]; then
            echo "There is no tag to delete on this commit"
        else
            echo "Deleting tag '$CUR_TAG'"
            git tag --delete $CUR_TAG
            git push --delete origin $CUR_TAG
        fi
    elif [ "$1" == "major" ] || [ "$1" == "minor" ]
    then
        mark_rev "$1"
    else
        echo -e "Err: Option $1 not recognized\n"
        print_help "___"
    fi
else
    mark_rev "minor"
fi
