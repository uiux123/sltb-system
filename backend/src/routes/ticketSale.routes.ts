import {
  Router
} from "express";

import {
  createTicketSale,
  getAllTicketSales,
  getTicketSaleById,
  getTicketSaleByTrip,
  getTicketSalesByRoute,
  getTicketSalesByDepot,
  getTicketSalesByBus,
  updateTicketSale,
  deleteTicketSale
} from "../controllers/ticketSale.controller";


const router = Router();


// CREATE
router.post(
  "/",
  createTicketSale
);


// READ ALL
router.get(
  "/",
  getAllTicketSales
);


// READ BY TRIP
router.get(
  "/trip/:tripId",
  getTicketSaleByTrip
);


// READ BY ROUTE
router.get(
  "/route/:routeId",
  getTicketSalesByRoute
);


// READ BY DEPOT
router.get(
  "/depot/:depotId",
  getTicketSalesByDepot
);


// READ BY BUS
router.get(
  "/bus/:busId",
  getTicketSalesByBus
);


// READ ONE
router.get(
  "/:ticketRecordId",
  getTicketSaleById
);


// UPDATE
router.put(
  "/:ticketRecordId",
  updateTicketSale
);


// DELETE
router.delete(
  "/:ticketRecordId",
  deleteTicketSale
);


export default router;