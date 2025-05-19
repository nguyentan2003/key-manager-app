require("dotenv").config();
const express = require("express");
const pinataSDK = require("@pinata/sdk");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ethers } = require("ethers");
const { initializeDefaultKey } = require("./db");
const routes = require("./routes");
const axios = require("axios");

const { encryptKey, decryptKey } = require("./crypto");

const fs = require("fs");
const https = require("https");

const app = express();

app.use(cors());
app.use(bodyParser.json());
// Bật middleware để đọc JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet_admin = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);
// const wallet_doctor = new ethers.Wallet(
//     process.env.PRIVATE_KEY_DOCTOR,
//     provider
// );

const contractABI = require("./MedicalRecordManager.json");
const { error } = require("console");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(
    contractAddress,
    contractABI.abi,
    wallet_admin
);

// 1. Tạo bệnh án mới

app.post("/api/medical-record", async (req, res) => {
    try {
        const {
            patient_address,
            doctor_address,
            encrypted_doctor_key,
            orderId,
            patientName,
            age,
            gender,
            diagnosis,
            treatment,
            prescription,
        } = req.body;

        if (
            !patient_address ||
            !doctor_address ||
            !encrypted_doctor_key ||
            !orderId ||
            !patientName
        ) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
        }

        // B1: Tạo object chứa bệnh án
        const medicalRecordData = {
            patientName,
            age,
            gender,
            diagnosis,
            treatment,
            prescription,
        };

        // B2: Mã hóa bệnh án
        const plainText = JSON.stringify(medicalRecordData);
        const encryptedText = await encryptKey(plainText);

        // B3: Đưa chuỗi đã mã hóa lên IPFS
        const result = await pinata.pinJSONToIPFS({
            encryptedData: encryptedText,
        });
        const ipfsHash = result.IpfsHash;

        // giải mã key của doctor
        const decryptedPrivateKeyDoctor = await decryptKey(
            encrypted_doctor_key
        );
        const wallet_doctor = new ethers.Wallet(
            decryptedPrivateKeyDoctor,
            provider
        );

        // B4: Gọi smart contract để lưu IPFS hash
        const contract1 = new ethers.Contract(
            contractAddress,
            contractABI.abi,
            wallet_doctor
        );

        const tx = await contract1.createRecord(
            patient_address,
            doctor_address,
            patientName,
            ipfsHash,
            orderId
        );
        const receipt = await tx.wait();

        // B5: Trả kết quả về client
        res.json({
            code: 200,
            message: "Tạo bệnh án thành công",
            result: {
                txHash: receipt.transactionHash,
                ipfsHash,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 401,
            message: "Doctor not Authorize",
            result: {
                error: error.message || "Lỗi server",
            },
        });
    }
});

// lấy data raw từ mã hash ipfs
app.get("/api/decrypt-ipfs/:hash", async (req, res) => {
    try {
        const { hash } = req.params;
        const url = `https://gateway.pinata.cloud/ipfs/${hash}`;

        // Lấy dữ liệu từ IPFS
        const ipfsResponse = await axios.get(url);
        const encryptedData = ipfsResponse.data.encryptedData;

        if (!encryptedData) {
            return res.status(400).json({
                code: 400,
                message: "Dữ liệu IPFS không hợp lệ hoặc thiếu encryptedData",
                result: {
                    error: "Dữ liệu IPFS không hợp lệ hoặc thiếu encryptedData",
                },
            });
        }

        // Giải mã AES
        const decryptedText = await decryptKey(encryptedData);
        const medicalRecord = JSON.parse(decryptedText);

        res.json({
            code: 200,
            message: "Lấy data raw từ mã hash ipfs thành công !!",
            result: {
                medicalRecord,
            },
        }); // Trả về raw JSON
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: "Không thể giải mã dữ liệu từ IPFS",
            result: {
                error: error.message,
            },
        });
    }
});

