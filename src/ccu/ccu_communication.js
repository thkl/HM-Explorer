const http = require('http')
	
class CCUCommunication {
	

    constructor(ccuip) {
	   this.ccuIp = ccuip
	}
	
	
	sendRegaCommand(script,callback) {
		var that = this
		var options = {
			host: this.ccuIp,
			port: 8181,
			path: '/tclrega.exe',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(script)
			}
		}
		
		console.log('CCU at Rega Command :%s',script);
	
		var request = http.request(options, function(response) {
		var data = '';
	
		response.setEncoding("binary");

	
		response.on('data', function(chunk) {
      	  data += chunk.toString();
      	});
      
	  	response.on('end', function() {
     	   var pos = data.lastIndexOf('<xml><exec>')
	 	   var tx = (data.substring(0, pos))
	 	   var vars = data.substr(pos)
	 	   console.log('CCU Rega Response :%s',tx)
	 	   	callback(tx,vars);
	 	   });

		}).on('error', function(e) {
	      console.error(e)
		});

		request.write(script);
		request.end();
	}
}

module.exports = CCUCommunication;
