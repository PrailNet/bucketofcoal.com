#!/bin/sh
mkdir .public
cp -R * .public
mv .public public
rm -rf public/node_modules public/package* public/README.md public/LICENSE public/gulpfile.js public/scripts public/scss