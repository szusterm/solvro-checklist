const {DB_URL, DB_USER, DB_PASSWORD} = process.env;

module.exports = () => `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URL}`;