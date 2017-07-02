(function () {'use strict';

const http = require('http');
const binrpc = require('binrpc');
const xmlrpc = require('homematic-xmlrpc');


class CCUCommunication {
	

    constructor(ccuip) {
	   this.ccuIp = ccuip;
	}
	
	
	sendInterfaceCommand(interfc,command,attributes,callback) {
	   var client;
	   switch (interfc.type) {
		    case "BidCos-RF":
			  client  = binrpc.createClient({ host: interfc.host, port: interfc.port, path: interfc.path});
			  break;
	   } 
	   
	   console.log("send %s to %s:%s",command,interfc.host,interfc.port);			

	   
	   client.methodCall(command,attributes , function (error, value) {
	   	if (callback) {
		   	callback(error,value);
	   	}
	   });
	}
	
	sendRegaCommand(script,callback) {
		var encoding = require("encoding");
		script = encoding.convert(script, "binary");
		var that = this;
		var options = {
			host: this.ccuIp,
			port: 8181,
			path: '/tclrega.exe',
			method: 'POST',
			headers: {
				'Content-Length': Buffer.byteLength(script)
			}
		};
		
		
		console.log('CCU at Rega Command :%s',script.toString());
	
		var request = http.request(options, function(response) {
		var data = '';
	
		response.setEncoding("binary");

	
		response.on('data', function(chunk) {
      	  data += chunk.toString();
      	});
      
	  	response.on('end', function() {
		   var pos = data.lastIndexOf('<xml><exec>');
	 	   var tx = (data.substring(0, pos));
	 	   var vars = data.substr(pos);
	 	   console.log('CCU Rega Response :%s',tx);
	 	   	callback(tx,vars);
	 	   });

		}).on('error', function(e) {
	      console.error(e);
		});

		request.write(script);
		request.end();
	}
}

module.exports = CCUCommunication;

}());
//# sourceMappingURL=ccu_communication.js.map