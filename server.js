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
    console.log("tao moi");
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

        // Bước 1: Kiểm tra orderId đã tồn tại chưa
        const exists = await contract.existsOrderId(orderId);

        if (exists) {
            return res.status(400).json({
                code: 400,
                message: "Order ID đã tồn tại",
                data: {},
            });
        }

        // Nếu chưa tồn tại => tiếp tục tạo bệnh án

        if (
            !patient_address ||
            !doctor_address ||
            !encrypted_doctor_key ||
            !orderId ||
            !patientName
        ) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu dữ liệu bắt buộc",
                data: {},
            });
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
    console.log("cap quyen");
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

// 2. Cập nhật bệnh án theo recordId và chỉ doctor tạo mới cập nhật đc
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

app.put("/api/update-medical-record/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;
        if (orderId == null)
            return res.status(400).json({
                code: 400,
                message: "OrderId not null",
                data: {},
            });
        const {
            encrypted_doctor_key,
            patientName,
            age,
            gender,
            diagnosis,
            treatment,
            prescription,
        } = req.body;

        if (!encrypted_doctor_key || !orderId || !patientName) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu dữ liệu bắt buộc",
                data: {},
            });
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
        const newIpfsHash = result.IpfsHash;

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

        // const gasEstimate = await contract.estimateGas.updateRecordByOrderId(
        //     orderId,
        //     newIpfsHash
        // );
        // console.log("gas la : ", gasEstimate);
        // const test = ethers.BigNumber.from(gasEstimate);
        console.log(orderId);
        const tx = await contract1.updateRecordByOrderId(orderId, newIpfsHash, {
            gasLimit: 999999999999,
        });
        const record = await tx.wait();

        // B5: Trả kết quả về client

        res.json({
            code: 200,
            message: "update theo orderID thành công !!",
            result: {},
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 401,
            message: "Doctor not Authorize",
            result: {
                error: error.reason || "Lỗi server",
            },
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

        if (recordId == null) {
            res.status(500).json({
                code: 400,
                message: "Id không đúng định dạng !!",
                result: {},
            });
        }
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
            message: "Không tồn tại id này !!",
            result: {},
        });
    }
});

// 6. Lấy tất cả bệnh án của 1 bệnh nhân
app.post("/api/medical-record/patient", async (req, res) => {
    try {
        const { address, encrypted_key } = req.body;
        if (!address || !encrypted_key) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu dữ liệu bắt buộc",
                data: {},
            });
        }

        // giải mã key
        const decryptedPrivateKeyRaw = await decryptKey(encrypted_key);
        const walletBlockchain = new ethers.Wallet(
            decryptedPrivateKeyRaw,
            provider
        );

        const contract1 = new ethers.Contract(
            contractAddress,
            contractABI.abi,
            walletBlockchain
        );

        const records = await contract1.getAllRecordsOfPatient(address);

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

//8 API lấy danh sách recordId của bác sĩ
app.post("/records/doctor", async (req, res) => {
    try {
        const { address, encrypted_key } = req.body;
        if (!address || !encrypted_key) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu dữ liệu bắt buộc",
                data: {},
            });
        }

        // giải mã key
        const decryptedPrivateKeyRaw = await decryptKey(encrypted_key);
        const walletBlockchain = new ethers.Wallet(
            decryptedPrivateKeyRaw,
            provider
        );

        const contract1 = new ethers.Contract(
            contractAddress,
            contractABI.abi,
            walletBlockchain
        );

        const records = await contract1.getRecordsCreatedByDoctor(address);

        res.json({
            code: 200,
            message: "Lấy danh sách recordId của bác sĩ theo địa chỉ !!",
            result: {
                records,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Thông tin sai hoặc bạn không có quyền gọi endpoint này!!",
            result: {},
        });
    }
});

