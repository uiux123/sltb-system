// =========================================================
// FRONTEND ENVIRONMENT CONFIGURATION
// =========================================================

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL;


// =========================================================
// VALIDATE REQUIRED ENVIRONMENT VARIABLE
// =========================================================

if (
  !apiBaseUrl
) {

  throw new Error(
    "VITE_API_BASE_URL is not configured."
  );

}


// =========================================================
// APPLICATION CONFIGURATION
// =========================================================

export const appConfig = {

  apiBaseUrl

};