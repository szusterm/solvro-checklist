const express = require('express');
const router = express.Router();

const controllers = require('./controllers');

router.route('/lists')
	.get(controllers.getAllChecklists)
	.post(controllers.createChecklist);

router.route('/lists/:name')
	.delete(controllers.deleteChecklist);

module.exports = router;
