if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes/routes');
require('./database/connect')();

const app = express();


app.use(logger('dev'));
app.use(express.json({strict: false}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', routes);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
