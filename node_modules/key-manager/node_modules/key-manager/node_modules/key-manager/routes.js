const express = require("express");
const { encryptKey, decryptKey } = require("./crypto");
const { KeyModel } = require("./db");

const router = express.Router();

router.get("/getAESKey", async (req, res) => {
    try {
        const key = await KeyModel.findOne({ id: "keyField" });
        if (key) {
            res.json({
                status: 200,
                message: "AES key found",
                result: { key: key.key },
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "AES key not found",
                result: null,
            });
        }
    } catch (err) {
        console.error("Error fetching AES key from MongoDB:", err);
        res.status(500).json({
            status: 500,
            message: "Error fetching AES key from MongoDB",
            result: null,
        });
    }
});

router.post("/encryptKey", async (req, res) => {
    const { key128bit } = req.body;
    if (!key128bit) {
        return res.status(400).json({
            status: 400,
            message: "Missing 128 bit key",
            result: null,
        });
    }

    try {
        const encryptedKey = await encryptKey(key128bit);
        res.json({
            status: 200,
            message: "Key encrypted successfully",
            result: { encryptedKey },
        });
    } catch (err) {
        console.error("Error encrypting key:", err);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            result: null,
        });
    }
});

router.post("/decryptKey", async (req, res) => {
    const { encryptedKey } = req.body;
    if (!encryptedKey) {
        return res.status(400).json({
            status: 400,
            message: "Missing encrypted key",
            result: null,
        });
    }

    try {
        const decryptedKey = await decryptKey(encryptedKey);
        res.json({
            status: 200,
            message: "Key decrypted successfully",
            result: { decryptedKey },
        });
    } catch (err) {
        console.error("Error decrypting key:", err);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            result: null,
        });
    }
});

module.exports = router;
