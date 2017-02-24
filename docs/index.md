<style>
table {
	width: 100%;
}

.smartFilterInput {
	width: 100%;
}

.smartFilterKeyword {
	font-weight: bold;
}

div.smartFilterDescription {
	background-color: lightgray;
	padding: 1em;
}

.inputUnfocus {
	display: none;
}

.inputFocus {
	position: absolute;
	display: block;
	width: 100%;
}

</style>

# Overview 

**SmartFilter** is a jQuery plugin to build powerful key-value search expressions.

It provides auto-complete (for fields, operators and values), and converts text 
into a JSON model that can be sent to a server and processed (eg, search).

<div>

<p>Try it below!: </p>

<input id = "exampleSearch" />
<div class = "smartFilterDescription">-</div>
</div>

<script
  src="https://code.jquery.com/jquery-3.1.1.js"
    integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA="
	  crossorigin="anonymous"></script>

<script type = "text/javascript" src = "https://cdn.rawgit.com/jamesread/smartfilter/79d3f4326a5812e7648692fe118942f02926e804/js/smartfilter.js"></script>

<script type = "text/javascript">

window.sf = new SmartFilter({
	input: '#exampleSearch',
	fields: ['Name', 'Age', 'Gender']
}); 

</script>

<br /><br /><br />

# Screenshots

![smart filter screenshot](images/screenshot1.png "smart filter screenshot")


# Setup
	
Some HTML like this; 

	<div> 
		<input id = "search" />

		<p class = "smartFilterDescription">Type to get started.</p>
	</div>

Then some Javascript;

	<script type = "text/javascript">
		sf = new SmartFilter({	
			input: '#search',
			fields: ['Name', 'Age', 'Gender'],
			debug: true
		});
	</script>

Obviously you need to include the ``smartfilter.js`` file somewhere on the page too.


# Config

| Config field | Description                                                   |
|--------------|---------------------------------------------------------------|
| ``input``    | The search field to attach to and setup. Required.            |
| ``debug``    | Print debug information in the dropdown.

# CSS

| CSS Rule     | Description                                                   |
|--------------|---------------------------------------------------------------|
| ``.smartFilterDescription``    | The description box                         |


