import { NavGroup,NavGroupItem } from 'brightwheel'
const ipc = require('electron').ipcRenderer

class SidebarRenderer {
	
	render(rootElement) {
		
		var navElements = [];
		
		
		navElements.push(this.buildElement('interface',false,'flow-cascade','Interface'))
		navElements.push(this.buildElement('devices',false,'lamp','Geräte'))
		navElements.push(this.buildElement('variable',false,'bucket','Variablen'))
		navElements.push(this.buildElement('rssi',false,'rss','RSSI'))
		navElements.push(this.buildElement('dutycycle',false,'gauge','DutyCycle'))
		navElements.push(this.buildElement('events',false,'sound','Events'))
		navElements.push(this.buildElement('scripts',false,'doc-text','Scripteditor'))

		let myGroup = new NavGroup({
			attributes: {
				id: 'group-1'
  			},
  			
  			classNames: ['my-class'],
  			title: '  '
		}, navElements);
		
		let root = this.clearElement(rootElement)
		root.appendChild(myGroup.element)
		
		myGroup.element.addEventListener('click', function(event){
		   let id = event.target.id
		   let array = Array.from(myGroup.element.childNodes);
		   array.map(function(node){
				if (node.id == id) {
					node.classList.add('active')					
				} else {
   				    node.classList.remove('active')
				}		  
		   })
		   
		   ipc.send('sidebar-click', id)
		})

	}
	
	
	buildElement(id,active,icon,text) {
		let myItem = new NavGroupItem({active: active , attributes: {id: 'navItem-' + id},
			classNames: ['my-class'],
			icon: icon,
			text: text
		}, []);
		return myItem
	}
	
	clearElement(elementName) {
	 var myNode = document.querySelector(elementName);
	   while (myNode.firstChild) {
	   	myNode.removeChild(myNode.firstChild);
	 }
	 return myNode  
   }

}
		
module.exports = SidebarRenderer;