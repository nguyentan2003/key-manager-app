// utils/cryptoUtils.js
const CryptoJS = require("crypto-js");

// Hàm mã hóa dữ liệu
const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(data, key).toString();
};

// Hàm giải mã dữ liệu
const decryptData = (encryptedData, key) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptData, decryptData };
