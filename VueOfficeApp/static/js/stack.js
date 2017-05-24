function Stack() {
	this.data = new Array();

	//元素入栈
	this.push = function(element) {
		this.data.push(element);
	}

	//栈顶元素出栈
	this.pop = function() {
		return this.data.pop();
	}

	//获取栈顶元素，不出栈
	this.top = function() {
		var len = this.data.length;
		return this.data[len - 1];
	}

	//栈是否为空
	this.isEmpty = function() {
		return this.data.length == 0;
	}

	//栈当前元素个数
	this.size = function() {
		return this.data.length;
	}
}