(function () {'use strict';

const http = require('http');
const binrpc = require('binrpc');
const xmlrpc = require('homematic-xmlrpc');
const ipc = require('electron').ipcRenderer;

class CCUCommunication {
	

    constructor(ccuip) {
	   this.ccuIp = ccuip;
	   this.server = null;
	   this.listeningPort = 19872; // Ranomize this
	   this.localIP = this.getIPAddress();
	}
	
	
	sendInterfaceCommand(interfc,command,attributes,callback) {
	   var client;
	   
	   console.log('Interface URL %s',interfc.url);
	   
	   if (interfc.url.startsWith('xmlrpc_bin')) {
			  client  = binrpc.createClient({ host: interfc.host, port: interfc.port, path: interfc.path});
	   } else {
			  client  = xmlrpc.createClient({ host: interfc.host, port: interfc.port, path: interfc.path});
	   }


	   
	   console.log("send %s with %s to %s:%s",command,JSON.stringify(attributes),interfc.host,interfc.port);			

	   
	   client.methodCall(command,attributes , function (error, value) {
	   	if (callback) {
		   	callback(error,value);
	   	}
	   });
	}
	
	sendRegaCommand(script,call_timeout,callback) {
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
	 	   	callback(tx,vars,null);
	 	   });

		}).on('error', function(e) {
	      console.error(e);
	      callback(null,null,e);
		});

		request.on('socket', function (socket) {
			socket.setTimeout(call_timeout * 1000); 
			socket.on('timeout', function() {
				request.abort();
    		});
		});


		request.write(script);
		request.end();
	}
	
	
	getIPAddress() {
    	var interfaces = require('os').networkInterfaces();
		for (var devName in interfaces) {
		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {
      	  var alias = iface[i];
	  	  if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
          return alias.address
		}
    	}
        return '0.0.0.0'
    }
	
	killRPCServer(interfc,callback) {
	
		var myUrl = null;
		var that = this;
		if (interfc.url.startsWith('xmlrpc_bin')) {
			myUrl = "xmlrpc_bin://" + this.localIP + ':' + this.listeningPort;
		} else {
			myUrl = "http://" + this.localIP + ':' + this.listeningPort;
		}
		
		this.sendInterfaceCommand(interfc,'init',[myUrl],function(error,result){
			console.log('Result %s,Error %s',result,error);
			that.server.server.close();
			console.log("Close Server");
			callback(result,error);
		});
		
	}
	
	
	initRPCServer(interfc,callback) {
		var rpc = null;
		var that = this;
		var myUrl = null;
		
		if ((this.server) && (this.server.server)) {
			console.log('Closing Server');
			this.server.server.close();
		}
		
		if (interfc.url.startsWith('xmlrpc_bin')) {
			this.server = binrpc.createServer({
				host: that.localIP,
				port: that.listeningPort
         	});
         	myUrl = "xmlrpc_bin://" + that.localIP + ':' + that.listeningPort;
         	
		} else {
			this.server = xmlrpc.createServer({
				host: that.localIP,
				port: that.listeningPort
         	});
         	myUrl = "http://" + that.localIP + ':' + that.listeningPort;
		}
		
		
		
		this.server.on("NotFound", function(method, params) {
			console.log("Method %s does not exist. - %s",method, JSON.stringify(params));
     	});

	 	this.server.on("system.listMethods", function(err, params, callback) {
	 		callback(null, ["event","system.listMethods", "system.multicall"]);
    	});
    
		this.server.on("listDevices", function(err, params, callback) {
			callback(null,[]);
		});


		this.server.on("newDevices", function(err, params, callback) {
			callback(null,[]);
    	});


		this.server.on("event", function(err, params, callback) {
			ipc.send('xml_event',params);
			callback(null,[]);
		});
    
		this.server.on("system.multicall", function(err, params, callback) {
			params.map(function(events) {
			try {
			events.map(function(event) {
            	if ((event["methodName"] == "event") && (event["params"] !== undefined)) {
	            	ipc.send('xml_event',event["params"]);
				}
			});
			} catch (e) {
				console.log(e);
			}
			});
		});
		
		this.server.on("error", function(err, params, callback) {
		  console.log("EVError %s",err);
		  if ((that.server) && (that.server.server)) {
			  that.server.server.close();
		  }
		});
		
		this.sendInterfaceCommand(interfc,'init',[myUrl, "homematic_explorer"],function(error,result){
			console.log('Result %s,Error %s',result,error);
			if (error) {
				if ((that.server) && (that.server.server)) {
					console.log('Closing Server');
					that.server.server.close();
		  		}	
			}
		});
		callback();
	}
}

module.exports = CCUCommunication;

}());
//# sourceMappingURL=ccu_communication.js.map