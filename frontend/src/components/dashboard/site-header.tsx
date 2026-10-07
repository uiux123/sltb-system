import {
  BarChart3
} from "lucide-react";

import {
  useLocation
} from "react-router-dom";

import {
  Badge
} from "@/components/ui/badge";

import {
  Separator
} from "@/components/ui/separator";

import {
  SidebarTrigger
} from "@/components/ui/sidebar";


// =========================================================
// PAGE INFORMATION
// =========================================================

interface IPageInformation {

  title: string;

  description: string;

}


// =========================================================
// GET PAGE INFORMATION
// =========================================================

const getPageInformation =
  (
    pathname: string
  ): IPageInformation => {

    switch (
      pathname
    ) {

      // ===================================================
      // OVERVIEW
      // ===================================================

      case "/":

        return {

          title:
            "Overview",

          description:
            "SLTB operational decision analytics overview"

        };


      // ===================================================
      // FLEET
      // ===================================================

      case "/fleet":

        return {

          title:
            "Fleet Analytics",

          description:
            "Fleet availability, status and vehicle analysis"

        };


      // ===================================================
      // ROUTES & TRIPS
      // ===================================================

      case "/routes":

        return {

          title:
            "Routes & Trips",

          description:
            "Passenger, route, delay and trip analytics"

        };


      // ===================================================
      // FUEL
      // ===================================================

      case "/fuel":

        return {

          title:
            "Fuel Analytics",

          description:
            "Fuel consumption, expenditure and efficiency"

        };


      // ===================================================
      // REVENUE
      // ===================================================

      case "/revenue":

        return {

          title:
            "Revenue Analytics",

          description:
            "Ticket sales and revenue performance"

        };


      // ===================================================
      // MAINTENANCE
      // ===================================================

      case "/maintenance":

        return {

          title:
            "Maintenance Analytics",

          description:
            "Maintenance cost, faults and downtime"

        };


      // ===================================================
      // INVENTORY
      // ===================================================

      case "/inventory":

        return {

          title:
            "Inventory Analytics",

          description:
            "Spare-parts stock and usage analytics"

        };


      // ===================================================
      // BUS PERFORMANCE
      // ===================================================

      case "/bus-performance":

        return {

          title:
            "Integrated Bus Performance",

          description:
            "Cross-collection bus performance analysis"

        };


      // ===================================================
      // DEFAULT
      // ===================================================

      default:

        return {

          title:
            "SLTB Decision Analytics",

          description:
            "Operational analytics dashboard"

        };

    }

  };


// =========================================================
// SITE HEADER
// =========================================================

export function SiteHeader() {

  // =======================================================
  // ROUTER
  // =======================================================

  const location =
    useLocation();


  // =======================================================
  // CURRENT PAGE INFORMATION
  // =======================================================

  const page =
    getPageInformation(
      location.pathname
    );


  return (

    <header
      className="
        sticky
        top-0
        z-30
        flex
        min-h-[72px]
        shrink-0
        items-center
        border-b
        bg-card/95
        shadow-sm
        backdrop-blur
        supports-[backdrop-filter]:bg-card/90
      "
    >

      <div
        className="
          flex
          w-full
          items-center
          gap-3
          px-4
          md:px-6
        "
      >

        {/* =================================================
            SIDEBAR TRIGGER
        ================================================= */}

        <SidebarTrigger
          className="
            -ml-1
            text-brand-blue
            hover:bg-brand-blue/10
            hover:text-brand-red
            dark:text-white
            dark:hover:bg-white/10
          "
        />


        <Separator
          orientation="vertical"
          className="
            h-7
            bg-border
          "
        />


        {/* =================================================
            SLTB BRAND
        ================================================= */}

        <div
          className="
            hidden
            shrink-0
            items-center
            gap-3
            lg:flex
          "
        >

          {/* ===============================================
              LOGO
          =============================================== */}

          <div
            className="
              flex
              h-11
              w-14
              items-center
              justify-center
              overflow-hidden
              rounded-md
              border
              bg-white
              p-1
              shadow-sm
            "
          >

            <img
              src="/sltb-logo.png"
              alt="Sri Lanka Transport Board"
              className="
                h-full
                w-full
                object-contain
              "
            />

          </div>


          {/* ===============================================
              ORGANIZATION NAME
          =============================================== */}

          <div
            className="
              hidden
              min-w-0
              xl:block
            "
          >

            <p
              className="
                truncate
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-brand-red
              "
            >
              Sri Lanka Transport Board
            </p>


            <p
              className="
                truncate
                text-sm
                font-bold
                tracking-tight
                text-brand-blue
                dark:text-white
              "
            >
              Decision Analytics System
            </p>

          </div>

        </div>


        {/* =================================================
            DIVIDER
        ================================================= */}

        <Separator
          orientation="vertical"
          className="
            hidden
            h-8
            lg:block
          "
        />


        {/* =================================================
            CURRENT PAGE
        ================================================= */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              aria-hidden="true"
              className="
                hidden
                h-5
                w-1
                rounded-full
                bg-brand-yellow
                sm:block
              "
            />


            <h1
              className="
                truncate
                text-base
                font-bold
                tracking-tight
                text-brand-blue
                md:text-lg
                dark:text-white
              "
            >
              {
                page.title
              }
            </h1>

          </div>


          <p
            className="
              mt-0.5
              hidden
              truncate
              text-xs
              text-muted-foreground
              sm:block
            "
          >
            {
              page.description
            }
          </p>

        </div>


        {/* =================================================
            DECISION SUPPORT BADGE
        ================================================= */}

        <Badge
          variant="outline"
          className="
            hidden
            gap-1.5
            border-brand-blue/20
            bg-brand-blue/5
            px-3
            py-1.5
            font-medium
            text-brand-blue
            lg:flex
            dark:border-white/15
            dark:bg-white/5
            dark:text-white
          "
        >

          <BarChart3
            className="
              size-3.5
              text-brand-red
            "
          />

          Decision Support

        </Badge>


        {/* =================================================
            BRAND ACCENT
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            hidden
            items-center
            gap-1
            xl:flex
          "
        >

          <span
            className="
              size-2
              rounded-full
              bg-brand-red
            "
          />

          <span
            className="
              size-2
              rounded-full
              bg-brand-blue
            "
          />

          <span
            className="
              size-2
              rounded-full
              bg-brand-yellow
            "
          />

        </div>

      </div>

    </header>

  );

}