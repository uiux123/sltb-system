import Route
  from "../models/route.model";

import {
  CreateRouteInput,
  RouteType
} from "../types/route.types";


// =========================================================
// ROUTE SEED SOURCE
// =========================================================
//
// Real Sri Lankan locations are used.
//
// Distances, fares, frequencies and social-service flags
// are synthetic values for development and analytics.
//
// They are NOT official SLTB operational statistics.
//
// =========================================================

interface RouteSeedSource {
  origin: string;
  destination: string;
  distance_km: number;
  route_type: RouteType;
}


const routeSources:
  RouteSeedSource[] = [

  // =======================================================
  // WESTERN / COLOMBO AREA
  // =======================================================

  {
    origin: "Colombo",
    destination: "Negombo",
    distance_km: 38,
    route_type: "Intercity"
  },
  {
    origin: "Colombo",
    destination: "Gampaha",
    distance_km: 30,
    route_type: "Intercity"
  },
  {
    origin: "Colombo",
    destination: "Kalutara",
    distance_km: 43,
    route_type: "Intercity"
  },
  {
    origin: "Colombo",
    destination: "Panadura",
    distance_km: 27,
    route_type: "Urban"
  },
  {
    origin: "Colombo",
    destination: "Moratuwa",
    distance_km: 22,
    route_type: "Urban"
  },
  {
    origin: "Colombo",
    destination: "Maharagama",
    distance_km: 18,
    route_type: "Urban"
  },
  {
    origin: "Colombo",
    destination: "Homagama",
    distance_km: 24,
    route_type: "Urban"
  },
  {
    origin: "Colombo",
    destination: "Kaduwela",
    distance_km: 20,
    route_type: "Urban"
  },
  {
    origin: "Colombo",
    destination: "Avissawella",
    distance_km: 55,
    route_type: "Intercity"
  },
  {
    origin: "Negombo",
    destination: "Gampaha",
    distance_km: 26,
    route_type: "Urban"
  },
  {
    origin: "Negombo",
    destination: "Ja-Ela",
    distance_km: 20,
    route_type: "Urban"
  },
  {
    origin: "Ja-Ela",
    destination: "Colombo",
    distance_km: 24,
    route_type: "Urban"
  },


  // =======================================================
  // CENTRAL PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Kandy",
    distance_km: 116,
    route_type: "Intercity"
  },
  {
    origin: "Kandy",
    destination: "Matale",
    distance_km: 26,
    route_type: "Intercity"
  },
  {
    origin: "Kandy",
    destination: "Gampola",
    distance_km: 21,
    route_type: "Urban"
  },
  {
    origin: "Kandy",
    destination: "Nawalapitiya",
    distance_km: 39,
    route_type: "Intercity"
  },
  {
    origin: "Kandy",
    destination: "Nuwara Eliya",
    distance_km: 77,
    route_type: "Intercity"
  },
  {
    origin: "Kandy",
    destination: "Dambulla",
    distance_km: 72,
    route_type: "Intercity"
  },
  {
    origin: "Peradeniya",
    destination: "Kandy",
    distance_km: 7,
    route_type: "Urban"
  },
  {
    origin: "Katugastota",
    destination: "Kandy",
    distance_km: 6,
    route_type: "Urban"
  },
  {
    origin: "Nuwara Eliya",
    destination: "Hatton",
    distance_km: 40,
    route_type: "Intercity"
  },
  {
    origin: "Hatton",
    destination: "Talawakele",
    distance_km: 26,
    route_type: "Rural"
  },
  {
    origin: "Matale",
    destination: "Dambulla",
    distance_km: 48,
    route_type: "Intercity"
  },
  {
    origin: "Gampola",
    destination: "Nawalapitiya",
    distance_km: 17,
    route_type: "Urban"
  },


  // =======================================================
  // SOUTHERN PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Galle",
    distance_km: 119,
    route_type: "Intercity"
  },
  {
    origin: "Colombo",
    destination: "Matara",
    distance_km: 160,
    route_type: "Intercity"
  },
  {
    origin: "Galle",
    destination: "Matara",
    distance_km: 45,
    route_type: "Intercity"
  },
  {
    origin: "Galle",
    destination: "Ambalangoda",
    distance_km: 33,
    route_type: "Urban"
  },
  {
    origin: "Galle",
    destination: "Hikkaduwa",
    distance_km: 18,
    route_type: "Urban"
  },
  {
    origin: "Ambalangoda",
    destination: "Elpitiya",
    distance_km: 27,
    route_type: "Rural"
  },
  {
    origin: "Matara",
    destination: "Weligama",
    distance_km: 17,
    route_type: "Urban"
  },
  {
    origin: "Matara",
    destination: "Akuressa",
    distance_km: 22,
    route_type: "Rural"
  },
  {
    origin: "Matara",
    destination: "Hakmana",
    distance_km: 24,
    route_type: "Rural"
  },
  {
    origin: "Matara",
    destination: "Tangalle",
    distance_km: 35,
    route_type: "Intercity"
  },
  {
    origin: "Tangalle",
    destination: "Hambantota",
    distance_km: 47,
    route_type: "Intercity"
  },
  {
    origin: "Hambantota",
    destination: "Tissamaharama",
    distance_km: 29,
    route_type: "Rural"
  },


  // =======================================================
  // NORTHERN PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Jaffna",
    distance_km: 397,
    route_type: "Intercity"
  },
  {
    origin: "Jaffna",
    destination: "Point Pedro",
    distance_km: 32,
    route_type: "Intercity"
  },
  {
    origin: "Jaffna",
    destination: "Chavakachcheri",
    distance_km: 20,
    route_type: "Urban"
  },
  {
    origin: "Jaffna",
    destination: "Kilinochchi",
    distance_km: 69,
    route_type: "Intercity"
  },
  {
    origin: "Kilinochchi",
    destination: "Mullaitivu",
    distance_km: 59,
    route_type: "Rural"
  },
  {
    origin: "Vavuniya",
    destination: "Kilinochchi",
    distance_km: 97,
    route_type: "Intercity"
  },
  {
    origin: "Vavuniya",
    destination: "Mannar",
    distance_km: 84,
    route_type: "Intercity"
  },
  {
    origin: "Jaffna",
    destination: "Vavuniya",
    distance_km: 145,
    route_type: "Intercity"
  },
  {
    origin: "Mannar",
    destination: "Murunkan",
    distance_km: 31,
    route_type: "Rural"
  },
  {
    origin: "Kilinochchi",
    destination: "Mankulam",
    distance_km: 42,
    route_type: "Rural"
  },


  // =======================================================
  // EASTERN PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Trincomalee",
    distance_km: 257,
    route_type: "Intercity"
  },
  {
    origin: "Trincomalee",
    destination: "Kantale",
    distance_km: 40,
    route_type: "Intercity"
  },
  {
    origin: "Trincomalee",
    destination: "Kinniya",
    distance_km: 18,
    route_type: "Urban"
  },
  {
    origin: "Batticaloa",
    destination: "Eravur",
    distance_km: 15,
    route_type: "Urban"
  },
  {
    origin: "Batticaloa",
    destination: "Kalmunai",
    distance_km: 41,
    route_type: "Intercity"
  },
  {
    origin: "Kalmunai",
    destination: "Akkaraipattu",
    distance_km: 28,
    route_type: "Intercity"
  },
  {
    origin: "Akkaraipattu",
    destination: "Pottuvil",
    distance_km: 50,
    route_type: "Rural"
  },
  {
    origin: "Ampara",
    destination: "Kalmunai",
    distance_km: 45,
    route_type: "Intercity"
  },
  {
    origin: "Ampara",
    destination: "Sammanthurai",
    distance_km: 34,
    route_type: "Rural"
  },
  {
    origin: "Batticaloa",
    destination: "Trincomalee",
    distance_km: 111,
    route_type: "Intercity"
  },


  // =======================================================
  // NORTH WESTERN PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Kurunegala",
    distance_km: 94,
    route_type: "Intercity"
  },
  {
    origin: "Kurunegala",
    destination: "Kuliyapitiya",
    distance_km: 38,
    route_type: "Intercity"
  },
  {
    origin: "Kurunegala",
    destination: "Wariyapola",
    distance_km: 24,
    route_type: "Rural"
  },
  {
    origin: "Kurunegala",
    destination: "Polgahawela",
    distance_km: 21,
    route_type: "Urban"
  },
  {
    origin: "Kurunegala",
    destination: "Narammala",
    distance_km: 27,
    route_type: "Rural"
  },
  {
    origin: "Kuliyapitiya",
    destination: "Pannala",
    distance_km: 27,
    route_type: "Rural"
  },
  {
    origin: "Kurunegala",
    destination: "Nikaweratiya",
    distance_km: 48,
    route_type: "Rural"
  },
  {
    origin: "Nikaweratiya",
    destination: "Maho",
    distance_km: 34,
    route_type: "Rural"
  },
  {
    origin: "Colombo",
    destination: "Puttalam",
    distance_km: 135,
    route_type: "Intercity"
  },
  {
    origin: "Puttalam",
    destination: "Chilaw",
    distance_km: 52,
    route_type: "Intercity"
  },
  {
    origin: "Chilaw",
    destination: "Wennappuwa",
    distance_km: 28,
    route_type: "Urban"
  },
  {
    origin: "Puttalam",
    destination: "Anamaduwa",
    distance_km: 28,
    route_type: "Rural"
  },


  // =======================================================
  // NORTH CENTRAL PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Anuradhapura",
    distance_km: 205,
    route_type: "Intercity"
  },
  {
    origin: "Anuradhapura",
    destination: "Kekirawa",
    distance_km: 43,
    route_type: "Intercity"
  },
  {
    origin: "Anuradhapura",
    destination: "Medawachchiya",
    distance_km: 27,
    route_type: "Rural"
  },
  {
    origin: "Anuradhapura",
    destination: "Tambuttegama",
    distance_km: 26,
    route_type: "Rural"
  },
  {
    origin: "Anuradhapura",
    destination: "Polonnaruwa",
    distance_km: 105,
    route_type: "Intercity"
  },
  {
    origin: "Polonnaruwa",
    destination: "Hingurakgoda",
    distance_km: 17,
    route_type: "Urban"
  },
  {
    origin: "Polonnaruwa",
    destination: "Medirigiriya",
    distance_km: 37,
    route_type: "Rural"
  },
  {
    origin: "Habarana",
    destination: "Polonnaruwa",
    distance_km: 49,
    route_type: "Intercity"
  },


  // =======================================================
  // UVA PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Badulla",
    distance_km: 230,
    route_type: "Intercity"
  },
  {
    origin: "Badulla",
    destination: "Bandarawela",
    distance_km: 29,
    route_type: "Intercity"
  },
  {
    origin: "Badulla",
    destination: "Passara",
    distance_km: 19,
    route_type: "Rural"
  },
  {
    origin: "Badulla",
    destination: "Hali Ela",
    distance_km: 9,
    route_type: "Urban"
  },
  {
    origin: "Bandarawela",
    destination: "Welimada",
    distance_km: 26,
    route_type: "Rural"
  },
  {
    origin: "Badulla",
    destination: "Mahiyanganaya",
    distance_km: 70,
    route_type: "Intercity"
  },
  {
    origin: "Monaragala",
    destination: "Wellawaya",
    distance_km: 34,
    route_type: "Rural"
  },
  {
    origin: "Monaragala",
    destination: "Bibile",
    distance_km: 40,
    route_type: "Rural"
  },
  {
    origin: "Monaragala",
    destination: "Buttala",
    distance_km: 18,
    route_type: "Rural"
  },
  {
    origin: "Wellawaya",
    destination: "Badulla",
    distance_km: 58,
    route_type: "Intercity"
  },


  // =======================================================
  // SABARAGAMUWA PROVINCE
  // =======================================================

  {
    origin: "Colombo",
    destination: "Ratnapura",
    distance_km: 101,
    route_type: "Intercity"
  },
  {
    origin: "Ratnapura",
    destination: "Balangoda",
    distance_km: 45,
    route_type: "Intercity"
  },
  {
    origin: "Ratnapura",
    destination: "Pelmadulla",
    distance_km: 22,
    route_type: "Urban"
  },
  {
    origin: "Ratnapura",
    destination: "Embilipitiya",
    distance_km: 74,
    route_type: "Intercity"
  },
  {
    origin: "Ratnapura",
    destination: "Eheliyagoda",
    distance_km: 38,
    route_type: "Intercity"
  },
  {
    origin: "Ratnapura",
    destination: "Kalawana",
    distance_km: 45,
    route_type: "Rural"
  },
  {
    origin: "Colombo",
    destination: "Kegalle",
    distance_km: 78,
    route_type: "Intercity"
  },
  {
    origin: "Kegalle",
    destination: "Mawanella",
    distance_km: 24,
    route_type: "Urban"
  },
  {
    origin: "Kegalle",
    destination: "Warakapola",
    distance_km: 25,
    route_type: "Urban"
  },
  {
    origin: "Kegalle",
    destination: "Ruwanwella",
    distance_km: 37,
    route_type: "Rural"
  },
    {
    origin: "Badulla",
    destination: "Monaragala",
    distance_km: 91,
    route_type: "Intercity"
  },
  {
    origin: "Colombo",
    destination: "Chilaw",
    distance_km: 80,
    route_type: "Intercity"
  },
  {
    origin: "Kandy",
    destination: "Kegalle",
    distance_km: 74,
    route_type: "Intercity"
  },
  {
    origin: "Anuradhapura",
    destination: "Vavuniya",
    distance_km: 55,
    route_type: "Intercity"
  }

];


