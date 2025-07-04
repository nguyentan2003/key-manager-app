const express = require("express");
const cors = require("cors");
const { initializeDefaultKey } = require("./db");
const routes = require("./routes");
const { ethers } = require("ethers");
const rawArtifact = require("./HelloWorld.json");
const { JsonRpcProvider } = require("@ethersproject/providers");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000", "https://example.com"];
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(express.json());
app.use(cors(corsOptions));
// app.use(routes);

const abi = rawArtifact.abi;
const rpcUrl = "http://127.0.0.1:7545";
const privateKey =
    "0x590ec609a2210794c04df16fb15bc5d247556dcbd833ddc263cffe6cdebfa68b";
const address = "0xaBf49E108139Ff5FF6076B573e6aEB9FE743e82b";

// Đây nè: ethers.JsonRpcProvider
const provider = new JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(address, abi, signer);

// API: Lấy lời chào hiện tại
app.get("/greet", async(req, res) => {
    try {
        console.log("/greet");
        const greet = await contract.getGreet(); // dùng contract đúng tên
        console.log(greet);
        res.json({ greet });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading greet");
    }
});

// API: Cập nhật lời chào mới
app.post("/greet", async(req, res) => {
    try {
        const { newGreet } = req.body;
        const tx = await contract.setGreet(newGreet); // dùng contract
        await tx.wait(); // Đợi giao dịch xác nhận
        res.send("Greet updated successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating greet");
    }
});

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});