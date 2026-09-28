import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { money, prettyDate } from "../utils/format";
import { PageHeading } from "../components/ui";
const periods = {
  "1 Day": 1,
  "7 Days": 7,
  "1 Month": 30,
  "1 Year": 365,
};
export function Reports({ data }) {
  const [period, setPeriod] = useState("7 Days");
  const start = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - periods[period] + 1);
    return date;
  }, [period]);
  const orders = data.orders.filter(
    (row) => new Date(`${row.date}T00:00:00`) >= start,
  );
  const purchases = data.purchases.filter(
    (row) => new Date(`${row.date}T00:00:00`) >= start,
  );
  const sales = orders.reduce((sum, order) => sum + order.total, 0);
  const spend = purchases
    .filter((row) => row.status !== "Cancelled")
    .reduce((sum, row) => sum + row.total, 0);
  const salesDays = summarize(orders);
  const purchaseDays = summarize(
    purchases.filter((row) => row.status !== "Cancelled"),
  );
  const highlights = [
    ["Highest sales day", salesDays.high, ArrowUpRight],
    ["Lowest sales day", salesDays.low, ArrowDownRight],
    ["Highest purchase day", purchaseDays.high, ArrowUpRight],
    ["Lowest purchase day", purchaseDays.low, ArrowDownRight],
  ];
  return (
    <>
      <PageHeading
        eyebrow="ANALYTICS"
        title="Reports"
        description="Sales and purchasing activity by date range."
      />
      <div className="panel mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <b className="text-sm text-slate-800">Reporting period</b>
          <p className="m-0 mt-1 text-xs text-slate-500">
            Choose a range to refresh the figures
          </p>
        </div>
        <div className="segmented flex flex-wrap gap-1">
          {Object.keys(periods).map((item) => (
            <button
              key={item}
              className={period === item ? "selected" : ""}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="report-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={ShoppingCart}
          title="Sales"
          amount={money(sales)}
          detail={`${orders.length} customer orders`}
          tone="blue"
        />
        <Metric
          icon={ShoppingBag}
          title="Purchases"
          amount={money(spend)}
          detail={`${purchases.length} purchase orders`}
          tone="violet"
        />
        <Metric
          icon={BarChart3}
          title="Sales orders"
          amount={orders.length}
          detail="Orders in selected period"
        />
        <Metric
          icon={ShoppingBag}
          title="Purchase orders"
          amount={purchases.length}
          detail="Orders in selected period"
        />
      </div>
      <section className="panel report-summary mt-4 rounded-lg border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-lg">
        <div className="panel-head">
          <div>
            <h3>Period highlights</h3>
            <p>Daily highs and lows · {period}</p>
          </div>
        </div>
        <div className="highlight-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {highlights.map(([label, value, Icon]) => (
            <div className="highlight" key={label}>
              <Icon size={17} />
              <div>
                <small>{label}</small>
                <b>{value ? money(value[1]) : "—"}</b>
                <span>
                  {value ? prettyDate(value[0]) : "No activity in period"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
          Report values use transaction dates. New demo activity is included
          automatically.
        </p>
      </section>
    </>
  );
}
function summarize(rows) {
  const byDate = Object.entries(
    rows.reduce((groups, row) => {
      groups[row.date] = (groups[row.date] || 0) + row.total;
      return groups;
    }, {}),
  ).sort(([left], [right]) => left.localeCompare(right));
  return {
    high: [...byDate].sort((a, b) => b[1] - a[1])[0],
    low: [...byDate].sort((a, b) => a[1] - b[1])[0],
  };
}
function Metric({ icon: Icon, title, amount, detail, tone = "" }) {
  return (
    <div
      className={`report-card ${tone ? `${tone}-report` : "plain-report"} rounded-lg border p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex w-full items-start justify-between">
        <span>{title}</span>
        <Icon size={18} />
      </div>
      <strong>{amount}</strong>
      <small>{detail}</small>
    </div>
  );
}