// lấy data raw từ mã order table để trả về spring  boot
app.get("/api/data-raw/get-from-order-table-id/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const record = await contract.getByOrderTableId(orderId);

        const ipfsHash = record[2];
        try {
            const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

            // Lấy dữ liệu từ IPFS
            const ipfsResponse = await axios.get(url);
            const encryptedData = ipfsResponse.data.encryptedData;

            if (!encryptedData) {
                return res.status(400).json({
                    code: 400,
                    message:
                        "Dữ liệu IPFS không hợp lệ hoặc thiếu encryptedData",
                    result: {
                        error: "Lỗi",
                    },
                });
            }

            // Giải mã AES
            const decryptedText = await decryptKey(encryptedData);
            const medicalRecord = JSON.parse(decryptedText);

            res.json({
                code: 200,
                message: "Lấy dữu liệu từ order table ID thành công !!",
                result: medicalRecord,
            }); // Trả về raw JSON
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                code: 500,
                message: "Không thể giải mã dữ liệu từ IPFS",
                result: {
                    error: "Lỗi gì đó",
                },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Server không thể xử lí hãy kiểm tra lại",
            result: {
                error: error.message || "Lỗi server",
            },
        });
    }
});

// cấp quyền doctor
app.post("/grant/doctor", async (req, res) => {
    const { doctorAddress } = req.body;

    try {
        const tx = await contract.addDoctor(doctorAddress);
        await tx.wait();
        res.json({
            code: 200,
            message: `Granted doctor to ${doctorAddress}`,
            result: {},
        });
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Lỗi khi cấp quyền Doctor !!",
            result: {
                error: err.message,
            },
        });
    }
});
// thu hồi quyền doctor
app.post("/revoke/doctor", async (req, res) => {
    const { doctorAddress } = req.body;

    try {
        const tx = await contract.removeDoctor(doctorAddress);
        await tx.wait();
        res.json({
            code: 200,
            message: `Revoked doctor from ${doctorAddress}`,
            result: {},
        });
    } catch (err) {
        res.status(500).json({
            code: 500,

            message: "Lỗi khi thu hồi quyền Doctor !!",
            result: {
                error: err.message,
            },
        });
    }
});

// cấp quyền admin
app.post("/grant/admin", async (req, res) => {
    const { adminAddress } = req.body;

    try {
        const tx = await contract.addAdmin(adminAddress);
        await tx.wait();
        res.json({
            code: 200,
            message: `Granted admin to ${adminAddress}`,
            result: {},
        });
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Lỗi khi cấp quyền admin !!",
            result: {
                error: err.message,
            },
        });
    }
});

// API: GET /check-roles-of?address=0x...
app.post("/check-roles-of", async (req, res) => {
    const userAddress = req.body.address;

    try {
        const [isAdmin, isDoctor] = await contract.checkRolesOf(userAddress);
        res.json({
            code: 200,
            message: "Permission của address !!",
            result: {
                address: userAddress,
                isAdmin,
                isDoctor,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            message: "Lỗi khi gọi checkRolesOf !!",
            result: {},
        });
    }
});

// 2. Cập nhật bệnh án theo recordId
app.put("/api/medical-record/:recordId", async (req, res) => {
    try {
        const recordId = parseInt(req.params.recordId);
        const { newData } = req.body;

        if (!recordId || !newData) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu recordId hoặc newData !!",
                result: {},
            });
        }

        const result = await pinata.pinJSONToIPFS(newData);
        const newIpfsHash = result.IpfsHash;

        const tx = await contract.updateRecord(recordId, newIpfsHash);
        const receipt = await tx.wait();

        res.json({
            code: 200,
            message: "Cập nhật thành công",
            result: {
                txHash: receipt.transactionHash,
                ipfsHash: newIpfsHash,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 400,
            message: "Lỗi khi cập nhật bệnh án !! ",
            result: {
                error: error.message || "Lỗi server",
            },
        });
    }
});

// 3. Cập nhật bệnh án theo orderId
app.put("/api/medical-record/order/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { newData } = req.body;

        if (!newData) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu dữ liệu khi update bằng orderId !! ",
                result: {},
            });
        }

        const result = await pinata.pinJSONToIPFS(newData);
        const newIpfsHash = result.IpfsHash;

        const tx = await contract.updateByOrderTableId(orderId, newIpfsHash);
        const receipt = await tx.wait();

        res.json({
            code: 200,
            message: "Cập nhật theo orderId thành công",
            result: {
                txHash: receipt.transactionHash,
                ipfsHash: newIpfsHash,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 400,
            message: "Lỗi server khi cập nhật bằng orderId ",
            result: {},
        });
    }
});

