import {
  Router
} from "express";

import {
  getAnalyticsHealth,
  getAnalyticsOverview,
  getAnalyticsFleet,
  getAnalyticsRoutes,
  getAnalyticsFuel,
  getAnalyticsRevenue,
  getAnalyticsMaintenance,
  getAnalyticsInventory,
  getAnalyticsBusPerformance,
  getAnalyticsFilters,
  getAnalyticsFiltered
} from "../controllers/analytics.controller";


const router =
  Router();


// =========================================================
// STEP 1
// HEALTH
// =========================================================

router.get(
  "/health",
  getAnalyticsHealth
);


// =========================================================
// STEP 2
// OVERVIEW
// =========================================================

router.get(
  "/overview",
  getAnalyticsOverview
);


// =========================================================
// STEP 3
// FLEET
// =========================================================

router.get(
  "/fleet",
  getAnalyticsFleet
);


// =========================================================
// STEP 4
// ROUTES
// =========================================================

router.get(
  "/routes",
  getAnalyticsRoutes
);


// =========================================================
// STEP 5
// FUEL
// =========================================================

router.get(
  "/fuel",
  getAnalyticsFuel
);


// =========================================================
// STEP 6
// REVENUE
// =========================================================

router.get(
  "/revenue",
  getAnalyticsRevenue
);


// =========================================================
// STEP 7
// MAINTENANCE
// =========================================================

router.get(
  "/maintenance",
  getAnalyticsMaintenance
);


// =========================================================
// STEP 8
// INVENTORY
// =========================================================

router.get(
  "/inventory",
  getAnalyticsInventory
);


// =========================================================
// STEP 9
// BUS PERFORMANCE
// =========================================================

router.get(
  "/bus-performance",
  getAnalyticsBusPerformance
);


// =========================================================
// STEP 10A
// FILTER OPTIONS
// =========================================================

router.get(
  "/filter-options",
  getAnalyticsFilters
);


// =========================================================
// STEP 10B
// FILTERED ANALYTICS
// =========================================================

router.get(
  "/filtered",
  getAnalyticsFiltered
);


// =========================================================
// EXPORT
// =========================================================

export default router;