import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/post.js"
import authRoutes from "./routes/auth.js"

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ "policy": "cross-origin" }));
app.use(morgan("common"));
app.use(cors(corsOptions));
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))
app.options('*', cors(corsOptions));
app.use("./assets", express.static(path.join(__dirname, 'public/assets')))
 
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
})

const upload = multer({ storage });



app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
// MONGOOSE CONFIG
const PORT = process.env.PORT || 3003;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});

