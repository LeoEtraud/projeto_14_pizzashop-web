import { Helmet } from "react-helmet-async";
import { DayOrdersAmountCard } from "../dashboard/day-orders-amount-card";
import { MonthCanceledOrdersAmountCard } from "../dashboard/month-canceled-orders-amount-card";
import { MonthOrdersAmountCard } from "../dashboard/month-orders-amount-card";
import { MonthRevenueCard } from "../dashboard/month-revenue-card";

export function Collaborators() {
  return (
    <>
      <Helmet title="Colaboradores" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>

        <div className="grid grid-cols-4 gap-4">
          <MonthRevenueCard />
          <MonthOrdersAmountCard />
          <DayOrdersAmountCard />
          <MonthCanceledOrdersAmountCard />
        </div>
      </div>
    </>
  );
}
