
const env = process.env.NODE_ENV || 'development';

export = require('./config.' + env + '.json');