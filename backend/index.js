import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import {connecttodb} from "./db/db.js"
import userrouter from "./router/user.router.js"
import authrouter from "./router/auth.router.js"
import quizrouter from "./router/quizerouter.js"
import cookieParser from "cookie-parser";
import cors from 'cors'
import path from 'path'

const __dirname=path.resolve()

const app=express();
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const PORT=process.env.PORT

app.use("/api/user",userrouter)
app.use("/api/auth",authrouter)
app.use("/api/quiz",quizrouter)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("/*splat", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }



app.listen(PORT,()=>{
    connecttodb();
    console.log(`server is running on port ${PORT}`);
})