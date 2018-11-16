const express = require('express');
const router = express.Router();

const controllers = require('./controllers');

router.get('/lists', controllers.getAllChecklists);

module.exports = router;
