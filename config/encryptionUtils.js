const CryptoJS = require('crypto-js');

function encrypt(text, key) {
  return CryptoJS.AES.encrypt(text, key).toString();
}

module.exports = { encrypt };
