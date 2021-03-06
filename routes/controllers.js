const checklist = require('../database/checklist');
const constants = require('../constants');

exports.getAllChecklists = async (req, res) => {
	const {err, data} = await checklist().getAll();

	if (err) {
		res.status(500).end();
	}
	else {
		res.status(200).json(data);
	}
};

exports.createChecklist = async (req, res) => {
	const name = req.body;

	const {err, data} = await checklist(name).create();

	if (err) {
		if (data === constants.ERROR_EXISTS) {
			res.status(409).end();
		}
		else {
			res.status(500).end();
		}
	}
	else {
		res.status(201).end();
	}
};

exports.deleteChecklist = async (req, res) => {
	const {name} = req.params;

	const {err, data} = await checklist(name).delete();

	if (err) {
		if (data === constants.ERROR_NOT_EXISTS) {
			res.status(404).end();
		}
		else {
			res.status(500).end();
		}
	}
	else {
		res.status(200).end();
	}
};



exports.getAllItems = async (req, res) => {
	const {name: checklistName} = req.params;

	const {err, data} = await checklist(checklistName).item().getAll();

	if (err) {
		if (data === constants.ERROR_NOT_EXISTS) {
			res.status(404).end();
		}
		else {
			res.status(500).end();
		}
	}
	else {
		res.status(200).json(data);
	}
};

exports.createChecklistItem = async (req, res) => {
	const {name: checklistName} = req.params;
	const itemName = req.body;

	const {err, data} = await checklist(checklistName).item(itemName).create();

	if (err) {
		res.status(500).end();
	}
	else {
		res.status(201).json(data);
	}
};

exports.deleteChecklistItem = async (req, res) => {
	const {name: checklistName, id: itemId} = req.params;

	const {err, data} = await checklist(checklistName).item(itemId).delete();

	if (err) {
		if (data === constants.ERROR_NOT_EXISTS) {
			res.status(404).end();
		}
		else {
			res.status(500).end();
		}
	}
	else {
		res.status(200).end();
	}
};

exports.checkItem = async (req, res) => {
	const {name: checklistName, id: itemId} = req.params;
	const checked = req.body;

	const {err, data} = await checklist(checklistName).item(itemId).check(checked);

	if (err) {
		if (data === constants.ERROR_NOT_EXISTS) {
			res.status(404).end();
		}
		else {
			res.status(500).end();
		}
	}
	else {
		res.status(202).end();
	}
};