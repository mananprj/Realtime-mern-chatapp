import express from 'express';
import authRoute from '../routes/auth.route.js';
import messageRoute from '../routes/message.route.js';
import dotenv from "dotenv"
import { connectDB } from '../lib/db.js';
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser";
import { app, server } from '../lib/socket.js';

dotenv.config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const port = process.env.PORT || 5001;

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

server.listen(port, () => {
    console.log('Server is running on port ' + port);
    connectDB();
})