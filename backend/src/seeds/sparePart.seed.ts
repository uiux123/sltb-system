import SparePart
  from "../models/sparePart.model";

import Depot
  from "../models/depot.model";

import {
  ISparePart,
  StockStatus
} from "../types/sparePart.types";


// =========================================================
// SPARE-PART TEMPLATE
// =========================================================

interface SparePartTemplate {
  part_name: string;
  part_category: string;
  manufacturer?: string;
  compatible_bus_models: string[];
  base_unit_cost: number;
}


// =========================================================
// SYNTHETIC SPARE-PART CATALOGUE
// =========================================================
//
// These are realistic bus-maintenance part categories and
// synthetic costs for application testing.
//
// Values must not be described as official SLTB inventory
// prices.
//
// =========================================================

const sparePartTemplates:
  SparePartTemplate[] = [

  {
    part_name: "Front Brake Pad Set",
    part_category: "Braking System",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512"
    ],
    base_unit_cost: 8500
  },

  {
    part_name: "Rear Brake Shoe Set",
    part_category: "Braking System",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "LP 1512",
      "LP 909"
    ],
    base_unit_cost: 11000
  },

  {
    part_name: "Brake Fluid",
    part_category: "Braking System",
    manufacturer: "Generic",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909",
      "Fuso",
      "Journey"
    ],
    base_unit_cost: 1800
  },

  {
    part_name: "Engine Oil Filter",
    part_category: "Engine",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909"
    ],
    base_unit_cost: 3200
  },

  {
    part_name: "Diesel Fuel Filter",
    part_category: "Fuel System",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 4500
  },

  {
    part_name: "Air Filter",
    part_category: "Engine",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909",
      "Fuso"
    ],
    base_unit_cost: 5200
  },

  {
    part_name: "Fan Belt",
    part_category: "Engine",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "LP 1512",
      "LP 909"
    ],
    base_unit_cost: 4000
  },

  {
    part_name: "Radiator Hose",
    part_category: "Cooling System",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 5500
  },

  {
    part_name: "Radiator Coolant",
    part_category: "Cooling System",
    manufacturer: "Generic",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909",
      "Fuso",
      "Journey"
    ],
    base_unit_cost: 2500
  },

  {
    part_name: "Clutch Plate",
    part_category: "Transmission",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "LP 1512",
      "LP 909"
    ],
    base_unit_cost: 28000
  },

  {
    part_name: "Clutch Release Bearing",
    part_category: "Transmission",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "LP 1512",
      "LP 909"
    ],
    base_unit_cost: 9500
  },

  {
    part_name: "Gearbox Oil",
    part_category: "Transmission",
    manufacturer: "Generic",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 4200
  },

  {
    part_name: "Alternator Belt",
    part_category: "Electrical",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 4800
  },

  {
    part_name: "Starter Motor",
    part_category: "Electrical",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 38000
  },

  {
    part_name: "12V Battery",
    part_category: "Electrical",
    manufacturer: "Generic",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909",
      "Fuso",
      "Journey"
    ],
    base_unit_cost: 42000
  },

  {
    part_name: "Headlamp Assembly",
    part_category: "Electrical",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 15000
  },

  {
    part_name: "Wiper Blade Set",
    part_category: "Body",
    manufacturer: "Generic",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909",
      "Fuso",
      "Journey",
      "ZK Series",
      "XMQ Series"
    ],
    base_unit_cost: 3500
  },

  {
    part_name: "Wheel Bearing",
    part_category: "Suspension",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "LP 1512",
      "Fuso"
    ],
    base_unit_cost: 12500
  },

  {
    part_name: "Shock Absorber",
    part_category: "Suspension",
    manufacturer: "Generic OEM",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909"
    ],
    base_unit_cost: 17500
  },

  {
    part_name: "Tyre",
    part_category: "Tyres",
    manufacturer: "Generic Commercial",
    compatible_bus_models: [
      "Viking",
      "Lynx",
      "LP 1512",
      "LP 909",
      "Fuso",
      "Journey",
      "ZK Series",
      "XMQ Series"
    ],
    base_unit_cost: 72000
  }

];


// =========================================================
// VERIFY TEMPLATE COUNT
// =========================================================

if (
  sparePartTemplates.length !== 20
) {

  throw new Error(
    `Expected 20 spare-part templates but found ${sparePartTemplates.length}.`
  );
}


// =========================================================
// HELPER: STOCK STATUS
// =========================================================

const calculateStockStatus = (
  quantity: number,
  reorderLevel: number
): StockStatus => {

  if (
    quantity <= 0
  ) {

    return "Out of Stock";
  }


  if (
    quantity <= reorderLevel
  ) {

    return "Low Stock";
  }


  return "Available";
};


// =========================================================
// HELPER: QUANTITY
// =========================================================
//
// Produces deliberate inventory variation:
//
// Every 10th part
// → Out of Stock
//
// Every 4th part
// → Low Stock
//
// Remaining
// → Available
//
// =========================================================

