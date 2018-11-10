const mongoose = require('mongoose');

const connectionUrl = require('./getConnectionUrl')();

module.exports = () => {
	const {DB_URL} = process.env;

	mongoose.connect(connectionUrl, {useNewUrlParser: true});

	mongoose.connection.on('connected', () => console.log(`Mongoose connected to: ${DB_URL}`));

	mongoose.connection.on('error', (error) => console.log(`Mongoose connection error: ${error}`));

	mongoose.connection.on('disconnected', () => console.log('Mongoose connection has been disconnected'));

	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			console.log('Mongoose connection has been disconnected due to application termination');
			process.exit(0);
		});
	});
};