#!/usr/bin/env bash
echo "Building"
npm run build
echo "Creating bundle"
npm run bundle
echo "Packaging darwin and win"
npm run package-mac
npm run package-win
npm run package-win32
echo "Removing old distribution files"
rm dist/*
echo "Creating darwin dmg"
hdiutil create -format UDBZ -srcfolder HM_Explorer-darwin-x64/ dist/HM_Explorer-darwin-x64.dmg
echo "Old Fashioned zipping action 64bit"
zip -r -9 -q dist/HM_Explorer-win32-x64.zip HM_Explorer-win32-x64
echo "Old Fashioned zipping action 32bit"
zip -r -9 -q dist/HM_Explorer32Bit-win32-ia32.zip HM_Explorer32Bit-win32-ia32
cp HM_Explorer-win32-x64/resources/app.asar dist/update.asar
	
npm run build-updatedescription

gzip dist/update.asar

echo "Removing packaging tmps"
rm -rf HM_Explorer-darwin-x64/
rm -rf HM_Explorer-win32-x64/
rm -rf HM_Explorer32Bit-win32-ia32/

echo "i am done ...."
