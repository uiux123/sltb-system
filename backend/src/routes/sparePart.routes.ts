import {
  Router
} from "express";

import {
  createSparePart,
  getAllSpareParts,
  getLowStockSpareParts,
  getSparePartsByDepot,
  getSparePartById,
  updateSparePart,
  restockSparePart,
  deleteSparePart
} from "../controllers/sparePart.controller";


const router =
  Router();


// =========================================================
// CREATE
// POST /api/spare-parts
// =========================================================

router.post(
  "/",
  createSparePart
);


// =========================================================
// READ ALL
// GET /api/spare-parts
// =========================================================

router.get(
  "/",
  getAllSpareParts
);


// =========================================================
// LOW STOCK / OUT OF STOCK
// GET /api/spare-parts/low-stock
// =========================================================

router.get(
  "/low-stock",
  getLowStockSpareParts
);


// =========================================================
// READ BY DEPOT
// GET /api/spare-parts/depot/:depotId
// =========================================================

router.get(
  "/depot/:depotId",
  getSparePartsByDepot
);


// =========================================================
// READ ONE
// GET /api/spare-parts/:partId
// =========================================================

router.get(
  "/:partId",
  getSparePartById
);


// =========================================================
// UPDATE
// PUT /api/spare-parts/:partId
// =========================================================

router.put(
  "/:partId",
  updateSparePart
);


// =========================================================
// RESTOCK
// PATCH /api/spare-parts/:partId/restock
// =========================================================

router.patch(
  "/:partId/restock",
  restockSparePart
);


// =========================================================
// DELETE
// DELETE /api/spare-parts/:partId
// =========================================================

router.delete(
  "/:partId",
  deleteSparePart
);


export default router;