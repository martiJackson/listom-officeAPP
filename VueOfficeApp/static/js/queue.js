function Queue() {
	this.data = new Array();

	//元素入队
	this.enQueue = function(element) {
		this.data.unshift(element);
	}

	//元素出队
	this.deQueue = function() {
		if(this.isEmpty()) {
			return null;
		}
		return this.data.pop();
	}

	//队列是否为空
	this.isEmpty = function() {
		return this.data.length == 0;
	}

	//队列中的元素个数
	this.size = function() {
		return this.data.length;
	}

	this.clear = function() {
		this.data = new Array();
	}

	this.getFront = function() {
		if(this.size > 0) {
			return this.data[0];
		}
		return null;
	}
}