// =========================================================
// VERIFY EXACTLY 100 SOURCE ROUTES
// =========================================================

if (
  routeSources.length !== 100
) {

  throw new Error(
    `Route seed requires exactly 100 routes. Current count: ${routeSources.length}`
  );
}


// =========================================================
// HELPER: CALCULATE SYNTHETIC AVERAGE FARE
// =========================================================
//
// This is not an official fare calculation.
//
// It creates deterministic values suitable for:
//
// - revenue analytics
// - route comparison
// - ticket-sales testing
//
// =========================================================

const calculateAverageFare = (
  distanceKm: number
): number => {

  const calculatedFare =
    35 +
    (
      distanceKm * 6.25
    );


  // Round to nearest 10 LKR.
  return Math.max(
    40,
    Math.round(
      calculatedFare / 10
    ) * 10
  );
};


// =========================================================
// HELPER: SCHEDULED TRIPS PER DAY
// =========================================================

const calculateTripsPerDay = (
  distanceKm: number,
  routeType: RouteType,
  index: number
): number => {

  if (
    routeType === "Urban"
  ) {

    return (
      12 +
      (
        index % 13
      )
    );
  }


  if (
    routeType === "Rural"
  ) {

    return (
      4 +
      (
        index % 7
      )
    );
  }


  if (
    distanceKm >= 200
  ) {

    return (
      2 +
      (
        index % 3
      )
    );
  }


  if (
    distanceKm >= 100
  ) {

    return (
      4 +
      (
        index % 5
      )
    );
  }


  return (
    6 +
    (
      index % 7
    )
  );
};


