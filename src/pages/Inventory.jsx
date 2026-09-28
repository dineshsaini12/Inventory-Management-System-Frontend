import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { prettyDate } from "../utils/format";
import { Empty, PageHeading } from "../components/ui";
export function Inventory({ data }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () =>
      data.inventory.filter((record) =>
        `${record.productName} ${record.type} ${record.id}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data.inventory, query],
  );
  const incoming = data.inventory
    .filter((record) => record.change > 0)
    .reduce((sum, record) => sum + record.change, 0);
  const outgoing = data.inventory
    .filter((record) => record.change < 0)
    .reduce((sum, record) => sum + record.change, 0);
  return (
    <>
      <PageHeading
        eyebrow="RECORDS"
        title="Inventory record"
        description="A traceable history of all stock movements."
      />
      <div className="mini-stats grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div>
          <span>Total movements</span>
          <b>{data.inventory.length}</b>
        </div>
        <div>
          <span>Stock received</span>
          <b className="green-text">+{incoming}</b>
        </div>
        <div>
          <span>Stock dispatched</span>
          <b className="red-text">{outgoing}</b>
        </div>
        <div>
          <span>Current units</span>
          <b>
            {data.products.reduce((sum, product) => sum + product.stock, 0)}
          </b>
        </div>
      </div>
      <label className="searchbox">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search product or movement"
        />
      </label>
      <div className="panel table-panel mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-md">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr>
              {[
                "INVENTORY ID",
                "PRODUCT",
                "CHANGE TYPE",
                "QUANTITY CHANGED",
                "DATE & TIME",
                "REFERENCE",
              ].map((heading) => (
                <th key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>
                  <b>{record.productName}</b>
                </td>
                <td>{record.type}</td>
                <td className={record.change > 0 ? "positive" : "negative"}>
                  {record.change > 0 ? (
                    <ArrowDownLeft size={14} className="inline" />
                  ) : (
                    <ArrowUpRight size={14} className="inline" />
                  )}{" "}
                  {record.change > 0 ? "+" : ""}
                  {record.change}
                </td>
                <td>
                  {new Date(record.date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td>{record.reference || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <Empty message="Inventory movements appear here when purchases are received or orders completed." />
        )}
      </div>
      {rows[0] && (
        <p className="mt-3 text-xs text-slate-500">
          Latest movement: {prettyDate(rows[0].date)}
        </p>
      )}
    </>
  );
}
