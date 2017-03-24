function SmartFilter(config) {
	var self = this;

	this.currentState = "enterValue";
	this.lastState = null;

	this.fields = config.fields;

	this.debug = false

	if (typeof(config.debug) != "undefined") { 
		this.debug = config.debug;
	}

	SmartFilter.prototype.updateHelp = function(text) {
		self.description.innerHTML = text + self.debugText();

		if (text == "-") {
			self.description.classList.add('inputUnfocus')
			self.description.classList.remove('inputFocus')
		} else {
			self.description.classList.add('inputFocus')
			self.description.classList.remove('inputUnfocus')
		}
	}

	SmartFilter.prototype.debugText = function() {
		if (self.debug) {
			return "<br /><br />Current:" + self.currentState + "<br />Last:" + self.lastState + "<br /><br /><pre>" +  JSON.stringify(self.getTokens(), null, 2) + "</pre>"
		} else {
			return "";
		}
	}

	SmartFilter.prototype.getSearchText = function() {
		return self.input.value;
	}

	SmartFilter.prototype.getLastChar = function() {
		return self.getSearchText().charAt(self.getSearchText().length - 1)
	}

	SmartFilter.prototype.searchUpdate = function() {
		self.stateChanged();

/**
	$.getJSON('test.php?listFilters=' + getSearchText(), function(ret) {
		console.log("ret", ret);
		updateBar(ret)	;
	});
*/

	}

	SmartFilter.prototype.getSearchKeyword = function() {
		txt = self.getSearchText().match(/\w+$/)

		if (txt == null) {
			return "";
		} else {
			return txt[0];
		}
	}

	SmartFilter.prototype.endsWithJoin = function() {
		searchText = self.getSearchText().toUpperCase();

		if (searchText.endsWith(" AND ")) {
			return true;
		}

		return false;
	}

	SmartFilter.prototype.stateChanged = function(e) {
		if (self.debug) {
			console.log("SmartFilter State Change", e);
		}

		if (self.getSearchText() == "" || (self.lastState == "enterJoin" && self.endsWithJoin())) {
			self.currentState = "enterField"
		} else if (self.lastState == "enterOperator" && self.getLastChar() == " ") {
			self.currentState = "enterValue"
		} else if (self.lastState == "enterField" && self.getLastChar() == " ") {
			self.currentState = "enterOperator"
		} else if (self.getLastChar() == " " && self.lastState == "enterValue") {
			self.currentState = "enterJoin"
		}

		if (self.isOperator(self.getLastChar())) {
			self.currentState = "enterOperator"
		}

		if (document.activeElement != self.input) {
			self.currentState = "unfocus"
		} else {
			self.currentSate = "enterValue"
		}

		// ---

		self.updateHelp("-");
		if (self.currentState == "enterField") {
			fields = self.fields;

			var txt = "Choose Field: ";
			keyword = self.getSearchKeyword();
			fields = self.fields

			var numMatches = 0

			for (i = 0; i < fields.length; i++) {
				item = fields[i];

				if (item.toLowerCase().startsWith(self.getSearchKeyword().toLowerCase())) {
					numMatches++;
					txt += '<span class = "smartFilterKeyword">' + item + '</span> '
				} else {
					txt += item + " "
				}
			}

			if (keyword != "" && numMatches == 0) {
				self.updateHelp('No keywords match: ' + self.getSearchKeyword());
			} else {
				self.updateHelp(txt);
			}
		} else if (self.currentState == "enterOperator") {
			self.updateHelp("operator: =, !")
		} else if (self.currentState == "unfocus") {
			self.updateHelp("-")
		} else if (self.currentState == "enterValue") {
			self.updateHelp("enter value")
		} else if (self.currentState == "enterJoin") {
			self.updateHelp("enter join: ...AND...")
		}

		self.lastState = self.currentState;
	}

	SmartFilter.prototype.getTokens = function() {
		txtParts = self.getSearchText().split(" ");
		tokens = [];

		txtParts.forEach(function(v, i) {
			type = "value"

			if (v == "") {
				return;
			} else if (self.isField(v)) {
				type = "field"
			} else if (self.isOperator(v)) {
				type = "operator"
			}

			tokens.push({
				"type": type,
				"value": v
			});
		});

		return tokens;
	}

	SmartFilter.prototype.isField = function(v) {
		if (self.fields.indexOf(v) == -1) {
			return false;
		} else {
			return true;
		}
	}

	SmartFilter.prototype.isOperator = function(c) {
		if (c == "=" || c == "!") {
			return true;
		} else {
			return false;
		}
	}

	this.input = document.querySelector(config.input)
	this.input.classList.add('smartFilterInput')
	this.input.onkeyup = this.stateChanged;
	this.input.onfocus = this.stateChanged;
	this.input.onblur = this.stateChanged;

	this.lastState = "enterField"

	this.description = document.createElement("div")
	this.description.val = "-";
	this.description.classList.add("smartFilterDescription");
	this.description.classList.add('inputUnfocus')

	this.input.parentElement.append(this.description);

	return this;
}

