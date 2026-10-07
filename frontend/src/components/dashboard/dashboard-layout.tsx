import {
  Outlet
} from "react-router-dom";

import "@/api/globalFilterInterceptor";

import {
  AppSidebar
} from "@/components/dashboard/app-sidebar";

import {
  GlobalFilterBar
} from "@/components/dashboard/global-filter-bar";

import {
  SiteHeader
} from "@/components/dashboard/site-header";

import {
  GlobalFilterProvider,
  useGlobalFilters
} from "@/context/global-filter-context";

import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";


// =========================================================
// MAIN DASHBOARD LAYOUT
// =========================================================

export function DashboardLayout() {

  return (

    <GlobalFilterProvider>

      <DashboardLayoutContent />

    </GlobalFilterProvider>

  );

}


// =========================================================
// DASHBOARD CONTENT
// =========================================================

function DashboardLayoutContent() {

  const {
    filterKey
  } =
    useGlobalFilters();


  return (

    <SidebarProvider>

      {/* ===================================================
          LEFT NAVIGATION
      =================================================== */}

      <AppSidebar />


      {/* ===================================================
          MAIN APPLICATION AREA
      =================================================== */}

      <SidebarInset>

        {/* =================================================
            HEADER
        ================================================= */}

        <SiteHeader />


        {/* =================================================
            SLTB BRAND STRIP
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            sltb-brand-strip
            h-1
            w-full
            shrink-0
          "
        />


        {/* =================================================
            GLOBAL ANALYTICS FILTERS
        ================================================= */}

        <GlobalFilterBar />


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main
          className="
            flex
            flex-1
            flex-col
            bg-background
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              flex-1
              p-4
              md:p-6
              lg:p-8
            "
          >

            {/*
              Changing the global filter key remounts the
              active dashboard.

              Existing dashboards therefore re-run their
              existing API loading functions automatically.

              The Axios interceptor adds the selected
              global filter query parameters.
            */}

            <div
              key={
                filterKey
              }
            >

              <Outlet />

            </div>

          </div>

        </main>

      </SidebarInset>

    </SidebarProvider>

  );

}