(function () {'use strict';

var brightwheel = require('brightwheel');

const ipc = require('electron').ipcRenderer;

class WorkspacePane {
	
	constructor(contentname) {
	   this.contentname = contentname;
	}
	
	
	render(rootElement) {
		switch (this.contentname) {
			
			case 'device':
			  this.renderDeviceContentPane(rootElement);
			  break
			
			case 'interface':
			  this.renderInterfaceContentPane(rootElement);
			  break

			case 'script':
			  this.renderScriptContentPane(rootElement);
			  break

			case 'rssi':
			  this.renderRssiContentPane(rootElement);
			  break
			  
			case 'variables':
			  this.renderVariableContentPane(rootElement);
			  break;  
		}
		
		this.clearElement("#element_properties");
		document.querySelector("#properties_label").innerHTML = "";
	}
	
	
	renderScriptContentPane(rootElement) {	
		let panes = [];
		let scriptFormItems = [];

		
		scriptFormItems.push(new brightwheel.Pane({attributes: {id: 'pane_script', style:'width:100%;height:30%'},
			  sidebar: false,
			  classNames:['editor_main']
		},[
			
			new brightwheel.FormGroup({attributes: {id: 'group-dev1',style:'width:100%;height:100%'},classNames: ['pull-left']}, [
				new brightwheel.Label({attributes: {id: 'label-1', style:'width:100%;'},classNames: ['my-class'],text: 'Script'}, []),
				new brightwheel.Textarea({attributes: {id: 'script_text', style:'width:100%;height:90%'},classNames: ['my-class'],
					placeholder: 'WriteLine("Hello World");',text: 'WriteLine("Hello World");'
				}, [])
			]) 
/*
			new FormGroup({attributes: {id: 'group-dev1',style:'width:10%;height:100%'},classNames: ['pull-left']}, [
				new Label({attributes: {id: 'label-2', style:'width:100%;'},classNames: ['my-class'],text: 'Geraete'}, []),
				new NavGroup({attributes: {id: 'script_tree'}}, [])
			])
*/
		]));
		
		scriptFormItems.push(new brightwheel.Button({attributes: {id: 'checkButton',style:'float: left;'},classNames: ['active'], icon: 'check',
			size: 'large',  
			text: 'Syntax Check',  type: 'default'}, [])
		);
		
		scriptFormItems.push(new brightwheel.Button({attributes: {id: 'sendButton',style:'float: right;'},classNames: ['active'], icon: 'paper-plane',
			size: 'large',  
			text: 'Ausfuehren',  type: 'default'}, [])
		);


		scriptFormItems.push(new brightwheel.Label({attributes: {id: 'label-2', style:'width:100%'},classNames: ['my-class'],
			text: 'Ausgabe'
		}, []));

		
		scriptFormItems.push(new brightwheel.Textarea({attributes: {id: 'script-response', style:'width:100%;height:30%'},classNames: ['my-class'],
			placeholder: '',
			text: ''
		}, []));
		
		
		scriptFormItems.push(new brightwheel.Label({attributes: {id: 'label-2', style:'width:100%'},classNames: ['my-class'],
			text: 'Variablen'
		}, []));
		
		scriptFormItems.push(new brightwheel.Table({attributes: {id: 'table-var'},classNames: ['my-class'],striped: true},[
			{'Variable':'','Wert':''}]));

		
		
		
		panes.push(new brightwheel.Pane({attributes: {id: 'pane_ccu_script', style:'width:100%;height:100%'},
			  sidebar: false,
			  classNames:['editor_main']
		},
			[new brightwheel.FormGroup({attributes: {id: 'group-script',style:'width:100%;height:100%'},classNames: ['pull-left']}, scriptFormItems)]
		));

		

		let root = this.clearElement(rootElement);
		panes.map(function(pane){
			root.appendChild(pane.element);
		});
		
		
		root.addEventListener('click', function(event){
			var script = "";
			if (event.target.id == 'sendButton') {
			    script = document.querySelector("#script_text").value;
				ipc.send('run_script', script);
			}
			
			if (event.target.id == 'checkButton') {
			    script = document.querySelector("#script_text").value;
				ipc.send('test_script', script);
			}
			
		});
		
		
		
	}
	
	

	renderRssiContentPane(rootElement) {	
		let panes = [];
		panes.push(new brightwheel.Pane({attributes: {id: 'pane_ccu_rssi'},
			  sidebar: false
		}, [new brightwheel.NavGroup({attributes: {id: 'ccu_rssi'}}, [])]));

		let root = this.clearElement(rootElement);
		panes.map(function(pane){
			root.appendChild(pane.element);
		});
	}
	
	renderVariableContentPane(rootElement) {	
		let panes = [];
		panes.push(new brightwheel.Pane({attributes: {id: 'pane_ccu_variables'},
			  sidebar: false
		}, [new brightwheel.NavGroup({attributes: {id: 'ccu_variables'}}, [])]));

		let root = this.clearElement(rootElement);
		panes.map(function(pane){
			root.appendChild(pane.element);
		});
	}


	renderInterfaceContentPane(rootElement) {	
		let panes = [];
		panes.push(new brightwheel.Pane({attributes: {id: 'pane_ccu_interface_tree'},
			  sidebar: false
		}, [new brightwheel.NavGroup({attributes: {id: 'ccu_interface_tree'}}, [])]));

		let root = this.clearElement(rootElement);
		panes.map(function(pane){
			root.appendChild(pane.element);
		});
	}

	
	renderDeviceContentPane(rootElement) {	
		let panes = [];
		panes.push(new brightwheel.Pane({attributes: {id: 'pane_ccu_device_tree'},
			  sidebar: false
		}, [new brightwheel.NavGroup({attributes: {id: 'ccu_device_tree'}}, [])]));

		panes.push(new brightwheel.Pane({attributes: {id: 'pane_device_channel_tree'},
			  sidebar: false
		}, [new brightwheel.NavGroup({attributes: {id: 'device_channel_tree'}}, [])]));

		panes.push(new brightwheel.Pane({attributes: {id: 'pane_device_channel_dp_tree'},
			  sidebar: false
		}, [new brightwheel.NavGroup({attributes: {id: 'device_channel_dp_tree'}}, [])]));

		let root = this.clearElement(rootElement);
		panes.map(function(pane){
			root.appendChild(pane.element);
		});
	}
	
	
	clearElement(elementName) {
	 var myNode = document.querySelector(elementName);
	   let array = Array.from(myNode.childNodes);
	   array.map(function (node) {
	   	if (node.id != 'sidebar') {
		   	myNode.removeChild(node);
	   	}
	   });
	 return myNode  
   }

}

module.exports = WorkspacePane;

}());
//# sourceMappingURL=workspace_pane.js.map