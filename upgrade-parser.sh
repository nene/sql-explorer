#!/usr/bin/env sh

# abort on errors
set -e

# upgrade parser to latest version
yarn upgrade sql-parser-cst@latest

# extract version from package.json
version=$(node -p "console.log(require('./package.json').dependencies['sql-parser-cst'].replace(/^./, ''));")

git ci -am "Upgrade parser to $version"

yarn deploy

git push
