import mongoose
  from "mongoose";

import dotenv
  from "dotenv";

import connectDB
  from "../config/db";

import {
  seedDepots
} from "./depot.seed";

import {
  seedRoutes
} from "./route.seed";

import {
  seedBuses
} from "./bus.seed";

import {
  seedSpareParts
} from "./sparePart.seed";

import {
  seedTrips
} from "./trip.seed";

import {
  seedFuelRecords
} from "./fuelRecord.seed";

import {
  seedTicketSales
} from "./ticketSale.seed";

import {
  seedMaintenanceRecords
} from "./maintenanceRecord.seed";


// =========================================================
// LOAD ENVIRONMENT VARIABLES
// =========================================================

dotenv.config();


// =========================================================
// MAIN SEED FUNCTION
// =========================================================

const runSeed =
  async (): Promise<void> => {

    try {

      console.log(
        "\n===================================="
      );

      console.log(
        "SLTB DATABASE SEEDING"
      );

      console.log(
        "====================================\n"
      );


      // ===================================================
      // CONNECT
      // ===================================================

      await connectDB();


      // ===================================================
      // STEP 1 - DEPOTS
      // ===================================================

      await seedDepots();


      // ===================================================
      // STEP 2 - ROUTES
      // ===================================================

      await seedRoutes();


      // ===================================================
      // STEP 3 - BUSES
      // ===================================================

      await seedBuses();


      // ===================================================
      // STEP 4 - SPARE PARTS
      // ===================================================

      await seedSpareParts();


      // ===================================================
      // STEP 5 - TRIPS
      // ===================================================

      await seedTrips();


      // ===================================================
      // STEP 6 - FUEL RECORDS
      // ===================================================

      await seedFuelRecords();


      // ===================================================
      // STEP 7 - TICKET SALES
      // ===================================================

      await seedTicketSales();


      // ===================================================
      // STEP 8 - MAINTENANCE RECORDS
      // ===================================================

      await seedMaintenanceRecords();


      // ===================================================
      // FINAL COUNTS
      // ===================================================

      const depotCount =
        await mongoose.connection
          .collection(
            "depots"
          )
          .countDocuments();


      const routeCount =
        await mongoose.connection
          .collection(
            "routes"
          )
          .countDocuments();


      const busCount =
        await mongoose.connection
          .collection(
            "buses"
          )
          .countDocuments();


      const sparePartCount =
        await mongoose.connection
          .collection(
            "spare_parts"
          )
          .countDocuments();


      const tripCount =
        await mongoose.connection
          .collection(
            "trips"
          )
          .countDocuments();


      const fuelRecordCount =
        await mongoose.connection
          .collection(
            "fuel_records"
          )
          .countDocuments();


      const ticketSaleCount =
        await mongoose.connection
          .collection(
            "ticket_sales"
          )
          .countDocuments();


      const maintenanceRecordCount =
        await mongoose.connection
          .collection(
            "maintenance_records"
          )
          .countDocuments();


      // ===================================================
      // EXPECTED COUNT
      // ===================================================

      const expectedCount =
        100;


      // ===================================================
      // VERIFY ALL COLLECTION COUNTS
      // ===================================================

      const collectionCounts = {

        Depots:
          depotCount,

        Routes:
          routeCount,

        Buses:
          busCount,

        "Spare Parts":
          sparePartCount,

        Trips:
          tripCount,

        "Fuel Records":
          fuelRecordCount,

        "Ticket Sales":
          ticketSaleCount,

        "Maintenance Records":
          maintenanceRecordCount

      };


      for (
        const [
          collectionName,
          count
        ] of
        Object.entries(
          collectionCounts
        )
      ) {

        if (
          count !==
          expectedCount
        ) {

          throw new Error(
            `${collectionName} verification failed. Expected ${expectedCount} but found ${count}.`
          );
        }

      }


      // ===================================================
      // SUCCESS
      // ===================================================

      console.log(
        "\n===================================="
      );

      console.log(
        "ALL SEEDING COMPLETED SUCCESSFULLY"
      );

      console.log(
        "===================================="
      );


      console.log(
        `Depots: ${depotCount}`
      );


      console.log(
        `Routes: ${routeCount}`
      );


      console.log(
        `Buses: ${busCount}`
      );


      console.log(
        `Spare Parts: ${sparePartCount}`
      );


      console.log(
        `Trips: ${tripCount}`
      );


      console.log(
        `Fuel Records: ${fuelRecordCount}`
      );


      console.log(
        `Ticket Sales: ${ticketSaleCount}`
      );


      console.log(
        `Maintenance Records: ${maintenanceRecordCount}`
      );


      console.log(
        "===================================="
      );


      console.log(
        "TOTAL DOCUMENTS: 800"
      );


      console.log(
        "====================================\n"
      );


    } catch (error) {

      if (
        error instanceof Error
      ) {

        console.error(
          "\nSeed Error:",
          error.message
        );

      } else {

        console.error(
          "\nUnknown seed error."
        );

      }


      process.exitCode =
        1;

    } finally {

      await mongoose.disconnect();


      console.log(
        "MongoDB connection closed."
      );

    }

  };


// =========================================================
// RUN
// =========================================================

runSeed();