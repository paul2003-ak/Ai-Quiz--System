import express from "express";
import { getcurruser } from "../controllers/auth.controller.js";
import { isAuth } from "../middleware/isauth.js";

const authrouter=express.Router();

authrouter.get("/getcurruser",isAuth,getcurruser)


export default authrouter
