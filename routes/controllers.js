const checklist = require('../database/checklist.factory');

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
	const {name} = req.body;

	const {err, data} = await checklist(name).create();

	if (err) {
		if (data === 'exists') {
			res.status(409).end();
		}
		else {
			res.status(500).end();
		}
	}
	else {
		res.status(200).end();
	}
};

exports.deleteChecklist = async (req, res) => {
	const {name} = req.params;

	const {err, data} = await checklist(name).delete();

	if (err) {
		if (data === 'not exists') {
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


exports.createChecklistItem = async (req, res) => {
	const {name: checklistName} = req.params;
	const {name: itemName} = req.body;

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
		if (data === 'not exists') {
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