// 8. Lấy tất cả recordId
app.get("/api/admin/getAllRecord", async (req, res) => {
    try {
        const { encrypted_key } = req.body;
        if (!encrypted_key) {
            return res.status(400).json({
                code: 400,
                message: "Thiếu dữ liệu bắt buộc",
                data: {},
            });
        }

        // giải mã key
        const decryptedPrivateKeyRaw = await decryptKey(encrypted_key);
        const walletBlockchain = new ethers.Wallet(
            decryptedPrivateKeyRaw,
            provider
        );

        const contract1 = new ethers.Contract(
            contractAddress,
            contractABI.abi,
            walletBlockchain
        );

        const records = await contract1.getAllRecordIds();

        res.json({
            code: 200,
            message: "Lấy danh sách record bệnh án thành công !!",
            result: {
                records,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Chỉ có admin có quyền gọi endpoint này !!",
            result: {},
        });
    }
});

// Private key của ví trong Ganache (ví có sẵn ETH)
const senderPrivateKey = process.env.PRIVATE_KEY_WALLET_PRICE; // thay bằng private key thật
const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

// Tạo ví mới
app.get("/create-wallet", async (req, res) => {
    try {
        const wallet = ethers.Wallet.createRandom();
        const encryptedPrivateKey = await encryptKey(wallet.privateKey);
        res.json({
            code: 200,
            message: "Tạo ví thành công !!",
            result: {
                address: wallet.address,
                privateKey: encryptedPrivateKey,
            },
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Tạo ví thất bại",
            result: {
                details: error.message,
            },
        });
    }
});

// Chuyển ETH sang ví mới
app.post("/fund-wallet", async (req, res) => {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
        return res.status(400).json({
            code: 400,
            message: "Vui lòng truyền 'toAddress' và 'amount !!",
            result: {},
        });
    }

    try {
        const tx = await senderWallet.sendTransaction({
            to: toAddress,
            value: ethers.utils.parseEther(amount), // chuyển từ ETH sang wei
        });

        await tx.wait();

        res.json({
            code: 200,
            message: "Chuyển ETH thành công!",
            result: {
                transactionHash: tx.hash,
            },
        });
    } catch (error) {
        console.error("Lỗi chuyển ETH:", error);
        res.status(500).json({
            code: 500,
            message: "Chuyển ETH thất bại !!",
            result: {
                details: error.message,
            },
        });
    }
});

// tạo và cấp tiền cho ví thông qua role
app.post("/create-and-fund-wallet", async (req, res) => {
    const { role } = req.body;

    if (!role || (role !== "DOCTOR" && role !== "USER")) {
        return res.status(400).json({
            code: 400,
            message:
                "Vui lòng truyền 'role' và giá trị là 'doctor' hoặc 'user'!",
            result: {},
        });
    }

    try {
        // Tạo ví mới
        const wallet = ethers.Wallet.createRandom();
        const encryptedPrivateKey = await encryptKey(wallet.privateKey);

        // Xác định số ETH cần cấp
        let amount = "1";
        if (role === "DOCTOR") amount = "5";

        // Chuyển ETH từ ví senderWallet sang ví mới tạo
        const tx = await senderWallet.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther(amount),
        });
        await tx.wait();

        // Trả kết quả
        res.json({
            code: 200,
            message: `Tạo ví và chuyển ${amount} ETH thành công!`,
            result: {
                address: wallet.address,
                privateKey: encryptedPrivateKey,
                transactionHash: tx.hash,
            },
        });
    } catch (error) {
        console.error("Lỗi tạo và chuyển ETH:", error);
        res.status(500).json({
            code: 500,
            message: "Tạo ví và chuyển ETH thất bại!",
            result: {
                details: error.message,
            },
        });
    }
});

// Kiểm tra số dư của địa chỉ ví
app.get("/balance/:address", async (req, res) => {
    const { address } = req.params;

    try {
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.utils.formatEther(balanceWei);

        res.json({
            code: 200,
            message: "Hãy kiểm tra số dư của bạn !!",
            result: {
                address,
                balance: `${balanceEth} ETH`,
            },
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Không thể lấy số dư !!",
            result: {
                details: error.message,
            },
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
