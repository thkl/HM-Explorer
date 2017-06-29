if ((!process.argv) || (process.argv.length<4)) {
	console.log("Syntax buildicons source dest (webui path = source ; icons.js = dest")
	process.exit(0)
}



let inputfile = process.argv[2]
let outfile = process.argv[3]

console.log('Writing to %s',outfile)
var strout = require('fs').createWriteStream(outfile, {
  flags: 'w' // 'a' means appending (old data will be preserved)
})

// build header
strout.write('module.exports =  {icons : {\n')


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(inputfile)
});

var lineNum = 0;

lineReader.on('line', function (line) {
  let devtype = line.match('DEV_PATHS\\[\(.*?)\\]')
  let imgname = line.match('devices/50/(.*?)"')
  if ((devtype) && (devtype.length>0) && (imgname) && (imgname.length>0)) {
	  if (lineNum > 0) {
		strout.write(',\n')
	  }
	  strout.write(devtype[1])
	  strout.write(': "' + imgname[1] + '"')
	  lineNum = lineNum + 1
  }
});


lineReader.on('close', function() {
strout.write('}}')
strout.end()	
});
