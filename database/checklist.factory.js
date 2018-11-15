const ChecklistModel = require('./checklist.model');
const getResponse = require('../helpers/getResponseObject');

class Checklist {
	constructor(name = '') {
		this._name = name;
	}

	item() {
		return new ChecklistItem();
	}

	async getAll() {
		const findAllChecklistsQuery = ChecklistModel.find();

		try {
			const response = await findAllChecklistsQuery.exec();

			return getResponse(false, response);
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async create() {
		const checklist = new ChecklistModel({name: this._name});

		try {
			const {data: checklistExists} = await this.exists();

			if (!checklistExists) {
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
	constructor(checklistName = '') {
		this._checklistName = checklistName;
	}

	create() {

	}

	check() {

	}

	delete() {

	}
}

module.exports = (name) => new Checklist(name);