import express from 'express'
import MeterHistory from '../models/MeterHistory.js';
import MeterLive from '../models/MeterLive.js';
import VehicleHistory from '../models/VehicleHistory.js';
import VehicleLive from '../models/VehicleLive.js';


const router = express.Router()

router.post('/', async (req, res) => {
    const body = req.body
    const now = body.timestamp ? new Date(body.timestamp) : new Date();

    if (body.meterId && body.vehicleId) {
        return res.status(400).json({ error: "Payload must be meter OR vehicle" });
    }

    try {

        if (body.meterId) {
            const meterRecord = {
                meterId: String(body.meterId),
                kwhConsumedAc: Number(body.kwhConsumedAc) || 0,
                voltage: typeof body.voltage === 'number' ? body.voltage : null,
                timestamp: now
            };



            await MeterHistory.create(meterRecord);


            await MeterLive.findOneAndUpdate(
                { meterId: meterRecord.meterId },
                {
                    $set: {
                        kwhConsumedAc: meterRecord.kwhConsumedAc,
                        voltage: meterRecord.voltage,
                        timestamp: meterRecord.timestamp
                    }
                },
                { upsert: true, new: true }
            );

            return res.status(201).json({ message: 'Meter ingested' });
        }

        if (body.vehicleId) {
            const vehicleRecord = {
                vehicleId: String(body.vehicleId),
                soc: typeof body.soc === 'number' ? body.soc : null,
                kwhDeliveredDc: Number(body.kwhDeliveredDc) || 0,
                batteryTemp: typeof body.batteryTemp === 'number' ? body.batteryTemp : null,
                timestamp: now
            };

            await VehicleHistory.create(vehicleRecord);

            await VehicleLive.findOneAndUpdate(
                { vehicleId: vehicleRecord.vehicleId },
                { $set: { ...vehicleRecord } },
                { upsert: true, new: true }
            );

            return res.status(201).json({ message: 'Vehicle ingested' });
        }

        return res.status(400).json({ error: 'Invalid payload: must include meterId or vehicleId' });

    } catch (err) {
        console.error('Ingest error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;