// =========================================================
// GENERATE 100 ROUTE DOCUMENTS
// =========================================================

const routeSeedData:
  CreateRouteInput[] =
    routeSources.map(
      (
        route,
        index
      ) => {

        const number =
          index + 1;


        const routeId =
          `R${String(
            number
          ).padStart(
            3,
            "0"
          )}`;


        const routeNumber =
          `SLTB-${String(
            number
          ).padStart(
            3,
            "0"
          )}`;


        // Around one fifth of routes are marked
        // as social-service routes.
        const socialServiceRoute =
          number % 5 === 0;


        // Keep a small number inactive so dashboard
        // analytics have useful status variation.
        const status =
          number % 20 === 0
            ? "Inactive"
            : "Active";


        return {

          route_id:
            routeId,

          route_number:
            routeNumber,

          origin:
            route.origin,

          destination:
            route.destination,

          distance_km:
            route.distance_km,

          route_type:
            route.route_type,

          scheduled_trips_per_day:
            calculateTripsPerDay(
              route.distance_km,
              route.route_type,
              index
            ),

          average_fare:
            calculateAverageFare(
              route.distance_km
            ),

          social_service_route:
            socialServiceRoute,

          status

        };

      }
    );


// =========================================================
// SEED ROUTES
// =========================================================

export const seedRoutes =
  async (): Promise<void> => {

    console.log(
      "Seeding routes..."
    );


    // -----------------------------------------------------
    // Remove any existing routes
    // -----------------------------------------------------

    await Route.deleteMany({});


    // -----------------------------------------------------
    // Insert exactly 100 routes
    // -----------------------------------------------------

    await Route.insertMany(
      routeSeedData
    );


    // -----------------------------------------------------
    // Verify total count
    // -----------------------------------------------------

    const count =
      await Route.countDocuments();


    if (
      count !== 100
    ) {

      throw new Error(
        `Route seeding failed. Expected 100 documents but found ${count}.`
      );
    }


    console.log(
      `Routes seeded successfully: ${count}`
    );

  };