// 4. Lấy chi tiết bệnh án theo orderId
app.get("/api/medical-record/order/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const record = await contract.getByOrderTableId(orderId);

        res.json({
            code: 200,
            message: "Lấy chi tiết theo orderID thành công !!",
            result: {
                recordId: record[0].toNumber ? record[0].toNumber() : record[0], // chuyển BigNumber sang number nếu cần
                patientName: record[1],
                ipfsHash: record[2],
                timestamp: record[3].toNumber
                    ? record[3].toNumber()
                    : record[3],
                owner: record[4],
                doctor: record[5],
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server khi lấy chi tiết bệnh án theo orderId",
            result: {},
        });
    }
});

// 5. Lấy chi tiết bệnh án theo recordId
app.get("/api/medical-record/:recordId", async (req, res) => {
    try {
        const recordId = parseInt(req.params.recordId);

        const record = await contract.getRecord(recordId);

        res.json({
            code: 200,
            message: "Lấy chi tiết theo recordId thành công !!",
            result: {
                recordId: record[0].toNumber ? record[0].toNumber() : record[0],
                patientName: record[1],
                ipfsHash: record[2],
                timestamp: record[3].toNumber
                    ? record[3].toNumber()
                    : record[3],
                owner: record[4],
                doctor: record[5],
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server",
            result: {},
        });
    }
});

// 6. Lấy tất cả bệnh án của 1 bệnh nhân
app.get("/api/medical-record/patient/:patientAddress", async (req, res) => {
    try {
        const patientAddress = req.params.patientAddress;

        const records = await contract.getAllRecordsOfPatient(patientAddress);

        res.json({
            code: 200,
            message: "Lấy tất cả bệnh án của 1 bệnh nhân thành công !!",
            result: {
                records,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server khi lấy tất cả bệnh án của 1 bệnh nhân !!",
            result: {},
        });
    }
});

// 7. Lấy danh sách recordId do owner (hệ thống)
app.get("/api/medical-record/creator/:creatorAddress", async (req, res) => {
    try {
        const creatorAddress = req.params.creatorAddress;

        const recordIds = await contract.getRecordsCreatedBy(creatorAddress);

        res.json({
            code: 200,
            message: "Lấy danh sách recordId do owner (hệ thống) !!",
            result: {
                recordIds,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server",
            result: {},
        });
    }
});

// API lấy danh sách recordId của bác sĩ theo địa chỉ truyền vào param
app.get("/records/doctor/:address", async (req, res) => {
    const doctorAddress = req.params.address;

    try {
        // Gọi hàm getRecordsCreatedByDoctor
        const recordIds = await contract.getRecordsCreatedByDoctor(
            doctorAddress
        );

        res.json({
            code: 200,
            message: "Lấy danh sách recordId của bác sĩ theo địa chỉ ",
            result: {
                doctor: doctorAddress,
                recordIds,
            },
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Lỗi server khi lấy danh sách !! ",
            result: {},
        });
    }
});

// 8. Lấy tất cả recordId
app.get("/api/medical-record/all-record-ids", async (req, res) => {
    try {
        const allRecordIds = await contract.getAllRecordIds();

        console.log(allRecordIds);
        // Chuyển BigNumber -> string
        const recordIds = allRecordIds.map((id) => id.toString());

        res.json({
            code: 200,
            message: "Lấy tất cả recordId thành công",
            result: {
                recordIds,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Lỗi xử lí trong blockchain",
            result: {},
        });
    }
});

app.use(routes);

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// Đọc chứng chỉ SSL
const options = {
    key: fs.readFileSync("private.key"),
    cert: fs.readFileSync("certificate.crt"),
};

app.get("/123", (req, res) => {
    res.send("Hello from HTTPS Server!");
});
// cổng 443 bị xampp chiếm
// Tạo server HTTPS
https.createServer(options, app).listen(555, () => {
    console.log("HTTPS Server is running on https://localhost:555");
});
