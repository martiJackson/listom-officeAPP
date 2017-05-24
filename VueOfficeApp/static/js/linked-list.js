function ListNode(val, next) {
	this.val = val;
	this.next = next;
}

function LinkedList() {
	this.head = null;
	this.length = 0;
	this.createList = function(arr) {
		if(arr != null && arr.length > 0) {
			this.length = arr.length;	
			this.head = new ListNode(arr[0], null);
			var p = this.head;
			for(var i = 1; i < arr.length; i++) {
				var node = new ListNode(arr[i], null);
				p.next = node;
				p = node;
			}
		}
	}
	this.showList = function() {
		var p = this.head;
		var str = '';
		while(p != null) {
			str += p.val + ' ';
			p = p.next;
		}
		console.log(str);
	}
	this.insert = function(index, val) {
		if(this.head == null) {
			this.head = new ListNode(val, null);
		} else if(index > this.length - 1) {
			var node = new ListNode(val, null);
			var p = this.head;
			while(p.next != null) p = p.next;
			p.next = node;
		} else if(index == 0) {
			var node = new ListNode(val, null);
			node.next = this.head;
			this.head = node;
		} else {
			var p = this.head;
			for(var i = 0; i < index - 1; i++) {
				p = p.next;
			}
			var next = p.next;
			var node = new ListNode(val, null);
			p.next = node;
			node.next = next;
		}
		++this.length;
	}
	this.toArray = function() {
		var arr = [];
		var p = this.head;
		while(p != null) {
			arr.push(p.val);
			p = p.next;
		}
		return arr;
	}
}