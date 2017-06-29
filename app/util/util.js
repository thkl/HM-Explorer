(function () {'use strict';

function copyFileSync (srcFile, destFile, options) {
  const overwrite = options.overwrite;
  const errorOnExist = options.errorOnExist;
  const preserveTimestamps = options.preserveTimestamps;

  const BUF_LENGTH = 64 * 1024;
  const _buff = buffer(BUF_LENGTH);
  const fs = require('fs');

  if (fs.existsSync(destFile)) {
    if (overwrite) {
      fs.unlinkSync(destFile);
    } else if (errorOnExist) {
      throw new Error(`${destFile} already exists`)
    } else return
  }

  const fdr = fs.openSync(srcFile, 'r');
  const stat = fs.fstatSync(fdr);
  const fdw = fs.openSync(destFile, 'w', stat.mode);
  let bytesRead = 1;
  let pos = 0;

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, _buff, 0, bytesRead);
    pos += bytesRead;
  }

  if (preserveTimestamps) {
    fs.futimesSync(fdw, stat.atime, stat.mtime);
  }

  fs.closeSync(fdr);
  fs.closeSync(fdw);
}


function buffer(size) {

  if (typeof Buffer.allocUnsafe === 'function') {
    try {
      return Buffer.allocUnsafe(size)
    } catch (e) {
      return new Buffer(size)
    }
  }
  return new Buffer(size)
}

module.exports = {
	
	copyFileSync:copyFileSync
	
};

}());
//# sourceMappingURL=util.js.map