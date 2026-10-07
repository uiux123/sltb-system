import type {
  LucideIcon
} from "lucide-react";

import {
  BarChart3,
  Database,
  PanelsTopLeft
} from "lucide-react";

import {
  Badge
} from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


// =========================================================
// PROPS
// =========================================================

interface IPagePlaceholderProps {

  title: string;

  description: string;

  step: string;

  icon: LucideIcon;

}


// =========================================================
// DASHBOARD PAGE PLACEHOLDER
// =========================================================

export function PagePlaceholder(
  {
    title,
    description,
    step,
    icon: Icon
  }: IPagePlaceholderProps
) {

  return (

    <div
      className="
        grid
        gap-6
      "
    >

      {/* ===================================================
          PAGE INTRODUCTION
      =================================================== */}

      <section
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >

        <div>

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                border
                bg-background
              "
            >

              <Icon
                className="size-4"
              />

            </div>


            <Badge
              variant="secondary"
            >
              {
                step
              }
            </Badge>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            {
              title
            }
          </h2>


          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-muted-foreground
            "
          >
            {
              description
            }
          </p>

        </div>

      </section>


      {/* ===================================================
          PLACEHOLDER CARDS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >

        <Card>

          <CardHeader>

            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-muted
              "
            >

              <Database
                className="size-4"
              />

            </div>


            <CardTitle
              className="text-base"
            >
              Backend API
            </CardTitle>


            <CardDescription>
              Analytics endpoint connection is available
              from the Step 2 API layer.
            </CardDescription>

          </CardHeader>

        </Card>


        <Card>

          <CardHeader>

            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-muted
              "
            >

              <BarChart3
                className="size-4"
              />

            </div>


            <CardTitle
              className="text-base"
            >
              Analytics Visuals
            </CardTitle>


            <CardDescription>
              KPI cards and charts will be implemented
              in the dashboard-specific visualization step.
            </CardDescription>

          </CardHeader>

        </Card>


        <Card>

          <CardHeader>

            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-muted
              "
            >

              <PanelsTopLeft
                className="size-4"
              />

            </div>


            <CardTitle
              className="text-base"
            >
              Dashboard Layout
            </CardTitle>


            <CardDescription>
              The shared shadcn dashboard shell and
              navigation are now ready.
            </CardDescription>

          </CardHeader>

        </Card>

      </div>


      {/* ===================================================
          CONTENT AREA PLACEHOLDER
      =================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            {
              title
            } content area
          </CardTitle>


          <CardDescription>
            This area will be replaced by live SLTB
            analytics components in the next visualization
            steps.
          </CardDescription>

        </CardHeader>


        <CardContent>

          <div
            className="
              flex
              min-h-[260px]
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              bg-muted/20
              p-8
              text-center
            "
          >

            <div
              className="
                max-w-md
              "
            >

              <Icon
                className="
                  mx-auto
                  size-10
                  text-muted-foreground
                "
              />


              <p
                className="
                  mt-4
                  font-medium
                "
              >
                Page shell ready
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Live KPI cards, charts and tables will
                be connected to the analytics API in the
                appropriate implementation step.
              </p>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}