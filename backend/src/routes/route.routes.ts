import {
  Router
} from "express";

import {
  createRoute,
  getAllRoutes,
  getSocialServiceRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from "../controllers/route.controller";


const router = Router();


// CREATE
router.post(
  "/",
  createRoute
);


// READ ALL
router.get(
  "/",
  getAllRoutes
);


// READ SOCIAL SERVICE ROUTES
router.get(
  "/social-service",
  getSocialServiceRoutes
);


// READ ONE
router.get(
  "/:routeId",
  getRouteById
);


// UPDATE
router.put(
  "/:routeId",
  updateRoute
);


// DELETE
router.delete(
  "/:routeId",
  deleteRoute
);


export default router;