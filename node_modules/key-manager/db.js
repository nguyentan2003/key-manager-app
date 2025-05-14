const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://localhost:27017/manager-key-db";

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Thoát với mã lỗi 1 nếu không kết nối được MongoDB
    });

const KeySchema = new mongoose.Schema({
    id: String,
    key: String,
});

const KeyModel = mongoose.model("key", KeySchema);

module.exports = { KeyModel, initializeDefaultKey };

async function initializeDefaultKey() {
    try {
        const keyDoc = await KeyModel.findOne({ id: "keyField" });
        if (!keyDoc) {
            const aesKey = CryptoJS.lib.WordArray.random(16).toString();
            const defaultKey = new KeyModel({
                id: "keyField",
                key: aesKey,
            });
            await defaultKey.save();
            console.log("Default AES key generated and saved:", aesKey);
        }
    } catch (err) {
        console.error("Error initializing default key:", err);
    }
}