const generateQuantity = (
  number: number,
  reorderLevel: number
): number => {

  // Out of Stock
  if (
    number % 10 === 0
  ) {

    return 0;
  }


  // Low Stock
  if (
    number % 4 === 0
  ) {

    return Math.max(
      1,
      reorderLevel - 2
    );
  }


  // Available
  return (
    reorderLevel +
    10 +
    (
      number % 20
    )
  );
};


// =========================================================
// HELPER: LAST RESTOCK DATE
// =========================================================

const generateRestockDate = (
  index: number
): Date => {

  const month =
    index % 9;


  const day =
    1 +
    (
      index % 25
    );


  return new Date(
    2026,
    month,
    day
  );
};


// =========================================================
// SEED SPARE PARTS
// =========================================================

export const seedSpareParts =
  async (): Promise<void> => {

    console.log(
      "Seeding spare parts..."
    );


    // -----------------------------------------------------
    // Read existing Active Depots
    // -----------------------------------------------------

    const activeDepots =
      await Depot
        .find({
          status: "Active"
        })
        .sort({
          depot_id: 1
        });


    if (
      activeDepots.length === 0
    ) {

      throw new Error(
        "Cannot seed spare parts because no active depots exist."
      );
    }


    if (
      activeDepots.length !== 90
    ) {

      throw new Error(
        `Spare-part seed expected 90 active depots but found ${activeDepots.length}.`
      );
    }


    // =====================================================
    // GENERATE EXACTLY 100 DOCUMENTS
    // =====================================================

    const sparePartSeedData:
      ISparePart[] =
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


            // ---------------------------------------------
            // PART ID
            // ---------------------------------------------

            const partId =
              `SP${String(
                number
              ).padStart(
                3,
                "0"
              )}`;


            // ---------------------------------------------
            // Select template
            // ---------------------------------------------

            const template =
              sparePartTemplates[
                index %
                sparePartTemplates.length
              ];


            // ---------------------------------------------
            // Assign existing Active Depot
            // ---------------------------------------------

            const depot =
              activeDepots[
                index %
                activeDepots.length
              ];


            // ---------------------------------------------
            // Reorder Level
            // ---------------------------------------------

            const reorderLevel =
              5 +
              (
                index % 11
              );


            // ---------------------------------------------
            // Quantity
            // ---------------------------------------------

            const quantityInStock =
              generateQuantity(
                number,
                reorderLevel
              );


            // ---------------------------------------------
            // Stock Status
            // ---------------------------------------------

            const stockStatus =
              calculateStockStatus(
                quantityInStock,
                reorderLevel
              );


            // ---------------------------------------------
            // Unit Cost
            // ---------------------------------------------
            //
            // Same type of part has small deterministic
            // cost variation between inventory records.
            //
            // ---------------------------------------------

            const unitCost =
              template.base_unit_cost +
              (
                (
                  index % 5
                ) * 250
              );


            // ---------------------------------------------
            // Supplier
            // ---------------------------------------------

            const supplierNumber =
              (
                index % 8
              ) + 1;


            return {

              part_id:
                partId,

              part_name:
                template.part_name,

              part_category:
                template.part_category,

              manufacturer:
                template.manufacturer,

              compatible_bus_models:
                template.compatible_bus_models,

              depot_id:
                depot.depot_id,

              quantity_in_stock:
                quantityInStock,

              reorder_level:
                reorderLevel,

              unit_cost:
                unitCost,

              supplier_name:
                `Supplier ${String(
                  supplierNumber
                ).padStart(
                  2,
                  "0"
                )}`,

              last_restock_date:
                generateRestockDate(
                  index
                ),

              stock_status:
                stockStatus

            };

          }
        );


    // -----------------------------------------------------
    // Verify generated count
    // -----------------------------------------------------

    if (
      sparePartSeedData.length !==
      100
    ) {

      throw new Error(
        `Spare-part seed requires exactly 100 documents. Generated: ${sparePartSeedData.length}`
      );
    }


    // -----------------------------------------------------
    // Remove existing spare parts
    // -----------------------------------------------------

    await SparePart.deleteMany({});


    // -----------------------------------------------------
    // Insert
    // -----------------------------------------------------

    await SparePart.insertMany(
      sparePartSeedData
    );


    // -----------------------------------------------------
    // Verify count
    // -----------------------------------------------------

    const count =
      await SparePart.countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Spare-part seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    // =====================================================
    // VERIFY DEPOT RELATIONSHIPS
    // =====================================================

    const validDepotIds =
      new Set(
        activeDepots.map(
          depot =>
            depot.depot_id
        )
      );


    const seededParts =
      await SparePart.find();


    const invalidPart =
      seededParts.find(
        part =>
          !validDepotIds.has(
            part.depot_id
          )
      );


    if (
      invalidPart
    ) {

      throw new Error(
        `Spare-part relationship validation failed for ${invalidPart.part_id}. Depot ${invalidPart.depot_id} is invalid.`
      );
    }


    console.log(
      `Spare parts seeded successfully: ${count}`
    );


    console.log(
      `Spare-part relationships verified against ${activeDepots.length} active depots.`
    );

  };