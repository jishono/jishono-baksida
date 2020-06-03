// config.js
const env = process.env.NODE_ENV; // 'dev' or 'prod'

const dev = {
    apiurl: 'http://localhost:3000'
};
const prod = {
    apiurl: 'https://api.jisho.no'
};

const config = {
    dev,
    prod
};

module.exports = config[env];