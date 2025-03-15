const express = require("express");
const cors = require("cors");
const { initializeDefaultKey } = require("./db");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000", "https://example.com"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
