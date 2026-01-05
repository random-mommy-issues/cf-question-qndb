import express from "express";
import axios from "axios";
import uploadClassController from "./uploadClassController.js";
const router = express.Router();

router.post("/uploadQuestions", (req, res) => uploadClassController.uploadQuestions(req, res));

export default router;