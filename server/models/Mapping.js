import mongoose from "mongoose";

const MappingSchema = new mongoose.Schema({
    vehicleId: { type: String, required: true, unique: true },
    meterId: { type: String, required: true }
}, { timestamps: true,
    collection: 'vehicle_meter_mapping'
 })

const Mapping = mongoose.model("Mapping", MappingSchema)
export default Mapping