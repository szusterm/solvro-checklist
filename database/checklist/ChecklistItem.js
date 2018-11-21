const ChecklistModel = require('./model');
const Checklist = require('./Checklist');
const getResponse = require('../../helpers/getResponseObject');

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