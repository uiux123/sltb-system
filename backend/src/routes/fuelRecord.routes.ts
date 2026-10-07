import {
  Router
} from "express";

import {
  createFuelRecord,
  getAllFuelRecords,
  getFuelRecordById,
  getFuelRecordByTrip,
  getFuelRecordsByBus,
  getFuelRecordsByDepot,
  updateFuelRecord,
  deleteFuelRecord
} from "../controllers/fuelRecord.controller";


const router = Router();


// CREATE
router.post(
  "/",
  createFuelRecord
);


// READ ALL
router.get(
  "/",
  getAllFuelRecords
);


// READ BY TRIP
router.get(
  "/trip/:tripId",
  getFuelRecordByTrip
);


// READ BY BUS
router.get(
  "/bus/:busId",
  getFuelRecordsByBus
);


// READ BY DEPOT
router.get(
  "/depot/:depotId",
  getFuelRecordsByDepot
);


// READ ONE
router.get(
  "/:fuelRecordId",
  getFuelRecordById
);


// UPDATE
router.put(
  "/:fuelRecordId",
  updateFuelRecord
);


// DELETE
router.delete(
  "/:fuelRecordId",
  deleteFuelRecord
);


export default router;