import {
  Router
} from "express";

import {
  createTrip,
  getAllTrips,
  getTripById,
  getTripsByDepot,
  getTripsByRoute,
  getTripsByBus,
  updateTrip,
  deleteTrip
} from "../controllers/trip.controller";


const router = Router();


// CREATE
router.post(
  "/",
  createTrip
);


// READ ALL
router.get(
  "/",
  getAllTrips
);


// READ BY DEPOT
router.get(
  "/depot/:depotId",
  getTripsByDepot
);


// READ BY ROUTE
router.get(
  "/route/:routeId",
  getTripsByRoute
);


// READ BY BUS
router.get(
  "/bus/:busId",
  getTripsByBus
);


// READ ONE
router.get(
  "/:tripId",
  getTripById
);


// UPDATE
router.put(
  "/:tripId",
  updateTrip
);


// DELETE
router.delete(
  "/:tripId",
  deleteTrip
);


export default router;