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

	async getAll() {
		const findChecklistQuery = ChecklistModel.findOne({name: this._checklistName});

		try {
			const checklistFactory = new Checklist(this._checklistName);
			const {data: checklistExists} = await checklistFactory.exists();

			if (checklistExists) {
				const {items} = await findChecklistQuery.exec();

				const itemsWithoutIds = this._removeIdsFromItems(items);

				return getResponse(false, itemsWithoutIds);
			}
			else {
				throw 'not exists';
			}
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async create() {
		const newItem = {name: this._filter};

		const pushItemQuery = ChecklistModel.findOneAndUpdate(
			{name: this._checklistName},
			{$push: {items: newItem}}
		);

		try {
			const response = await pushItemQuery.exec();

			const addedItemId = this._getLastItemId(response);

			return getResponse(false, addedItemId);
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async delete() {
		const itemToDelete = {_id: this._filter};

		const deleteItemQuery = ChecklistModel.findOneAndUpdate(
			{name: this._checklistName},
			{$pull: {items: itemToDelete}}
		);

		try {
			const {data: itemExists} = await this.exists();

			if (itemExists) {
				const response = await deleteItemQuery.exec();

				return getResponse(false, response);
			}
			else {
				throw 'not exists';
			}
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async check() {
		try {
			const {data: exists} = await this.exists();

			if (exists) {
				const {data: checked} = await this._isChecked();

				const updateQuery = ChecklistModel.findOneAndUpdate(
					{
						name: this._checklistName,
						'items._id': {$in: this._filter}
					},
					{
						$set: {'items.$.checked': !checked}
					}
				);

				updateQuery.exec();

				return getResponse(false, !checked);
			}
			else {
				throw 'not exists';
			}
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async exists() {
		const findQuery = ChecklistModel
			.findOne({
				name: this._checklistName
			});

		try {
			const {items} = await findQuery.exec();

			for (const {_id} of items) {
				if (_id == this._filter) {
					return getResponse(false, true);
				}
			}

			return getResponse(false, false);
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async _isChecked() {
		const findQuery = ChecklistModel
			.findOne({
				name: this._checklistName
			});

		try {
			const {data: itemExists} = await this.exists();
			if (itemExists) {
				const {items} = await findQuery.exec();

				for (const {_id, checked} of items) {
					if (_id == this._filter && checked) {
						return getResponse(false, true);
					}
				}

				return getResponse(false, false);
			}
			else {
				throw 'not exists';
			}
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	_getLastItemId(checklist = {}) {
		const {items} = checklist;
		const lastItemIndex = items.length - 1;

		return items[lastItemIndex]._id;
	}

	_removeIdsFromItems(items = []) {
		const itemsWithoutIds = [];

		for (const {name, checked} of items) {
			itemsWithoutIds.push({name, checked});
		}

		return itemsWithoutIds;
	}
}

module.exports = (name) => new Checklist(name);