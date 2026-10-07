// =========================================================
// GENERIC API SUCCESS RESPONSE
// =========================================================

export interface IApiSuccessResponse<T> {

  success: true;

  message: string;

  count?: number;

  data: T;

}


// =========================================================
// GENERIC API ERROR RESPONSE
// =========================================================

export interface IApiErrorResponse {

  success: false;

  message: string;

  error?: string;

}