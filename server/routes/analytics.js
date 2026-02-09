import express from 'express'
import Mapping from '../models/Mapping.js';
import VehicleHistory from '../models/VehicleHistory.js';
import MeterHistory from '../models/MeterHistory.js';

const router = express.Router()

router.get('/performance/:vehicleId', async (req, res) => {
    const vehicleId = req.params.vehicleId;
    if (!vehicleId) return res.status(400).json({ error: 'vehicleId required' });

    const until = new Date();
    const since = new Date(until.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    try {
        const mapping = await Mapping.findOne({ vehicleId });
        if (!mapping) {
            return res.status(404).json({ error: "No meter mapped to this vehicle" });
        }
        const meterId = mapping ? mapping.meterId : null;
        const vehicleAgg = await VehicleHistory.aggregate([
            { $match: { vehicleId: vehicleId, timestamp: { $gte: since, $lte: until } } },
            {
                $group: {
                    _id: null,
                    totalDc: { $sum: "$kwhDeliveredDc" },
                    avgBatteryTemp: { $avg: "$batteryTemp" }
                }
            }
        ]);

        const totalDc = (vehicleAgg[0] && vehicleAgg[0].totalDc) ? vehicleAgg[0].totalDc : 0;
        const avgBatteryTemp = (vehicleAgg[0] && vehicleAgg[0].avgBatteryTemp) ? vehicleAgg[0].avgBatteryTemp : null;

        let totalAc = 0;
        if (meterId) {
            const meterAgg = await MeterHistory.aggregate([
                { $match: { meterId: meterId, timestamp: { $gte: since, $lte: until } } },
                { $group: { _id: null, totalAc: { $sum: "$kwhConsumedAc" } } }
            ]);
            totalAc = (meterAgg[0] && meterAgg[0].totalAc) ? meterAgg[0].totalAc : 0;
        }
        const efficiency = (totalAc > 0) ? (totalDc / totalAc) : null;
        res.json({
            vehicleId,
            since,
            until,
            totalDcDelivered: totalDc,
            totalAcConsumed: totalAc,
            efficiencyRatio: efficiency, // e.g. 0.89 -> 89%
            avgBatteryTemp
        });
    }
    catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;