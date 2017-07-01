const fs = require('fs');
const crypto = require('crypto')

let buffer = fs.readFileSync('package.json');
let pck = JSON.parse(buffer.toString());

buffer = fs.readFileSync('dist/update.asar')
var hash = crypto.createHash('sha1')
hash.update(buffer)
let sha1CheckSum = hash.digest('hex')
    
let updateDesc = {
	'url':'https://github.com/thkl/HM-Explorer/raw/master/dist/update.asar.gz',
	'name':'app',
	'notes':'HM-Explorer Update',
	'updated': new Date().toISOString(),
	'version': pck.version,
	'sha1':sha1CheckSum
}

fs.writeFileSync('dist/update.json', JSON.stringify(updateDesc, null, '  '), 'utf-8');