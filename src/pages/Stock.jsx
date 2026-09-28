import { useMemo, useState } from "react";
import { Search, Warehouse } from "lucide-react";
import { money } from "../utils/format";
import { Badge, Empty, PageHeading } from "../components/ui";
export function Stock({ data }) {
  const [query, setQuery] = useState("");
  const products = useMemo(
    () =>
      data.products.filter((product) =>
        `${product.name} ${product.sku}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data.products, query],
  );
  const totals = [
    ["In stock", data.products.filter((product) => product.stock > 10).length],
    [
      "Low stock",
      data.products.filter(
        (product) => product.stock > 0 && product.stock <= 10,
      ).length,
    ],
    [
      "Out of stock",
      data.products.filter((product) => product.stock === 0).length,
    ],
    [
      "Total units",
      data.products.reduce((sum, product) => sum + product.stock, 0),
    ],
  ];
  return (
    <>
      <PageHeading
        eyebrow="OPERATIONS"
        title="Stock"
        description="Live quantities and stock health for every product."
      />
      <div className="mini-stats grid grid-cols-2 gap-3 lg:grid-cols-4">
        {totals.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value.toLocaleString("en-IN")}</b>
          </div>
        ))}
      </div>
      <label className="searchbox">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search stock"
        />
      </label>
      <div className="panel table-panel mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-md">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr>
              {[
                "PRODUCT",
                "PRODUCT ID",
                "CURRENT QUANTITY",
                "STOCK STATUS",
                "UNIT PRICE",
              ].map((heading) => (
                <th key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <b>{product.name}</b>
                </td>
                <td>{product.sku}</td>
                <td>{product.stock} units</td>
                <td>
                  <Badge
                    value={
                      product.stock === 0
                        ? "Out of Stock"
                        : product.stock <= 10
                          ? "Low Stock"
                          : "In Stock"
                    }
                  />
                </td>
                <td>{money(product.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <Empty message="No products match your search." />
        )}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Warehouse size={14} /> Stock updates when purchases are received or
        customer orders are completed.
      </p>
    </>
  );
}
