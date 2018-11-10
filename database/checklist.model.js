const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema({
	name: String,
	items: [
		{
			name: String,
			checked: {type: Boolean, default: false}
		}
	],
	date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Checklist', ChecklistSchema);