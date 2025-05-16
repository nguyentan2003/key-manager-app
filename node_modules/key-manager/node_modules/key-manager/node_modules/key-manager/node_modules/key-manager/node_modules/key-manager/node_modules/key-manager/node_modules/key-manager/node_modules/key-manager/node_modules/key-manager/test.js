require("dotenv").config();
const express = require("express");
const pinataSDK = require("@pinata/sdk");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = require("./MedicalRecordManager.json");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

// 1. Tạo bệnh án mới
app.post("/api/medical-record", async(req, res) => {
    try {
        const {
            patient_address,
            doctor_address,
            orderId,
            patientName,
            age,
            gender,
            diagnosis,
            treatment,
            note,
        } = req.body;

        if (!patient_address || !doctor_address || !orderId || !patientName) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
        }

        const medicalRecordData = {
            patientName,
            age,
            gender,
            diagnosis,
            treatment,
            note,
        };

        // Upload data lên Pinata
        const result = await pinata.pinJSONToIPFS(medicalRecordData);
        const ipfsHash = result.IpfsHash;

        const tx = await contract.createRecord(
            patient_address,
            doctor_address,
            patientName,
            ipfsHash,
            orderId
        );
        const receipt = await tx.wait();

        res.json({
            message: "Tạo bệnh án thành công",
            txHash: receipt.transactionHash,
            ipfsHash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// 2. Cập nhật bệnh án theo recordId
app.put("/api/medical-record/:recordId", async(req, res) => {
    try {
        const recordId = parseInt(req.params.recordId);
        const { newData } = req.body;

        if (!recordId || !newData) {
            return res
                .status(400)
                .json({ error: "Thiếu recordId hoặc newData" });
        }

        const result = await pinata.pinJSONToIPFS(newData);
        const newIpfsHash = result.IpfsHash;

        const tx = await contract.updateRecord(recordId, newIpfsHash);
        const receipt = await tx.wait();

        res.json({
            message: "Cập nhật thành công",
            txHash: receipt.transactionHash,
            ipfsHash: newIpfsHash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// 3. Cập nhật bệnh án theo orderId
app.put("/api/medical-record/order/:orderId", async(req, res) => {
    try {
        const orderId = req.params.orderId;
        const { newData } = req.body;

        if (!newData) {
            return res.status(400).json({ error: "Thiếu newData" });
        }

        const result = await pinata.pinJSONToIPFS(newData);
        const newIpfsHash = result.IpfsHash;

        const tx = await contract.updateByOrderTableId(orderId, newIpfsHash);
        const receipt = await tx.wait();

        res.json({
            message: "Cập nhật theo orderId thành công",
            txHash: receipt.transactionHash,
            ipfsHash: newIpfsHash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// 4. Lấy chi tiết bệnh án theo orderId
app.get("/api/medical-record/order/:orderId", async(req, res) => {
    try {
        const orderId = req.params.orderId;

        const record = await contract.getByOrderTableId(orderId);

        res.json({
            recordId: record[0].toNumber ? record[0].toNumber() : record[0], // chuyển BigNumber sang number nếu cần
            patientName: record[1],
            ipfsHash: record[2],
            timestamp: record[3].toNumber ? record[3].toNumber() : record[3],
            owner: record[4],
            doctor: record[5],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// 5. Lấy chi tiết bệnh án theo recordId
app.get("/api/medical-record/:recordId", async(req, res) => {
    try {
        const recordId = parseInt(req.params.recordId);

        const record = await contract.getRecord(recordId);

        res.json({
            recordId: record[0].toNumber ? record[0].toNumber() : record[0],
            patientName: record[1],
            ipfsHash: record[2],
            timestamp: record[3].toNumber ? record[3].toNumber() : record[3],
            owner: record[4],
            doctor: record[5],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// 6. Lấy tất cả bệnh án của 1 bệnh nhân
app.get("/api/medical-record/patient/:patientAddress", async(req, res) => {
    try {
        const patientAddress = req.params.patientAddress;

        const records = await contract.getAllRecordsOfPatient(patientAddress);

        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// 7. Lấy danh sách recordId do owner (hệ thống)
app.get("/api/medical-record/creator/:creatorAddress", async(req, res) => {
    try {
        const creatorAddress = req.params.creatorAddress;

        const recordIds = await contract.getRecordsCreatedBy(creatorAddress);

        res.json(recordIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

// API lấy danh sách recordId của bác sĩ theo địa chỉ truyền vào param
app.get("/records/doctor/:address", async(req, res) => {
    const doctorAddress = req.params.address;

    try {
        // Gọi hàm getRecordsCreatedByDoctor
        const recordIds = await contract.getRecordsCreatedByDoctor(
            doctorAddress
        );

        res.json({
            success: true,
            doctor: doctorAddress,
            recordIds,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// 8. Lấy tất cả recordId
app.get("/api/medical-record/all-record-ids", async(req, res) => {
    try {
        const allRecordIds = await contract.getAllRecordIds();

        res.json(allRecordIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Lỗi server" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});