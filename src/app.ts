import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import authRoutes from './routes/auth.routes';
import db from "./db";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.use('/auth', authRoutes);
db.init()

export default app;
