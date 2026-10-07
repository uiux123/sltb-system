import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import {
  DashboardLayout
} from "@/components/dashboard/dashboard-layout";

import BusPerformanceDashboard
  from "@/pages/BusPerformanceDashboard";

import FleetDashboard
  from "@/pages/FleetDashboard";

import FuelDashboard
  from "@/pages/FuelDashboard";

import InventoryDashboard
  from "@/pages/InventoryDashboard";

import MaintenanceDashboard
  from "@/pages/MaintenanceDashboard";

import OverviewDashboard
  from "@/pages/OverviewDashboard";

import RevenueDashboard
  from "@/pages/RevenueDashboard";

import RouteDashboard
  from "@/pages/RouteDashboard";


// =========================================================
// APPLICATION ROUTES
// =========================================================

function App() {

  return (

    <Routes>

      {/* ===================================================
          DASHBOARD LAYOUT
      =================================================== */}

      <Route
        element={
          <DashboardLayout />
        }
      >

        {/* =================================================
            OVERVIEW
        ================================================= */}

        <Route
          path="/"
          element={
            <OverviewDashboard />
          }
        />


        {/* =================================================
            FLEET
        ================================================= */}

        <Route
          path="/fleet"
          element={
            <FleetDashboard />
          }
        />


        {/* =================================================
            ROUTES & TRIPS
        ================================================= */}

        <Route
          path="/routes"
          element={
            <RouteDashboard />
          }
        />


        {/* =================================================
            FUEL
        ================================================= */}

        <Route
          path="/fuel"
          element={
            <FuelDashboard />
          }
        />


        {/* =================================================
            REVENUE
        ================================================= */}

        <Route
          path="/revenue"
          element={
            <RevenueDashboard />
          }
        />


        {/* =================================================
            MAINTENANCE
        ================================================= */}

        <Route
          path="/maintenance"
          element={
            <MaintenanceDashboard />
          }
        />


        {/* =================================================
            INVENTORY
        ================================================= */}

        <Route
          path="/inventory"
          element={
            <InventoryDashboard />
          }
        />


        {/* =================================================
            INTEGRATED BUS PERFORMANCE
        ================================================= */}

        <Route
          path="/bus-performance"
          element={
            <BusPerformanceDashboard />
          }
        />

      </Route>


      {/* ===================================================
          UNKNOWN ROUTE
      =================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );

}


export default App;