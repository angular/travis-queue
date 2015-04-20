#!/bin/bash

set -xe

git checkout -b deploy
git add node_modules/angular/
git commit -m "deploy build `date`"
git push -f upstream deploy:gh-pages
git reset HEAD~1
git checkout -
git branch -d deploy
