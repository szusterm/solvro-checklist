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