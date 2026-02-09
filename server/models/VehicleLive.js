import mongoose from "mongoose";

const VehicleLiveSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  soc: Number,
  kwhDeliveredDc: Number,
  batteryTemp: Number,
  timestamp: Date
}, {
    timestamps: true,
    collection: 'vehicle_live' });

const VehicleLive = mongoose.model("VehicleLive", VehicleLiveSchema)
export default VehicleLive