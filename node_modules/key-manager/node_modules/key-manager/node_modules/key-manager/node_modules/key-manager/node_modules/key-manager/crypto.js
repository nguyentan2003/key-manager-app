const CryptoJS = require("crypto-js");
const { KeyModel } = require("./db");
require("dotenv").config();

module.exports = { encryptKey, decryptKey };

// Đây là khóa dùng để mã hóa/giải mã khóa ứng dụng lưu trong DB
const getEncryptionKey = () => {
    const kek = process.env.KEY_ENCRYPTION_KEY;
    if (!kek) {
        throw new Error("KEY_ENCRYPTION_KEY not set in environment variables");
    }

    return kek;
};

async function encryptKey(key128bit) {
    const kekENV = getEncryptionKey();
    const keyDoc = await KeyModel.findOne({ id: "keyField" });
    if (!keyDoc) {
        throw new Error("AES key not found");
    }
    const aesKeyEncrypted = keyDoc.key;
    console.log(aesKeyEncrypted);

    const aesKey = CryptoJS.AES.decrypt(aesKeyEncrypted, kekENV).toString();
    // const aesKey = keyDoc.key;
    const encryptedKey = CryptoJS.AES.encrypt(key128bit, aesKey).toString();
    return encryptedKey;
}

async function decryptKey(encryptedKey) {
    const kekENV = getEncryptionKey();
    const keyDoc = await KeyModel.findOne({ id: "keyField" });
    if (!keyDoc) {
        throw new Error("AES key not found");
    }

    const aesKeyEncrypted = keyDoc.key;
    // const aesKey = keyDoc.key;
    const aesKey = CryptoJS.AES.decrypt(aesKeyEncrypted, kekENV).toString();

    const bytes = CryptoJS.AES.decrypt(encryptedKey, aesKey);
    const decryptedKey = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedKey;
}
