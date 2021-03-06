const ChecklistModel = require('./model');
const ChecklistItem = require('./ChecklistItem');
const {checklistExists} = require('./existFunctions');
const constants = require('../../constants');
const getResponse = require('../../helpers/getResponseObject');

class Checklist {
	constructor(name = '') {
		this._name = name;
	}

	item(filter = '') {
		return new ChecklistItem(this._name, filter);
	}

	async getAll() {
		const findAllChecklistsQuery = ChecklistModel.find();

		try {
			const response = await findAllChecklistsQuery.exec();

			const checklistsNames = this._getChecklistsNames(response);

			return getResponse(false, checklistsNames);
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

			throw constants.ERROR_EXISTS;
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

			throw constants.ERROR_NOT_EXISTS;
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async exists() {
		return await checklistExists(this._name);
	}

	_getChecklistsNames(checklists = []) {
		const checklistsNames = [];

		for (const {name} of checklists) {
			checklistsNames.push(name);
		}

		return checklistsNames;
	}
}

module.exports = Checklist;