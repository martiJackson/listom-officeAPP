function LocalStorageUtils() {
	this.set = function(name, value, expireSecs) {
		if(window.localStorage) {
			var obj = {
				name: value,
				expires: new Date().getTime() + expireSecs * 1000
			};
			window.localStorage.setItem(name, JSON.stringify(obj));
		}
	}

	this.get = function(name) {
		if(window.localStorage) {
			var str = window.localStorage.getItem(name);
			if(str != null) {
				var obj = JSON.parse(str);
				var time = new Date().getTime();
				if(time > obj.expires) {
					window.localStorage.removeItem(name);
					return null;
				}
				return obj.name;
			}
		}
		return null;
	}

	this.remove = function(name) {
		if(window.localStorage) {
			window.localStorage.removeItem(name);	
		}
	}
}