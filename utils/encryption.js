const crypto = require('crypto');

const SECRET_KEY = 'foobar_secret_key'

function encrypt(value) {
    const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
    let encryptedPassword = cipher.update(value, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');
    return encryptedPassword;
}

function decrypt(encryptedValue) {
    const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY);
    let decryptedPassword = decipher.update(encryptedValue, 'hex', 'utf-8');
    decryptedPassword += decipher.final('utf-8');
    return decryptedPassword;
}

module.exports = {
    encrypt,
    decrypt
}