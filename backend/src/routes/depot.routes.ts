import {
  Router
} from "express";

import {
  createDepot,
  getAllDepots,
  getDepotById,
  updateDepot,
  deleteDepot
} from "../controllers/depot.controller";

const router = Router();

router.post(
  "/",
  createDepot
);

router.get(
  "/",
  getAllDepots
);

router.get(
  "/:depotId",
  getDepotById
);

router.put(
  "/:depotId",
  updateDepot
);

router.delete(
  "/:depotId",
  deleteDepot
);

export default router;