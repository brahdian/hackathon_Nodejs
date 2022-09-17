import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { db } from "./auth/auth.model.js"


const app = express();

const urlOptions = { extended: true };
const corsOptions = { origin: "http://localhost:3000" };

//Middlewares

app.use(helmet());
app.use(cors(corsOptions));
app.use(urlencoded(urlOptions));
app.use(json());

// DB Connection

const Role = db.role