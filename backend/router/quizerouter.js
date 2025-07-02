import express from "express";
import { getQuiz, submitQuiz } from "../controllers/quize.controller.js";
import { isAuth } from "../middleware/isauth.js";


const router = express.Router();

router.post("/generate",isAuth, getQuiz);
router.post("/submit",isAuth, submitQuiz);

export default router;
