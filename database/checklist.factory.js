const ChecklistModel = require('./checklist.model');
const getResponse = require('../helpers/getResponseObject');

class Checklist {
	constructor(name = '') {
		this._name = name;
	}

	async create() {
		const checklist = new ChecklistModel({name: this._name});

		try {
			const checklistExists = await this.exists();

			if (!checklistExists.data) {
				const response = await checklist.save();

				return getResponse(false, response);
			}

			throw 'exists';
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async delete() {
		const deleteChecklistQuery = ChecklistModel.deleteOne({name: this._name});

		try {
			const {data: checklistExists} = await this.exists();

			if (checklistExists) {
				const response = await deleteChecklistQuery.exec();

				return getResponse(false, response);
			}

			throw 'not exists';
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async exists() {
		const countQuery = ChecklistModel
			.where({name: this._name})
			.countDocuments();

		try {
			const checklistsCount = await countQuery.exec();
			const exists = (checklistsCount > 0);

			return getResponse(false, exists);
		}
		catch (error) {
			return getResponse(true, error);
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