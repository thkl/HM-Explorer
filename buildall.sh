#!/usr/bin/env bash
echo "Building"
npm run build
echo "Creating bundle"
npm run bundle
echo "Packaging darwin and win"
electron-packager pack HM_Explorer --platform=darwin --overwrite --asar
electron-packager pack HM_Explorer --platform=win32 --overwrite --asar
echo "Removing old distribution files"
rm dist/*
echo "Creating darwin dmg"
hdiutil create -format UDBZ -srcfolder HM_Explorer-darwin-x64/ dist/HM_Explorer-darwin-x64.dmg
echo "Old Fashioned zipping action"
zip -r -9 -q dist/HM_Explorer-win32-x64.zip HM_Explorer-win32-x64
echo "Removing packaging tmps"
rm -rf HM_Explorer-darwin-x64/
rm -rf HM_Explorer-win32-x64/
echo "i am done ...."
