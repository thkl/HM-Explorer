import { Pane,NavGroup,FormGroup,Label,Textarea,Table,Button } from 'brightwheel'
const ipc = require('electron').ipcRenderer

class WorkspacePane {
	
	constructor(contentname) {
	   this.contentname = contentname;
	}
	
	
	render(rootElement) {
		switch (this.contentname) {
			
			case 'device':
			  this.renderDeviceContentPane(rootElement)
			  break
			
			case 'interface':
			  this.renderInterfaceContentPane(rootElement)
			  break

			case 'script':
			  this.renderScriptContentPane(rootElement)
			  break

			case 'rssi':
			  this.renderRssiContentPane(rootElement)
			  break
			  
			case 'variables':
			  this.renderVariableContentPane(rootElement)
			  break;  

			case 'dutycycle':
			  this.renderDutyCycleContentPane(rootElement)
			  break;  
		}
		
		this.clearElement("#element_properties")
		document.querySelector("#properties_label").innerHTML = ""
	}
	
	
	renderScriptContentPane(rootElement) {	
		let panes = []
		let scriptFormItems = []

		
		scriptFormItems.push(new Pane({attributes: {id: 'pane_script', style:'width:100%;height:30%'},
			  sidebar: false,
			  classNames:['editor_main']
		},[
			
			new FormGroup({attributes: {id: 'group-dev1',style:'width:100%;height:100%;margin-left: -10px;margin-bottom:20px'},classNames: ['pull-left']}, [
				new Label({attributes: {id: 'label-1', style:'width:100%;'},classNames: ['my-class'],text: 'Script'}, []),
				new Textarea({attributes: {id: 'script_text', style:'width:100%;height:90%'},classNames: ['my-class'],
					placeholder: 'WriteLine("Hello World");',text: 'WriteLine("Hello World");'
				}, [])
			]) 
/*
			new FormGroup({attributes: {id: 'group-dev1',style:'width:10%;height:100%'},classNames: ['pull-left']}, [
				new Label({attributes: {id: 'label-2', style:'width:100%;'},classNames: ['my-class'],text: 'Geraete'}, []),
				new NavGroup({attributes: {id: 'script_tree'}}, [])
			])
*/
		]))
		
		scriptFormItems.push(new Button({attributes: {id: 'checkButton',style:'float: left;'},classNames: ['active'], icon: 'check',
			size: 'large',  
			text: 'Syntax Check',  type: 'default'}, [])
		)
		
		scriptFormItems.push(new Button({attributes: {id: 'sendButton',style:'float: right;'},classNames: ['active'], icon: 'paper-plane',
			size: 'large',  
			text: 'Ausfuehren',  type: 'default'}, [])
		)


		scriptFormItems.push(new Label({attributes: {id: 'label-2', style:'width:100%;margin-top:10px'},classNames: ['my-class'],
			text: 'Ausgabe'
		}, []))

		
		scriptFormItems.push(new Textarea({attributes: {id: 'script-response', style:'width:100%;height:20%'},classNames: ['my-class'],
			placeholder: '',
			text: ''
		}, []))
		
		
		scriptFormItems.push(new Label({attributes: {id: 'label-2', style:'width:100%'},classNames: ['my-class'],
			text: 'Variablen'
		}, []))
		
		scriptFormItems.push(new Table({attributes: {id: 'table-var'},classNames: ['my-class'],striped: true},[
			{'Variable':'','Wert':''}]))

		
		
		
		panes.push(new Pane({attributes: {id: 'pane_ccu_script', style:'width:100%;height:100%'},
			  sidebar: false,
			  classNames:['editor_main']
		},
			[new FormGroup({attributes: {id: 'group-script',style:'width:100%;height:100%'},classNames: ['pull-left']}, scriptFormItems)]
		))

		

		let root = this.clearElement(rootElement)
		panes.map(function(pane){
			root.appendChild(pane.element)
		})
		
		
		root.addEventListener('click', function(event){
			var script = ""
			if (event.target.id == 'sendButton') {
			    script = document.querySelector("#script_text").value
				ipc.send('run_script', script)
			}
			
			if (event.target.id == 'checkButton') {
			    script = document.querySelector("#script_text").value
				ipc.send('test_script', script)
			}
			
		})
	}
	
	

	renderRssiContentPane(rootElement) {	
		let panes = []
		panes.push(new Pane({attributes: {id: 'pane_ccu_rssi'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'ccu_rssi' },classNames : ['sticky-table-container']}, [])]))

		let root = this.clearElement(rootElement)
		panes.map(function(pane){
			root.appendChild(pane.element)
		})
	}
	
	
	renderVariableContentPane(rootElement) {	
		let panes = []
		panes.push(new Pane({attributes: {id: 'pane_ccu_variables'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'ccu_variables'},classNames : ['sticky-table-container']}, [])]))

		let root = this.clearElement(rootElement)
		panes.map(function(pane){
			root.appendChild(pane.element)
		})
	}

	
	renderDutyCycleContentPane(rootElement) {	
		let panes = []
		panes.push(new Pane({attributes: {id: 'pane_ccu_dutycycle'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'ccu_dutycycle'}}, [])]))

		let root = this.clearElement(rootElement)
		panes.map(function(pane){
			root.appendChild(pane.element)
		})
	}


	renderInterfaceContentPane(rootElement) {	
		let panes = []
		panes.push(new Pane({attributes: {id: 'pane_ccu_interface_tree'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'ccu_interface_tree'}}, [])]))

		let root = this.clearElement(rootElement)
		panes.map(function(pane){
			root.appendChild(pane.element)
		})
	}

	
	renderDeviceContentPane(rootElement) {	
		let panes = []
		panes.push(new Pane({attributes: {id: 'pane_ccu_device_tree'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'ccu_device_tree'}}, [])]))

		panes.push(new Pane({attributes: {id: 'pane_device_channel_tree'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'device_channel_tree'}}, [])]))

		panes.push(new Pane({attributes: {id: 'pane_device_channel_dp_tree'},
			  sidebar: false
		}, [new NavGroup({attributes: {id: 'device_channel_dp_tree'}}, [])]))

		let root = this.clearElement(rootElement)
		panes.map(function(pane){
			root.appendChild(pane.element)
		})
	}
	
	
	clearElement(elementName) {
	 var myNode = document.querySelector(elementName);
	   let array = Array.from(myNode.childNodes);
	   array.map(function (node) {
	   	if (node.id != 'sidebar') {
		   	myNode.removeChild(node);
	   	}
	   })
	 return myNode  
   }

}

module.exports = WorkspacePane;