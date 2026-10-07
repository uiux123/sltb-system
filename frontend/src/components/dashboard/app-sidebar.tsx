import {
  Activity,
  BusFront,
  Fuel,
  Gauge,
  LayoutDashboard,
  PackageSearch,
  Route,
  WalletCards,
  Wrench
} from "lucide-react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";


// =========================================================
// SIDEBAR NAVIGATION ITEM TYPE
// =========================================================

interface INavigationItem {

  title: string;

  url: string;

  icon:
    typeof LayoutDashboard;

}


// =========================================================
// SIDEBAR NAVIGATION
// =========================================================

const navigationItems:
  INavigationItem[] = [

    {
      title:
        "Overview",

      url:
        "/",

      icon:
        LayoutDashboard
    },

    {
      title:
        "Fleet",

      url:
        "/fleet",

      icon:
        BusFront
    },

    {
      title:
        "Routes & Trips",

      url:
        "/routes",

      icon:
        Route
    },

    {
      title:
        "Fuel",

      url:
        "/fuel",

      icon:
        Fuel
    },

    {
      title:
        "Revenue",

      url:
        "/revenue",

      icon:
        WalletCards
    },

    {
      title:
        "Maintenance",

      url:
        "/maintenance",

      icon:
        Wrench
    },

    {
      title:
        "Inventory",

      url:
        "/inventory",

      icon:
        PackageSearch
    },

    {
      title:
        "Bus Performance",

      url:
        "/bus-performance",

      icon:
        Gauge
    }

  ];


// =========================================================
// APP SIDEBAR
// =========================================================

export function AppSidebar() {

  // =======================================================
  // REACT ROUTER
  // =======================================================

  const location =
    useLocation();


  const navigate =
    useNavigate();


  // =======================================================
  // NAVIGATE
  // =======================================================

  const handleNavigation =
    (
      url: string
    ): void => {

      navigate(
        url
      );

    };


  return (

    <Sidebar
      collapsible="icon"
      className="
        border-sidebar-border
      "
    >

      {/* ===================================================
          SIDEBAR HEADER
      =================================================== */}

      <SidebarHeader
        className="
          border-b
          border-sidebar-border
          py-3
        "
      >

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              size="lg"
              tooltip="SLTB Decision Analytics"
              className="
                h-auto
                min-h-14
                hover:bg-white/10
                hover:text-white
              "
              onClick={
                () =>
                  handleNavigation(
                    "/"
                  )
              }
            >

              {/* ===========================================
                  REAL SLTB LOGO
              =========================================== */}

              <div
                className="
                  flex
                  h-11
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-md
                  bg-white
                  p-1
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


              {/* ===========================================
                  BRAND
              =========================================== */}

              <div
                className="
                  grid
                  min-w-0
                  flex-1
                  text-left
                  leading-tight
                "
              >

                <span
                  className="
                    truncate
                    text-sm
                    font-bold
                    tracking-wide
                    text-white
                  "
                >
                  SLTB
                </span>


                <span
                  className="
                    truncate
                    text-xs
                    text-white/70
                  "
                >
                  Decision Analytics
                </span>

              </div>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarHeader>


      {/* ===================================================
          SIDEBAR CONTENT
      =================================================== */}

      <SidebarContent>

        <SidebarGroup>

          <SidebarGroupLabel
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white/50
            "
          >
            Analytics
          </SidebarGroupLabel>


          <SidebarGroupContent>

            <SidebarMenu>

              {
                navigationItems.map(
                  item => {

                    const Icon =
                      item.icon;


                    // =====================================
                    // ACTIVE PAGE
                    // =====================================

                    const isActive =

                      item.url === "/"

                        ? location.pathname ===
                          "/"

                        : location.pathname.startsWith(
                            item.url
                          );


                    return (

                      <SidebarMenuItem
                        key={
                          item.url
                        }
                      >

                        <SidebarMenuButton

                          isActive={
                            isActive
                          }

                          tooltip={
                            item.title
                          }

                          className="
                            text-white/80
                            transition-colors
                            hover:bg-white/10
                            hover:text-white
                            data-[active=true]:bg-sidebar-accent
                            data-[active=true]:font-semibold
                            data-[active=true]:text-sidebar-accent-foreground
                          "

                          onClick={
                            () =>
                              handleNavigation(
                                item.url
                              )
                          }

                        >

                          <Icon
                            className={
                              isActive
                                ? "size-4 text-brand-yellow"
                                : "size-4"
                            }
                          />


                          <span>
                            {item.title}
                          </span>

                        </SidebarMenuButton>

                      </SidebarMenuItem>

                    );

                  }
                )
              }

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>


      {/* ===================================================
          SIDEBAR FOOTER
      =================================================== */}

      <SidebarFooter
        className="
          border-t
          border-sidebar-border
        "
      >

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              tooltip="Analytics system"
              className="
                text-white/60
                hover:bg-white/10
                hover:text-white
              "
            >

              <Activity
                className="
                  size-4
                  text-brand-yellow
                "
              />


              <span>
                Analytics System
              </span>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarFooter>


      {/* ===================================================
          SIDEBAR COLLAPSE RAIL
      =================================================== */}

      <SidebarRail />

    </Sidebar>

  );

}