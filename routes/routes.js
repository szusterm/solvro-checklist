const express = require('express');
const router = express.Router();

const controllers = require('./controllers');

router.route('/lists')
	.get(controllers.getAllChecklists)
	.post(controllers.createChecklist);

router.route('/lists/:name')
	.delete(controllers.deleteChecklist);

router.route('/lists/:name/items')
	.get(controllers.getAllItems)
	.post(controllers.createChecklistItem);

router.route('/lists/:name/items/:id')
	.patch(controllers.checkItem)
	.delete(controllers.deleteChecklistItem);

module.exports = router;
