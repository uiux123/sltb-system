import Bus
  from "../models/bus.model";

import Depot
  from "../models/depot.model";

import {
  CreateBusInput,
  BusStatus,
  FuelType
} from "../types/bus.types";


// =========================================================
// BUS MODEL SOURCE
// =========================================================
//
// Synthetic fleet data for application testing.
//
// Manufacturer/model combinations are used to create
// realistic variation.
//
// This dataset must NOT be presented as an official
// SLTB fleet inventory.
//
// =========================================================

interface BusModelSource {
  manufacturer: string;
  model: string;
  capacity: number;
}


// =========================================================
// BUS MODELS
// =========================================================

const busModels:
  BusModelSource[] = [

  {
    manufacturer: "Ashok Leyland",
    model: "Viking",
    capacity: 54
  },

  {
    manufacturer: "Ashok Leyland",
    model: "Lynx",
    capacity: 49
  },

  {
    manufacturer: "Tata",
    model: "LP 1512",
    capacity: 54
  },

  {
    manufacturer: "Tata",
    model: "LP 909",
    capacity: 45
  },

  {
    manufacturer: "Mitsubishi",
    model: "Fuso",
    capacity: 45
  },

  {
    manufacturer: "Isuzu",
    model: "Journey",
    capacity: 45
  },

  {
    manufacturer: "Yutong",
    model: "ZK Series",
    capacity: 49
  },

  {
    manufacturer: "King Long",
    model: "XMQ Series",
    capacity: 49
  }

];


// =========================================================
// HELPER: BUS STATUS
// =========================================================
//
// Creates useful variation for later analytics.
//
// Majority:
// Operational
//
// Smaller groups:
// Under Maintenance
// Breakdown
// Out of Service
//
// =========================================================

const getBusStatus = (
  number: number
): BusStatus => {

  // -------------------------------------------------------
  // Every 25th Bus
  // -------------------------------------------------------

  if (
    number % 25 === 0
  ) {

    return "Out of Service";
  }


  // -------------------------------------------------------
  // Every 15th Bus
  // -------------------------------------------------------

  if (
    number % 15 === 0
  ) {

    return "Breakdown";
  }


  // -------------------------------------------------------
  // Every 10th Bus
  // -------------------------------------------------------

  if (
    number % 10 === 0
  ) {

    return "Under Maintenance";
  }


  // -------------------------------------------------------
  // Remaining Buses
  // -------------------------------------------------------

  return "Operational";
};


// =========================================================
// HELPER: FUEL TYPE
// =========================================================
//
// IMPORTANT:
//
// No Electric buses are generated.
//
// The current fuel-record collection measures:
//
// - fuel_litres
// - fuel_cost_per_litre
// - total_fuel_cost
// - km_per_litre
// - fuel_cost_per_km
//
// Therefore the seed fleet contains only:
//
// Diesel
// Hybrid
//
// An Electric bus would require another energy model using
// fields such as energy_kwh and cost_per_kwh.
//
// =========================================================

const getFuelType = (
  number: number
): FuelType => {

  // -------------------------------------------------------
  // Every 20th Bus is Hybrid
  //
  // BUS020
  // BUS040
  // BUS060
  // BUS080
  // BUS100
  // -------------------------------------------------------

  if (
    number % 20 === 0
  ) {

    return "Hybrid";
  }


  // -------------------------------------------------------
  // All remaining buses are Diesel
  // -------------------------------------------------------

  return "Diesel";
};


// =========================================================
// HELPER: MANUFACTURE YEAR
// =========================================================
//
// Generates years:
//
// 2012 - 2025
//
// =========================================================

const getManufactureYear = (
  index: number
): number => {

  return (
    2012 +
    (
      index % 14
    )
  );
};


// =========================================================
// HELPER: ODOMETER
// =========================================================
//
// Generates deterministic synthetic mileage.
//
// Approximate range:
//
// 60,000 km - 590,000 km
//
// =========================================================

const getOdometerKm = (
  index: number
): number => {

  return (
    60_000 +
    (
      (
        index * 37_500
      ) %
      530_000
    )
  );
};


// =========================================================
// HELPER: LAST SERVICE DATE
// =========================================================
//
// Service dates are distributed across 2026.
//
// =========================================================

const getLastServiceDate = (
  index: number
): Date => {

  const month =
    index % 9;


  const day =
    2 +
    (
      index % 24
    );


  return new Date(
    2026,
    month,
    day
  );
};


// =========================================================
// SEED BUSES
// =========================================================

