import mongoose from "mongoose";

const MeterHistorySchema = new mongoose.Schema({
   meterId: { type: String, required: true, index: true },
  kwhConsumedAc: Number,
  voltage: Number, 
}, { timestamps: true,
    collection: 'meter_history'
 })

const MeterHistory = mongoose.model("MeterHistory", MeterHistorySchema)
export default MeterHistory