const ChecklistModel = require('./checklist.model');

class Checklist {
	constructor(listName) {
		this._listName = listName;
	}

	create() {

	}

	delete() {

	}

	exists() {

	}
}

class ChecklistItem {
	constructor(listName) {
		this._listName = listName;
	}

	create() {

	}

	check() {

	}

	delete() {

	}
}

module.exports = new Checklist();