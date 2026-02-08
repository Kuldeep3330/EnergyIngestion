import mongoose from "mongoose";

const VehicleHistorySchema = new mongoose.Schema({
    vehicleId: { type: String, required: true, index: true },
    soc: Number,
    kwhDeliveredDc: Number,
    batteryTemp: Number,
}, { timestamps: true,
    collection: 'vehicle_history'
 })

const VehicleHistory = mongoose.model("VehicleHistory", VehicleHistorySchema)
export default VehicleHistory