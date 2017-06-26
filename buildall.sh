#!/usr/bin/env bash
npm run build
npm run bundle
electron-packager pack HM_Explorer --platform=darwin --overwrite --asar
electron-packager pack HM_Explorer --platform=win32 --overwrite --asar
rm dist/*
hdiutil create -format UDBZ -srcfolder HM_Explorer-darwin-x64/ dist/HM_Explorer-darwin-x64.dmg
zip -r -9 -q dist/HM_Explorer-win32-x64.zip HM_Explorer-win32-x64
rm -rf HM_Explorer-darwin-x64/
rm -rf HM_Explorer-win32-x64/
