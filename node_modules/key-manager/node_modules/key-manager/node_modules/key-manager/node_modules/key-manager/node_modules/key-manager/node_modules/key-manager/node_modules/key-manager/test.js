require("dotenv").config();
const express = require("express");
const pinataSDK = require("@pinata/sdk");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;
console.log("✅ Bắt đầu load server.js...");
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Pinata
// const pinata = pinataSDK(
//     process.env.PINATA_API_KEY,
//     process.env.PINATA_API_SECRET
// );
const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

// Blockchain
const { ethers } = require("ethers"); // Khai báo ethers một lần duy nhất

// Sửa dòng này
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load contract
const contractABI = require("./MedicalRecordManager.json"); // File ABI của bạn
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

// ======== API ROUTES ========

// POST /createRecord
app.post("/createRecord", async (req, res) => {
    try {
        const data = req.body;

        // 1. Upload bệnh án lên IPFS
        const result = await pinata.pinJSONToIPFS(data);
        const ipfsHash = result.IpfsHash;

        // 2. Gọi Smart Contract tạo mới
        const tx = await contract.createRecord(
            data.address_patient,
            data.patient_name,
            ipfsHash
        );

        await tx.wait(); // Đợi transaction được confirm

        res.json({
            success: true,
            message: "Record created successfully!",
            ipfsHash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /updateRecord/:recordId
app.put("/updateRecord/:recordId", async (req, res) => {
    try {
        const { recordId } = req.params;
        const newData = req.body;

        // Upload dữ liệu mới lên IPFS
        const result = await pinata.pinJSONToIPFS(newData);
        const newIpfsHash = result.IpfsHash;

        // Update record trên Blockchain
        const tx = await contract.updateRecord(recordId, newIpfsHash);
        await tx.wait();

        res.json({
            success: true,
            message: "Record updated successfully!",
            newIpfsHash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /record/:recordId
app.get("/record/:recordId", async (req, res) => {
    try {
        const { recordId } = req.params;
        const record = await contract.getRecord(recordId);

        res.json({
            recordId: record[0],
            patientName: record[1],
            ipfsHash: record[2],
            timestamp: Number(record[3]),
            owner: record[4],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /patient/:address/records
app.get("/patient/:address/records", async (req, res) => {
    try {
        const { address } = req.params;
        const records = await contract.getAllRecordsOfPatient(address);

        const formatted = records.map((r) => ({
            recordId: r.recordId,
            patientName: r.patientName,
            ipfsHash: r.ipfsHash,
            timestamp: Number(r.timestamp),
            owner: r.owner,
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /creator/:address/records
app.get("/creator/:address/records", async (req, res) => {
    try {
        const { address } = req.params;
        const recordIds = await contract.getRecordsCreatedBy(address);

        res.json(recordIds.map((id) => Number(id)));
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ======== START SERVER ========
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
