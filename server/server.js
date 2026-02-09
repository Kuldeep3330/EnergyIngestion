import express from "express";
import mongoose from "mongoose";
const app = express();
const PORT = 4000;

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/ingestion_db")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

import ingestRouter from './routes/ingest.js';
import analyticsRouter from './routes/analytics.js';
import mappingRouter from './routes/mapping.js';

app.use('/v1/ingest', ingestRouter);
app.use('/v1/analytics', analyticsRouter);
app.use('/v1/mapping', mappingRouter);


app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);