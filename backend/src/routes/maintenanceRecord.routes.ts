import {
  Router
} from "express";

import {
  createMaintenanceRecord,

  getAllMaintenanceRecords,

  getMaintenanceRecordById,

  getMaintenanceRecordsByBus,

  getMaintenanceRecordsByDepot,

  getMaintenanceRecordsByStatus,

  getMaintenanceRecordsByPart,

  updateMaintenanceRecord,

  deleteMaintenanceRecord
} from "../controllers/maintenanceRecord.controller";


const router =
  Router();


// =========================================================
// CREATE
// =========================================================

router.post(
  "/",
  createMaintenanceRecord
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",
  getAllMaintenanceRecords
);


// =========================================================
// FILTERED GET ROUTES
// =========================================================
//
// These must come before:
//
// /:maintenanceId
//
// otherwise Express could interpret:
//
// /bus/BUS101
//
// as:
//
// maintenanceId = "bus"
//
// =========================================================

router.get(
  "/bus/:busId",
  getMaintenanceRecordsByBus
);


router.get(
  "/depot/:depotId",
  getMaintenanceRecordsByDepot
);


router.get(
  "/status/:status",
  getMaintenanceRecordsByStatus
);


router.get(
  "/part/:partId",
  getMaintenanceRecordsByPart
);


// =========================================================
// GET ONE
// =========================================================

router.get(
  "/:maintenanceId",
  getMaintenanceRecordById
);


// =========================================================
// UPDATE
// =========================================================

router.put(
  "/:maintenanceId",
  updateMaintenanceRecord
);


// =========================================================
// DELETE / REVERSE
// =========================================================

router.delete(
  "/:maintenanceId",
  deleteMaintenanceRecord
);


export default router;