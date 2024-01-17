const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const AuthRoute = require("./routes/auth");
const UserRoute = require("./routes/user");
const PostRoute = require("./routes/post");

dotenv.config();

const app = express();
const publicPath = path.join(__dirname, "public");

// ใช้ Middleware เพื่อเรียกหน้า HTML ของแอพพลิเคชัน React
app.use(express.static(publicPath));

// เรียกหน้า HTML สำหรับทุกเส้นทางใน React Router

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MOGODB_URL)
  .then(() => console.log("Connected to Mongo"))
  .catch(() => console.log("Can't Connect to Mongo"));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + process.env.PORT);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use(AuthRoute);
app.use(UserRoute);
app.use(PostRoute);
