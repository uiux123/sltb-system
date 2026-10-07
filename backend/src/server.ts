import express, {
  Request,
  Response
} from "express";

import cors
  from "cors";

import dotenv
  from "dotenv";

import connectDB
  from "./config/db";


// =========================================================
// EXISTING ROUTES
// =========================================================

import depotRoutes
  from "./routes/depot.routes";

import busRoutes
  from "./routes/bus.routes";

import routeRoutes
  from "./routes/route.routes";

import tripRoutes
  from "./routes/trip.routes";

import fuelRecordRoutes
  from "./routes/fuelRecord.routes";

import ticketSaleRoutes
  from "./routes/ticketSale.routes";

import sparePartRoutes
  from "./routes/sparePart.routes";

import maintenanceRecordRoutes
  from "./routes/maintenanceRecord.routes";


// =========================================================
// ANALYTICS ROUTES
// =========================================================

import analyticsRoutes
  from "./routes/analytics.routes";


// =========================================================
// LOAD ENVIRONMENT VARIABLES
// =========================================================

dotenv.config();


// =========================================================
// EXPRESS APPLICATION
// =========================================================

const app =
  express();


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors()
);

app.use(
  express.json()
);


// =========================================================
// API ROUTES
// =========================================================

app.use(
  "/api/depots",
  depotRoutes
);

app.use(
  "/api/buses",
  busRoutes
);

app.use(
  "/api/routes",
  routeRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

app.use(
  "/api/fuel-records",
  fuelRecordRoutes
);

app.use(
  "/api/ticket-sales",
  ticketSaleRoutes
);

app.use(
  "/api/spare-parts",
  sparePartRoutes
);

app.use(
  "/api/maintenance-records",
  maintenanceRecordRoutes
);


// =========================================================
// ANALYTICS API
// =========================================================

app.use(
  "/api/analytics",
  analyticsRoutes
);


// =========================================================
// SERVER HEALTH CHECK
// =========================================================

app.get(
  "/api/health",
  (
    _req: Request,
    res: Response
  ) => {

    res.status(
      200
    ).json({

      success:
        true,

      message:
        "SLTB backend is running."

    });

  }
);


// =========================================================
// PORT
// =========================================================

const PORT =
  process.env.PORT ||
  5000;


// =========================================================
// START SERVER
// =========================================================

const startServer =
  async (): Promise<void> => {

    try {

      // ---------------------------------------------------
      // Connect MongoDB
      // ---------------------------------------------------

      await connectDB();


      // ---------------------------------------------------
      // Start Express Server
      // ---------------------------------------------------

      app.listen(
        PORT,
        () => {

          console.log(
            `Server running on port ${PORT}`
          );

        }
      );

    } catch (error) {

      if (
        error instanceof Error
      ) {

        console.error(
          `Server startup error: ${error.message}`
        );

      } else {

        console.error(
          "Unknown server startup error."
        );

      }


      process.exit(
        1
      );

    }

  };


// =========================================================
// START APPLICATION
// =========================================================

startServer();