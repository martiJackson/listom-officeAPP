function Map() {
	this.keys = [];
	this.values = [];

	//将一个键值对放入map中
	this.put = function(key, value) {
		if(!this.containKey(key)) {
			this.keys.push(key);
			this.values.push(value);
		}else {
			for (var i = 0; i < this.keys.length; i++) {
				if(this.keys[i] == key) {
					this.values[i] = value;
				}
			}
		}
	}

	//根据key删除一个键值对
	this.remove = function(key) {
		for (var i = 0; i < this.keys.length; i++) {
			if(this.keys[i] == key) {
				this.keys.splice(i, 1);
				this.values.splice(i, 1);
			}
		}
	}

	//判断是否存在key
	this.containKey = function(key) {
		for (var i = 0; i < this.keys.length; i++) {
			if(this.keys[i] == key) {
				return true;
			}
		}
		return false;
	}

	//根据key获取对应的value
	this.get = function(key) {
		for (var i = 0; i < this.keys.length; i++) {
			if(this.keys[i] == key) {
				return this.values[i];
			}
		}
		return null;
	}

	//获取map的大小
	this.size = function() {
		return this.keys.length;
	}
}