import mongoose from "mongoose";

const MeterLiveSchema = new mongoose.Schema({
    meterId: { type: String, required: true, unique: true },
    kwhConsumedAc: Number,
    voltage: Number,
    timestamp: Date
}, { timestamps: true,
    collection: 'meter_live'
 })

const MeterLive = mongoose.model("MeterLive", MeterLiveSchema)
export default MeterLive