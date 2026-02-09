import express from 'express'
import Mapping from '../models/Mapping.js';

const router= express.Router();

router.post('/', async(req, res)=>{
    const { vehicleId, meterId } = req.body || {};
  if (!vehicleId || !meterId) return res.status(400).json({ error: 'vehicleId & meterId required' });

  try {
    const updated = await Mapping.findOneAndUpdate(
      { vehicleId },
      { $set: { meterId } },
      { upsert: true, new: true }
    );
    res.json({ message: 'Mapping saved', mapping: updated });
  } catch (err) {
    console.error('Mapping error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})


export default router;


