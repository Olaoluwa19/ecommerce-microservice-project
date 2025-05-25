import express from "express";
import path from "path";
const router = express.Router();
import { __dirname } from "../middleware/logEvents.js";

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;
