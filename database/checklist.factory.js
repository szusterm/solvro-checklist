const ChecklistModel = require('./checklist.model');
const getResponse = require('../helpers/getResponseObject');

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

	_getChecklistsNames(checklists = []) {
		const checklistsNames = [];

		for (const {name} of checklists) {
			checklistsNames.push(name);
		}

		return checklistsNames;
	}
}

class ChecklistItem {
	constructor(checklistName = '', filter = '') {
		this._checklistName = checklistName;
		this._filter = filter;
	}

	async create() {
		const newItem = {name: this._filter};

		const pushItemQuery = ChecklistModel.findOneAndUpdate(
			{name: this._checklistName},
			{$push: {items: newItem}}
		);

		try {
			const response = await pushItemQuery.exec();

			return getResponse(false, response);
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async delete() {
		const itemToDelete = {_id: this._filter};

		const pushItemQuery = ChecklistModel.findOneAndUpdate(
			{name: this._checklistName},
			{$pull: {items: itemToDelete}}
		);

		try {
			const response = await pushItemQuery.exec();

			return getResponse(false, response);
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	check() {

	}
}

module.exports = (name) => new Checklist(name);