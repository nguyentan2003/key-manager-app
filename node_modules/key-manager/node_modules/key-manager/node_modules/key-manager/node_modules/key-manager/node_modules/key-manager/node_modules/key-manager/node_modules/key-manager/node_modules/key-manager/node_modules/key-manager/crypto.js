const CryptoJS = require("crypto-js");
const { KeyModel } = require("./db");

module.exports = { encryptKey, decryptKey };

async function encryptKey(key128bit) {
    const keyDoc = await KeyModel.findOne({ id: "keyField" });
    if (!keyDoc) {
        throw new Error("AES key not found");
    }

    const aesKey = keyDoc.key;
    const encryptedKey = CryptoJS.AES.encrypt(key128bit, aesKey).toString();
    return encryptedKey;
}

async function decryptKey(encryptedKey) {
    const keyDoc = await KeyModel.findOne({ id: "keyField" });
    if (!keyDoc) {
        throw new Error("AES key not found");
    }

    const aesKey = keyDoc.key;
    const bytes = CryptoJS.AES.decrypt(encryptedKey, aesKey);
    const decryptedKey = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedKey;
}
