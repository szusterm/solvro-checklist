const ChecklistModel = require('./checklist.model');

class Checklist {
	constructor(name = '') {
		this._name = name;
	}

	async create() {
		const checklist = new ChecklistModel({name: this._name});

		try {
			const response = await checklist.save();

			return {
				err: false,
				data: response
			};
		}
		catch (error) {
			return {
				err: true,
				data: error
			};
		}
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