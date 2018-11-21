const ChecklistModel = require('./model');
const {checklistExists, checklistItemExists} = require('./existFunctions');
const constants = require('../../constants');
const getResponse = require('../../helpers/getResponseObject');

class ChecklistItem {
	constructor(checklistName = '', filter = '') {
		this._checklistName = checklistName;
		this._filter = filter;
	}

	async getAll() {
		const findChecklistQuery = ChecklistModel.findOne({name: this._checklistName});

		try {
			const {data: exists} = await checklistExists(this._checklistName);

			if (exists) {
				const {items} = await findChecklistQuery.exec();

				const itemsWithoutIds = this._removeIdsFromItems(items);

				return getResponse(false, itemsWithoutIds);
			}
			else {
				throw constants.ERROR_NOT_EXISTS;
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
				throw constants.ERROR_NOT_EXISTS;
			}
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async check(checked = true) {
		const updateQuery = ChecklistModel.findOneAndUpdate(
			{
				name: this._checklistName,
				'items._id': {$in: this._filter}
			},
			{
				$set: {'items.$.checked': checked}
			}
		);

		try {
			const {data: exists} = await this.exists();

			if (exists) {
				updateQuery.exec();

				return getResponse(false, checked);
			}
			else {
				throw constants.ERROR_NOT_EXISTS;
			}
		}
		catch (error) {
			return getResponse(true, error);
		}
	}

	async exists() {
		return await checklistItemExists(this._checklistName, this._filter);
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

module.exports = ChecklistItem;