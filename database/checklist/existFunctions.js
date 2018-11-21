const ChecklistModel = require('./model');
const getResponse = require('../../helpers/getResponseObject');

exports.checklistExists = async (name = '') => {
	const countQuery = ChecklistModel
		.where({name})
		.countDocuments();

	try {
		const checklistsCount = await countQuery.exec();
		const exists = (checklistsCount > 0);

		return getResponse(false, exists);
	}
	catch (error) {
		return getResponse(true, error);
	}
};

exports.checklistItemExists = async (checklistName = '', itemId = '') => {
	const findQuery = ChecklistModel
		.findOne({
			name: checklistName
		});

	try {
		const {items} = await findQuery.exec();

		for (const {_id} of items) {
			if (_id == itemId) {
				return getResponse(false, true);
			}
		}

		return getResponse(false, false);
	}
	catch (error) {
		return getResponse(true, error);
	}
};