
//log全局开关
	var logOn = false;

	var Log = { 
		e: function(msg) { // error
			if(logOn) {
				console.log('%c%s', 'color: #FF0000', msg);	
			}
		},
		i: function(msg) { // info
			if(logOn) {
				console.log(msg);	
			}
		},
		d: function(msg) { // debug
			if(logOn) {
				console.log('%c%s', 'color: #6699FF', msg);	
			}
		}
	}

