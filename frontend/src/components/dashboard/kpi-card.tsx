import type {
  LucideIcon
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


// =========================================================
// KPI CARD PROPS
// =========================================================

interface IKpiCardProps {

  title: string;

  value: string;

  description: string;

  icon: LucideIcon;

}


// =========================================================
// KPI CARD
// =========================================================

export function KpiCard(
  {
    title,
    value,
    description,
    icon: Icon
  }: IKpiCardProps
) {

  return (

    <Card
      className="
        sltb-card
        relative
        overflow-hidden
        border-t-[3px]
        border-t-primary
        bg-card
      "
    >

      {/* ===================================================
          YELLOW DETAIL
      =================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          right-0
          top-0
          h-[3px]
          w-12
          bg-brand-yellow
        "
      />


      {/* ===================================================
          CARD HEADER
      =================================================== */}

      <CardHeader
        className="
          flex
          flex-row
          items-center
          justify-between
          space-y-0
          pb-2
        "
      >

        <CardTitle
          className="
            text-sm
            font-medium
            text-muted-foreground
          "
        >
          {title}
        </CardTitle>


        {/* =================================================
            ICON
        ================================================= */}

        <div
          className="
            flex
            size-10
            items-center
            justify-center
            rounded-lg
            bg-primary/10
          "
        >

          <Icon
            className="
              size-5
              text-primary
            "
          />

        </div>

      </CardHeader>


      {/* ===================================================
          CARD CONTENT
      =================================================== */}

      <CardContent>

        <div
          className="
            sltb-heading
            text-2xl
            font-bold
            tracking-tight
          "
        >
          {value}
        </div>


        <p
          className="
            mt-1
            text-xs
            text-muted-foreground
          "
        >
          {description}
        </p>

      </CardContent>

    </Card>

  );

}