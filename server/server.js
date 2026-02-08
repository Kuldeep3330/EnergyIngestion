import express from "express";
import mongoose from "mongoose";
const app = express();
const PORT = 4000;

mongoose
  .connect("mongodb://127.0.0.1:27017/ingestion_db")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);