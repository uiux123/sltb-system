// =========================================================
// NUMBER FORMATTER
// =========================================================

export const formatNumber =
  (
    value: number,
    maximumFractionDigits = 0
  ): string => {

    if (
      !Number.isFinite(
        value
      )
    ) {

      return "0";

    }


    return new Intl.NumberFormat(
      "en-LK",
      {
        maximumFractionDigits
      }
    ).format(
      value
    );

  };


// =========================================================
// DECIMAL FORMATTER
// =========================================================

export const formatDecimal =
  (
    value: number,
    decimalPlaces = 2
  ): string => {

    if (
      !Number.isFinite(
        value
      )
    ) {

      return "0";

    }


    return new Intl.NumberFormat(
      "en-LK",
      {
        minimumFractionDigits:
          decimalPlaces,

        maximumFractionDigits:
          decimalPlaces
      }
    ).format(
      value
    );

  };


// =========================================================
// PERCENTAGE FORMATTER
// =========================================================

export const formatPercentage =
  (
    value: number,
    decimalPlaces = 1
  ): string => {

    return `${formatDecimal(
      value,
      decimalPlaces
    )}%`;

  };


// =========================================================
// SRI LANKAN RUPEE FORMATTER
// =========================================================
//
// Explicit "LKR" is used so the dashboard displays the same
// currency label consistently in different browsers.
//
// =========================================================

export const formatCurrency =
  (
    value: number,
    maximumFractionDigits = 0
  ): string => {

    return `LKR ${formatNumber(
      value,
      maximumFractionDigits
    )}`;

  };


// =========================================================
// DISTANCE FORMATTER
// =========================================================

export const formatKilometres =
  (
    value: number,
    decimalPlaces = 1
  ): string => {

    return `${formatNumber(
      value,
      decimalPlaces
    )} km`;

  };


// =========================================================
// HOURS FORMATTER
// =========================================================

export const formatHours =
  (
    value: number,
    decimalPlaces = 1
  ): string => {

    return `${formatNumber(
      value,
      decimalPlaces
    )} hrs`;

  };