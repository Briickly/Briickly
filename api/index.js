import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import adminRouter from './routes/admin.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import userRouter from './routes/user.route.js';
dotenv.config();
const app= express();

mongoose.connect(process.env.MONGO)
.then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.log(process.env.MONGO);
        console.log(err);
    })

app.use(express.json());   //to allow JSON as the input to the server
app.use(cookieParser());
app.listen(3000 ,()=>{
    console.log('Server is running on port 3000!');
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error yeahhh';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});