import Depot
  from "../models/depot.model";

import {
  CreateDepotInput
} from "../types/depot.types";


// =========================================================
// REAL SRI LANKAN LOCATIONS
// =========================================================
//
// IMPORTANT:
//
// These are synthetic application records based on real
// Sri Lankan locations.
//
// total_staff and monthly_fixed_cost are synthetic values
// created for testing and decision analytics.
//
// They should NOT be presented as official SLTB statistics.
//
// =========================================================

interface DepotLocation {
  location: string;
  region: string;
}


const depotLocations: DepotLocation[] = [

  // =======================================================
  // WESTERN PROVINCE - 16
  // =======================================================

  {
    location: "Colombo",
    region: "Western Province"
  },
  {
    location: "Pettah",
    region: "Western Province"
  },
  {
    location: "Moratuwa",
    region: "Western Province"
  },
  {
    location: "Dehiwala",
    region: "Western Province"
  },
  {
    location: "Maharagama",
    region: "Western Province"
  },
  {
    location: "Homagama",
    region: "Western Province"
  },
  {
    location: "Kaduwela",
    region: "Western Province"
  },
  {
    location: "Avissawella",
    region: "Western Province"
  },
  {
    location: "Gampaha",
    region: "Western Province"
  },
  {
    location: "Negombo",
    region: "Western Province"
  },
  {
    location: "Ja-Ela",
    region: "Western Province"
  },
  {
    location: "Wattala",
    region: "Western Province"
  },
  {
    location: "Kelaniya",
    region: "Western Province"
  },
  {
    location: "Minuwangoda",
    region: "Western Province"
  },
  {
    location: "Kalutara",
    region: "Western Province"
  },
  {
    location: "Panadura",
    region: "Western Province"
  },


  // =======================================================
  // CENTRAL PROVINCE - 12
  // =======================================================

  {
    location: "Kandy",
    region: "Central Province"
  },
  {
    location: "Peradeniya",
    region: "Central Province"
  },
  {
    location: "Katugastota",
    region: "Central Province"
  },
  {
    location: "Gampola",
    region: "Central Province"
  },
  {
    location: "Nawalapitiya",
    region: "Central Province"
  },
  {
    location: "Matale",
    region: "Central Province"
  },
  {
    location: "Dambulla",
    region: "Central Province"
  },
  {
    location: "Nuwara Eliya",
    region: "Central Province"
  },
  {
    location: "Hatton",
    region: "Central Province"
  },
  {
    location: "Talawakele",
    region: "Central Province"
  },
  {
    location: "Rikillagaskada",
    region: "Central Province"
  },
  {
    location: "Akurana",
    region: "Central Province"
  },


  // =======================================================
  // SOUTHERN PROVINCE - 12
  // =======================================================

  {
    location: "Galle",
    region: "Southern Province"
  },
  {
    location: "Ambalangoda",
    region: "Southern Province"
  },
  {
    location: "Elpitiya",
    region: "Southern Province"
  },
  {
    location: "Hikkaduwa",
    region: "Southern Province"
  },
  {
    location: "Matara",
    region: "Southern Province"
  },
  {
    location: "Weligama",
    region: "Southern Province"
  },
  {
    location: "Akuressa",
    region: "Southern Province"
  },
  {
    location: "Hakmana",
    region: "Southern Province"
  },
  {
    location: "Tangalle",
    region: "Southern Province"
  },
  {
    location: "Hambantota",
    region: "Southern Province"
  },
  {
    location: "Tissamaharama",
    region: "Southern Province"
  },
  {
    location: "Beliatta",
    region: "Southern Province"
  },


  // =======================================================
  // NORTHERN PROVINCE - 10
  // =======================================================

  {
    location: "Jaffna",
    region: "Northern Province"
  },
  {
    location: "Point Pedro",
    region: "Northern Province"
  },
  {
    location: "Chavakachcheri",
    region: "Northern Province"
  },
  {
    location: "Kilinochchi",
    region: "Northern Province"
  },
  {
    location: "Mullaitivu",
    region: "Northern Province"
  },
  {
    location: "Vavuniya",
    region: "Northern Province"
  },
  {
    location: "Mannar",
    region: "Northern Province"
  },
  {
    location: "Nelliady",
    region: "Northern Province"
  },
  {
    location: "Mankulam",
    region: "Northern Province"
  },
  {
    location: "Murunkan",
    region: "Northern Province"
  },


  // =======================================================
  // EASTERN PROVINCE - 10
  // =======================================================

  {
    location: "Trincomalee",
    region: "Eastern Province"
  },
  {
    location: "Kantale",
    region: "Eastern Province"
  },
  {
    location: "Kinniya",
    region: "Eastern Province"
  },
  {
    location: "Batticaloa",
    region: "Eastern Province"
  },
  {
    location: "Eravur",
    region: "Eastern Province"
  },
  {
    location: "Kalmunai",
    region: "Eastern Province"
  },
  {
    location: "Akkaraipattu",
    region: "Eastern Province"
  },
  {
    location: "Ampara",
    region: "Eastern Province"
  },
  {
    location: "Pottuvil",
    region: "Eastern Province"
  },
  {
    location: "Sammanthurai",
    region: "Eastern Province"
  },


  // =======================================================
  // NORTH WESTERN PROVINCE - 12
  // =======================================================

  {
    location: "Kurunegala",
    region: "North Western Province"
  },
  {
    location: "Kuliyapitiya",
    region: "North Western Province"
  },
  {
    location: "Narammala",
    region: "North Western Province"
  },
  {
    location: "Wariyapola",
    region: "North Western Province"
  },
  {
    location: "Polgahawela",
    region: "North Western Province"
  },
  {
    location: "Pannala",
    region: "North Western Province"
  },
  {
    location: "Nikaweratiya",
    region: "North Western Province"
  },
  {
    location: "Maho",
    region: "North Western Province"
  },
  {
    location: "Puttalam",
    region: "North Western Province"
  },
  {
    location: "Chilaw",
    region: "North Western Province"
  },
  {
    location: "Wennappuwa",
    region: "North Western Province"
  },
  {
    location: "Anamaduwa",
    region: "North Western Province"
  },


  // =======================================================
  // NORTH CENTRAL PROVINCE - 8
  // =======================================================

  {
    location: "Anuradhapura",
    region: "North Central Province"
  },
  {
    location: "Kekirawa",
    region: "North Central Province"
  },
  {
    location: "Medawachchiya",
    region: "North Central Province"
  },
  {
    location: "Tambuttegama",
    region: "North Central Province"
  },
  {
    location: "Polonnaruwa",
    region: "North Central Province"
  },
  {
    location: "Hingurakgoda",
    region: "North Central Province"
  },
  {
    location: "Medirigiriya",
    region: "North Central Province"
  },
  {
    location: "Habarana",
    region: "North Central Province"
  },


  // =======================================================
  // UVA PROVINCE - 10
  // =======================================================

  {
    location: "Badulla",
    region: "Uva Province"
  },
  {
    location: "Bandarawela",
    region: "Uva Province"
  },
  {
    location: "Welimada",
    region: "Uva Province"
  },
  {
    location: "Mahiyanganaya",
    region: "Uva Province"
  },
  {
    location: "Passara",
    region: "Uva Province"
  },
  {
    location: "Hali Ela",
    region: "Uva Province"
  },
  {
    location: "Monaragala",
    region: "Uva Province"
  },
  {
    location: "Wellawaya",
    region: "Uva Province"
  },
  {
    location: "Bibile",
    region: "Uva Province"
  },
  {
    location: "Buttala",
    region: "Uva Province"
  },


  // =======================================================
  // SABARAGAMUWA PROVINCE - 10
  // =======================================================

  {
    location: "Ratnapura",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Balangoda",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Embilipitiya",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Pelmadulla",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Eheliyagoda",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Kalawana",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Kegalle",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Mawanella",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Warakapola",
    region: "Sabaragamuwa Province"
  },
  {
    location: "Ruwanwella",
    region: "Sabaragamuwa Province"
  }

];


