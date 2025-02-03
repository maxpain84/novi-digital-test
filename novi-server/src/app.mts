import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { router as userRouter } from "./database/routes/user.router.mjs";


dotenv.config();

const databaseURL: string = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

async function connectToDatabase(databaseURL: string) {
    await mongoose.connect(databaseURL);
    console.log("Connected to database");
}

try {
    await connectToDatabase(databaseURL);
} catch (error) {
    console.log('Error connecting to database: ' + error);
}

const PORT: number = 8000;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // ReactApp (Frontend URL)
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({ mongoUrl: databaseURL }),
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000 // 10 minutes
    }
}));

app.use((req: any, res: any, next: any) => {
    console.log('Session userId:', req.session.userId);
    next();
});

app.use('/api', userRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})