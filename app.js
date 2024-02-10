import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import bodyParser from "body-parser";
import config from "./config.json";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(cors());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

import indexRouter from "./api/index.js";
import apiRouter from "./api/api.js";
import adminRouter from "./api/admin.js";

import indexPage from "./routes/index.js";
import adminPage from "./routes/admin.js";

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);

app.use("/", indexPage)
app.use("/admin", adminPage)

app.use((req, res, next) => { 
  res.status(404).render("404") 
}) 

app.listen(config.port, () => {
  mongoose.connect(config.mongodb).then(console.log("Connected to MongoDB"));
  console.log(`Server listening on port: ${config.port}!`);
});
