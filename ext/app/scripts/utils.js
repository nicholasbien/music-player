(function(window, document) {

	$ = function(selector) {
		if (selector[0] === '#') {
			return document.getElementById(selector.substring(1));
		} else if (selector[0] === '.') {
			return document.getElementsByClassName(selector.substring(1));
		}
		return null;
	}

	hide = function(id) {
		var element = document.getElementById(id);
		element.style.display = 'none';
	}

	show = function(id) {
		var element = document.getElementById(id);
		element.style.display = 'inline';
	}

	showClass = function(className) {
		var elements = document.getElementsByClassName(className);
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'inline';
		}
	}

	hideClass = function(className) {
		var elements = document.getElementsByClassName(className);
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
	}

	create = function(tag) {
		return document.createElement(tag);
	}

})(this, this.document);