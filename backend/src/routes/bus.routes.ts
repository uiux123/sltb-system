import {
  Router
} from "express";

import {
  createBus,
  getAllBuses,
  getBusById,
  getBusesByDepot,
  updateBus,
  deleteBus
} from "../controllers/bus.controller";


const router = Router();


// CREATE
router.post(
  "/",
  createBus
);


// READ ALL
router.get(
  "/",
  getAllBuses
);


// READ BUSES BY DEPOT
router.get(
  "/depot/:depotId",
  getBusesByDepot
);


// READ ONE
router.get(
  "/:busId",
  getBusById
);


// UPDATE
router.put(
  "/:busId",
  updateBus
);


// DELETE
router.delete(
  "/:busId",
  deleteBus
);


export default router;