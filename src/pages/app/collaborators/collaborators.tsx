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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Colaboradores
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MonthRevenueCard />
          <MonthOrdersAmountCard />
          <DayOrdersAmountCard />
          <MonthCanceledOrdersAmountCard />
        </div>
      </div>
    </>
  );
}