export const seedBuses =
  async (): Promise<void> => {

    console.log(
      "Seeding buses..."
    );


    // =====================================================
    // GET ACTIVE DEPOTS
    // =====================================================
    //
    // We use real MongoDB Depot documents rather than
    // hard-coding unrelated depot IDs.
    //
    // =====================================================

    const activeDepots =
      await Depot
        .find({
          status: "Active"
        })
        .sort({
          depot_id: 1
        });


    // -----------------------------------------------------
    // Must have active depots
    // -----------------------------------------------------

    if (
      activeDepots.length === 0
    ) {

      throw new Error(
        "Cannot seed buses because no active depots exist."
      );
    }


    // -----------------------------------------------------
    // Our Depot seed currently creates:
    //
    // Active   = 90
    // Inactive = 10
    //
    // -----------------------------------------------------

    if (
      activeDepots.length !== 90
    ) {

      throw new Error(
        `Bus seed expected 90 active depots but found ${activeDepots.length}.`
      );
    }


    // =====================================================
    // GENERATE EXACTLY 100 BUS DOCUMENTS
    // =====================================================

    const busSeedData:
      CreateBusInput[] =
        Array.from(
          {
            length: 100
          },
          (
            _,
            index
          ) => {

            const number =
              index + 1;


            // =================================================
            // BUS ID
            // =================================================

            const busId =
              `BUS${String(
                number
              ).padStart(
                3,
                "0"
              )}`;


            // =================================================
            // SYNTHETIC REGISTRATION NUMBER
            // =================================================

            const registrationNo =
              `NB-${String(
                1000 +
                number
              ).padStart(
                4,
                "0"
              )}`;


            // =================================================
            // ASSIGN EXISTING ACTIVE DEPOT
            // =================================================
            //
            // 100 buses are distributed across the 90
            // active depots.
            //
            // =================================================

            const depot =
              activeDepots[
                index %
                activeDepots.length
              ];


            // =================================================
            // SELECT BUS MODEL
            // =================================================

            const busModel =
              busModels[
                index %
                busModels.length
              ];


            // =================================================
            // CREATE BUS DOCUMENT
            // =================================================

            return {

              bus_id:
                busId,

              registration_no:
                registrationNo,

              depot_id:
                depot.depot_id,

              manufacturer:
                busModel.manufacturer,

              model:
                busModel.model,

              manufacture_year:
                getManufactureYear(
                  index
                ),

              capacity:
                busModel.capacity,

              fuel_type:
                getFuelType(
                  number
                ),

              odometer_km:
                getOdometerKm(
                  index
                ),

              bus_status:
                getBusStatus(
                  number
                ),

              last_service_date:
                getLastServiceDate(
                  index
                )

            };

          }
        );


    // =====================================================
    // VERIFY GENERATED COUNT
    // =====================================================

    if (
      busSeedData.length !== 100
    ) {

      throw new Error(
        `Bus seed requires exactly 100 buses. Generated: ${busSeedData.length}`
      );
    }


    // =====================================================
    // VERIFY FUEL TYPES BEFORE INSERT
    // =====================================================

    const electricBuses =
      busSeedData.filter(
        bus =>
          bus.fuel_type ===
          "Electric"
      );


    if (
      electricBuses.length > 0
    ) {

      throw new Error(
        `Bus seed contains ${electricBuses.length} Electric buses. Electric buses are not allowed in the current fuel-record design.`
      );
    }


    // =====================================================
    // REMOVE EXISTING BUSES
    // =====================================================

    await Bus.deleteMany({});


    // =====================================================
    // INSERT EXACTLY 100 BUSES
    // =====================================================

    await Bus.insertMany(
      busSeedData
    );


    // =====================================================
    // VERIFY DOCUMENT COUNT
    // =====================================================

    const count =
      await Bus.countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Bus seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    // =====================================================
    // VERIFY DEPOT RELATIONSHIPS
    // =====================================================

    const seededBuses =
      await Bus.find();


    const validDepotIds =
      new Set(
        activeDepots.map(
          depot =>
            depot.depot_id
        )
      );


    const invalidBus =
      seededBuses.find(
        bus =>
          !validDepotIds.has(
            bus.depot_id
          )
      );


    if (
      invalidBus
    ) {

      throw new Error(
        `Bus relationship validation failed for ${invalidBus.bus_id}. Depot ${invalidBus.depot_id} does not exist in the active depot list.`
      );
    }


    // =====================================================
    // VERIFY NO ELECTRIC BUSES AFTER INSERT
    // =====================================================

    const electricBusCount =
      await Bus.countDocuments({
        fuel_type:
          "Electric"
      });


    if (
      electricBusCount !== 0
    ) {

      throw new Error(
        `Bus validation failed. Found ${electricBusCount} Electric buses.`
      );
    }


    // =====================================================
    // COUNT DIESEL / HYBRID
    // =====================================================

    const dieselCount =
      await Bus.countDocuments({
        fuel_type:
          "Diesel"
      });


    const hybridCount =
      await Bus.countDocuments({
        fuel_type:
          "Hybrid"
      });


    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      `Buses seeded successfully: ${count}`
    );


    console.log(
      `Bus relationships verified against ${activeDepots.length} active depots.`
    );


    console.log(
      `Diesel buses: ${dieselCount}`
    );


    console.log(
      `Hybrid buses: ${hybridCount}`
    );


    console.log(
      `Electric buses: ${electricBusCount}`
    );

  };