// =========================================================
// VALIDATE LOCATION COUNT
// =========================================================

if (
  depotLocations.length !== 100
) {

  throw new Error(
    `Depot seed requires exactly 100 locations. Current count: ${depotLocations.length}`
  );
}


// =========================================================
// GENERATE 100 DEPOT DOCUMENTS
// =========================================================

const depotSeedData:
  CreateDepotInput[] =
    depotLocations.map(
      (
        depot,
        index
      ) => {

        const number =
          index + 1;


        const depotId =
          `DEP${String(
            number
          ).padStart(
            3,
            "0"
          )}`;


        // -------------------------------------------------
        // Deterministic synthetic staff numbers
        // Range approximately 45 - 220
        // -------------------------------------------------

        const totalStaff =
          45 +
          (
            (
              index * 17
            ) % 176
          );


        // -------------------------------------------------
        // Deterministic synthetic monthly fixed cost
        //
        // Range approximately:
        // LKR 1.5 million - 6.0 million
        // -------------------------------------------------

        const monthlyFixedCost =
          1_500_000 +
          (
            (
              index * 375_000
            ) %
            4_500_000
          );


        // Every 10th record is inactive.
        //
        // Gives:
        // Active   = 90
        // Inactive = 10
        const status =
          number % 10 === 0
            ? "Inactive"
            : "Active";


        return {

          depot_id:
            depotId,

          depot_name:
            `${depot.location} Depot`,

          region:
            depot.region,

          location:
            depot.location,

          total_staff:
            totalStaff,

          monthly_fixed_cost:
            monthlyFixedCost,

          status

        };

      }
    );


// =========================================================
// SEED DEPOTS
// =========================================================

export const seedDepots =
  async (): Promise<void> => {

    console.log(
      "Seeding depots..."
    );


    // -----------------------------------------------------
    // Remove existing depot documents
    // -----------------------------------------------------

    await Depot.deleteMany({});


    // -----------------------------------------------------
    // Insert exactly 100 documents
    // -----------------------------------------------------

    await Depot.insertMany(
      depotSeedData
    );


    // -----------------------------------------------------
    // Verify count
    // -----------------------------------------------------

    const count =
      await Depot.countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Depot seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    console.log(
      `Depots seeded successfully: ${count}`
    );

  };