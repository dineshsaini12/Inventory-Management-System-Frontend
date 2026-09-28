import { useEffect, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Package,
  Warehouse,
  Truck,
  Users,
  ShoppingCart,
  ShoppingBag,
  Settings2,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  Plus,
} from "lucide-react";
import { money, prettyDate } from "../utils/format";
import { PageHeading, Badge, Empty } from "../components/ui";
import "../App.css";
export function Dashboard({ data, navigate }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const stock = data.products.reduce((a, p) => a + p.stock, 0),
    low = data.products.filter((p) => p.stock <= 10),
    revenue = data.orders.reduce((a, o) => a + o.total, 0),
    stats = [
      ["Total products", data.products.length, Package, "blue"],
      ["Current stock", stock, Warehouse, "violet"],
      ["Total suppliers", data.suppliers.length, Truck, "amber"],
      ["Total customers", data.customers.length, Users, "green"],
      ["Customer orders", data.orders.length, ShoppingCart, "blue"],
      ["Purchase orders", data.purchases.length, ShoppingBag, "violet"],
    ];
  return (
    <>
      <PageHeading
        eyebrow="OVERVIEW"
        title={`${greeting}, Demo Manager`}
        description="Here’s what’s happening across your inventory today."
        action={
          <button
            className="button secondary transition-colors duration-200 hover:bg-slate-50"
            onClick={() => navigate("/reports")}
          >
            <BarChart3 size={16} /> View reports
          </button>
        }
      />
      <div className="stat-grid grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(([label, value, Icon, tone], i) => (
          <div
            className="stat-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            key={label}
          >
            <div className="stat-top">
              <span>{label}</span>
              <span className={`stat-icon ${tone}`}>
                <Icon size={18} />
              </span>
            </div>
            <strong>{value.toLocaleString("en-IN")}</strong>
            <small>
              <span className="trend">↗</span> Updated just now
            </small>
          </div>
        ))}
      </div>
      <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-2">
        <section className="panel revenue-panel transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
          <div className="panel-head">
            <div>
              <h3>Sales revenue</h3>
              <p>Across all customer orders</p>
            </div>
            <span className="period-pill">
              ALL TIME <ChevronDown size={13} />
            </span>
          </div>
          <div className="revenue-total">
            {money(revenue)}
            <span className="revenue-change">↗ Demo total</span>
          </div>
          <RevenueChart orders={data.orders} />
        </section>
        <section className="panel quick-panel transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
          <div className="panel-head">
            <div>
              <h3>Quick actions</h3>
              <p>Jump into your workflow</p>
            </div>
            <span className="quiet-icon">
              <Settings2 size={17} />
            </span>
          </div>
          <div className="quick-list">
            <QuickAction
              icon={Package}
              title="Add a product"
              sub="Create a catalogue item"
              go={() => navigate("/products")}
            />
            <QuickAction
              icon={ShoppingBag}
              title="New purchase"
              sub="Restock from a supplier"
              go={() => navigate("/purchases")}
            />
            <QuickAction
              icon={ShoppingCart}
              title="New customer order"
              sub="Record a sale"
              go={() => navigate("/customers")}
            />
          </div>
        </section>
        <section className="panel activity-panel transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
          <div className="panel-head">
            <div>
              <h3>Recent inventory activity</h3>
              <p>Latest stock movements</p>
            </div>
            <button
              className="text-link"
              onClick={() => navigate("/inventory")}
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="activity-list">
            {data.inventory.slice(0, 5).map((r) => (
              <div
                className="activity-row transition-colors duration-150 hover:bg-slate-50"
                key={r.id}
              >
                <span
                  className={`movement-icon ${r.change > 0 ? "in" : "out"}`}
                >
                  {r.change > 0 ? (
                    <ArrowDownLeft size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </span>
                <div className="activity-name">
                  <b>{r.productName}</b>
                  <small>
                    {r.type} · {prettyDate(r.date)}
                  </small>
                </div>
                <strong className={r.change > 0 ? "positive" : "negative"}>
                  {r.change > 0 ? "+" : ""}
                  {r.change}
                </strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel low-panel transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
          <div className="panel-head">
            <div>
              <h3>Low stock products</h3>
              <p>Items that may need attention</p>
            </div>
            <span className="count-pill">{low.length} items</span>
          </div>
          {low.length ? (
            <div className="low-list">
              {low.slice(0, 5).map((p) => (
                <div
                  className="low-row transition-colors duration-150 hover:bg-slate-50"
                  key={p.id}
                >
                  <span className="product-avatar">{p.name.slice(0, 1)}</span>
                  <div className="activity-name">
                    <b>{p.name}</b>
                    <small>{p.sku}</small>
                  </div>
                  <span
                    className={`stock-chip ${p.stock === 0 ? "out" : "low"}`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty message="Everything is well stocked." />
          )}
          <button
            className="text-link low-link"
            onClick={() => navigate("/stock")}
          >
            Go to stock <ArrowUpRight size={14} />
          </button>
        </section>
        <section className="panel orders-panel lg:col-span-2 transition-all duration-200 ease-out hover:shadow-lg">
          <div className="panel-head">
            <div>
              <h3>Recent customer orders</h3>
              <p>Latest sales activity</p>
            </div>
            <button
              className="text-link"
              onClick={() => navigate("/customers")}
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.slice(0, 4).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <b className="id-text">{o.id}</b>
                    </td>
                    <td>{o.customer}</td>
                    <td>{prettyDate(o.date)}</td>
                    <td>
                      <b>{money(o.total)}</b>
                    </td>
                    <td>
                      <Badge value={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
export function QuickAction({ icon: Icon, title, sub, go }) {
  return (
    <button
      className="quick-action transition-colors duration-200 hover:bg-slate-50"
      onClick={go}
    >
      <span className="quick-icon">
        <Icon size={17} />
      </span>
      <span>
        <b>{title}</b>
        <small>{sub}</small>
      </span>
      <Plus size={16} className="quick-plus" />
    </button>
  );
}
export function RevenueChart({ orders }) {
  const days = Array.from(
    {
      length: 7,
    },
    (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    },
  );
  const vals = days.map((d) =>
    orders
      .filter((o) => new Date(o.date).toDateString() === d.toDateString())
      .reduce((a, o) => a + o.total, 0),
  );
  const max = Math.max(...vals, 1);
  return (
    <div className="chart-area">
      <div className="chart-y">
        <span>₹{Math.round(max / 1000)}k</span>
        <span>₹{Math.round(max / 2 / 1000)}k</span>
        <span>₹0</span>
      </div>
      <div className="chart-bars">
        {days.map((d, i) => (
          <div className="chart-col" key={i}>
            <div className="bar-track">
              <div
                className="bar"
                style={{
                  height: `${Math.max((vals[i] / max) * 100, vals[i] ? 8 : 3)}%`,
                }}
                title={money(vals[i])}
              />
            </div>
            <small>
              {d.toLocaleDateString("en-IN", {
                weekday: "short",
              })}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
