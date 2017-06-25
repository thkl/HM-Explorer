(function () {'use strict';

var brightwheel = require('brightwheel');

class DevicePane {
	
	render(rootElement) {
		
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

module.exports = DevicePane;

}());
//# sourceMappingURL=device_pane.js.map