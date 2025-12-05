import express from "express";
import { ENV } from "./lib/env.js";
const app = express();
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.listen(ENV.PORT);
