function updateBar(ret) {
	console.log(ret);
}

function updateHelp(text) {
	$('.help').html(text + "<br /><br />" + debugText());
}

function debugText() {
	return "Current:" + window.currentState + "<br />Last:" + window.lastState + "<br /><br />" +  JSON.stringify(getTokens());
}

function getSearchText() {
	return document.getElementById("search").value;
}

function getLastChar() {
	return getSearchText().charAt(getSearchText().length - 1)
}

function searchUpdate() {
	stateChanged();

/**
	$.getJSON('test.php?listFilters=' + getSearchText(), function(ret) {
		console.log("ret", ret);
		updateBar(ret)	;
	});
*/
}

function availableFields() {
	return ["Name", "Age", "Gender"];
}

function getSearchKeyword() {
	txt = getSearchText().match(/\w+$/)

	if (txt == null) {
		return "";
	} else {
		return txt[0];
	}
}

function isOperator(c) {
	if (c == "=" || c == "!") {
		return true;
	} else {
		return false;
	}
}

function endsWithJoin() {
	searchText = getSearchText().toUpperCase();

	if (searchText.endsWith(" AND ")) {
		return true;
	}

	return false;
}

function stateChanged() {
	if (getSearchText() == "" || (window.lastState == "enterJoin" && endsWithJoin())) {
		window.currentState = "enterField"
	} else if (window.lastState == "enterOperator" && getLastChar() == " ") {
		window.currentState = "enterValue"
	} else if (window.lastState == "enterField" && getLastChar() == " ") {
		window.currentState = "enterOperator"
	} else if (getLastChar() == " " && window.lastState == "enterValue") {
		window.currentState = "enterJoin"
	}

	if (isOperator(getLastChar())) {
		window.currentState = "enterOperator"
	}

	if (document.activeElement != $('#search')[0]) {
		window.currentState = "unfocus"
	} else {
		window.currentSate = "enterValue"
	}

	// ---

	updateHelp("-");
	if (window.currentState == "enterField") {
		fields = availableFields();

		var txt = "Choose Field: ";
		keyword = getSearchKeyword();
		fields = availableFields()

		var numMatches = 0

		for (i = 0; i < fields.length; i++) {
			item = fields[i];

			if (item.toLowerCase().startsWith(getSearchKeyword().toLowerCase())) {
				numMatches++;
				txt += '<span class = "smartFilterKeyword">' + item + '</span> '
			} else {
				txt += item + " "
			}
		}

		if (keyword != "" && numMatches == 0) {
			updateHelp('No keywords match: ' + getSearchKeyword());
		} else {
			updateHelp(txt);
		}
	} else if (window.currentState == "enterOperator") {
		updateHelp("operator: =, !")
	} else if (window.currentState == "unfocus") {
		updateHelp("-")
	} else if (window.currentState == "enterValue") {
		updateHelp("enter value")
	}

	window.lastState = window.currentState;
}

function isField(v) {
	if (availableFields().indexOf(v) == -1) {
		return false;
	} else {
		return true;
	}
}

function getTokens() {
	txtParts = getSearchText().split(" ");
	tokens = [];

	txtParts.forEach(function(v, i) {
		type = "value"

		if (v == "") {
			return;
		} else if (isField(v)) {
			type = "field"
		} else if (isOperator(v)) {
			type = "operator"
		}

		tokens.push({
			"type": type,
			"value": v
		});
	});

	return tokens;
}

function setupSmartfilter(config) {
	config.input.val("")
	config.input.addClass("smartFilterInput")

	window.lastState = "enterField"
}
