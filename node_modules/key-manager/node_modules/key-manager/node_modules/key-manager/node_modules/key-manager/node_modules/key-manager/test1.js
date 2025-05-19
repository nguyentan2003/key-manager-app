const express = require("express");
const axios = require("axios");
const FormData = require("form-data"); // npm install form-data

const app = express();
const port = 3000;

const PINATA_API_KEY = "67540a413f3ba243ea0d";
const PINATA_SECRET_API_KEY =
    "7c567abfa75350c6acdedcc700e53c47d8c5e562b2c67fa9fe7b6ff33cd63538";

app.use(express.json());

// Upload text content lên IPFS thông qua Pinata
app.post("/upload", async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required." });
        }

        const formData = new FormData();

        // Gửi content dưới dạng file (dùng Buffer và đặt tên cho file)
        formData.append("file", Buffer.from(content), {
            filename: "textfile.txt", // Tên file giả lập
            contentType: "text/plain",
        });

        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                headers: {
                    ...formData.getHeaders(),
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_API_KEY,
                },
            }
        );

        const { IpfsHash } = response.data;

        res.json({
            message: "Data uploaded to IPFS via Pinata successfully!",
            cid: IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
        });
    } catch (error) {
        console.error(
            "Error uploading to Pinata:",
            error.response && error.response.data
                ? error.response.data
                : error.message
        );
        res.status(500).json({ error: "Failed to upload to Pinata." });
    }
});

// Lấy dữ liệu từ IPFS
app.get("/get/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const response = await axios.get(
            `https://gateway.pinata.cloud/ipfs/${cid}`
        );

        res.json({
            cid,
            content: response.data,
        });
    } catch (error) {
        console.error(
            "Error fetching from IPFS via Pinata:",
            error.response && error.response.data
                ? error.response.data
                : error.message
        );
        res.status(500).json({ error: "Failed to fetch from IPFS." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
