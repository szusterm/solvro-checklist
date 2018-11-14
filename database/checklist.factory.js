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

	async exists() {
		const countQuery = ChecklistModel
			.where({name: this._name})
			.countDocuments();

		try {
			const checklistsCount = await countQuery.exec();

			return {
				err: false,
				data: (checklistsCount > 0)
			};
		}
		catch (error) {
			return {
				err: true,
				data: error
			};
		}
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

module.exports = (name) => new Checklist(name);