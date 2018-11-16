const checklist = require('../database/checklist.factory');

exports.getAllChecklists = async (req, res) => {
	const {err, data} = await checklist().getAll();

	if (err) {
		res.sendStatus(500);
	}
	else {
		res.status(200).json(data);
	}
};