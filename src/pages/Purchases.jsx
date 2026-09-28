import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { id, money, prettyDate } from "../utils/format";
import { PageHeading, PanelTable, Badge, Modal, Field } from "../components/ui";
import "../App.css";
export function Purchases({ data, setData, notify }) {
  const [modal, M] = useState(false);
  const receive = (p) => {
    if (p.status !== "Pending") return;
    const products = data.products.map((x) =>
      x.id === p.productId
        ? {
            ...x,
            stock: x.stock + p.quantity,
          }
        : x,
    );
    const inventory = [
      {
        id: id("INV"),
        productName: p.productName,
        productId: p.productId,
        change: p.quantity,
        type: "PURCHASE",
        date: new Date().toISOString(),
        reference: p.id,
      },
      ...data.inventory,
    ];
    setData({
      ...data,
      products,
      purchases: data.purchases.map((x) =>
        x.id === p.id
          ? {
              ...x,
              status: "Received",
            }
          : x,
      ),
      inventory,
    });
    notify("Purchase received · stock updated");
  };
  const cancel = (p) => {
    setData({
      ...data,
      purchases: data.purchases.map((x) =>
        x.id === p.id
          ? {
              ...x,
              status: "Cancelled",
            }
          : x,
      ),
    });
    notify("Purchase cancelled");
  };
  return (
    <>
      <PageHeading
        eyebrow="TRANSACTIONS"
        title="Purchases"
        description="Track supplier orders and receive stock into your inventory."
        action={
          <button
            className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0"
            onClick={() => M(true)}
          >
            <Plus size={16} /> New purchase
          </button>
        }
      />
      <div className="mini-stats grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div>
          <span>All purchase orders</span>
          <b>{data.purchases.length}</b>
        </div>
        <div>
          <span>Pending</span>
          <b className="amber-text">
            {data.purchases.filter((p) => p.status === "Pending").length}
          </b>
        </div>
        <div>
          <span>Received</span>
          <b className="green-text">
            {data.purchases.filter((p) => p.status === "Received").length}
          </b>
        </div>
        <div>
          <span>Total value</span>
          <b>{money(data.purchases.reduce((a, p) => a + p.total, 0))}</b>
        </div>
      </div>
      <PanelTable
        headers={[
          "PURCHASE ID",
          "SUPPLIER",
          "PRODUCT",
          "QUANTITY",
          "TOTAL",
          "ORDER DATE",
          "STATUS",
          "ACTIONS",
        ]}
        empty={data.purchases.length ? "" : "No purchase orders yet."}
      >
        {data.purchases.map((p) => (
          <tr key={p.id}>
            <td>
              <b className="id-text">{p.id}</b>
            </td>
            <td>{p.supplier}</td>
            <td>{p.productName}</td>
            <td>{p.quantity}</td>
            <td>
              <b>{money(p.total)}</b>
            </td>
            <td>{prettyDate(p.date)}</td>
            <td>
              <Badge value={p.status} />
            </td>
            <td>
              {p.status === "Pending" ? (
                <div className="row-actions">
                  <button
                    className="button tiny primary transition-all duration-200 hover:-translate-y-px hover:shadow-sm"
                    onClick={() => receive(p)}
                  >
                    <Check size={13} /> Receive
                  </button>
                  <button
                    className="button tiny secondary transition-colors duration-200 hover:bg-slate-50"
                    onClick={() => cancel(p)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="muted">—</span>
              )}
            </td>
          </tr>
        ))}
      </PanelTable>
      {modal && (
        <Modal title="Create purchase order" close={() => M(false)}>
          <PurchaseForm
            data={data}
            close={() => M(false)}
            save={(p) => {
              setData({
                ...data,
                purchases: [p, ...data.purchases],
              });
              notify("Purchase order created · pending receipt");
            }}
          />
        </Modal>
      )}
    </>
  );
}
export function PurchaseForm({ data, close, save }) {
  const [v, V] = useState({
    supplierId: data.suppliers[0]?.id || "",
    productId: data.products[0]?.id || "",
    quantity: "1",
    unitPrice: "",
    date: new Date().toISOString().slice(0, 10),
    expected: "",
  });
  const product = data.products.find((p) => p.id === v.productId),
    supplier = data.suppliers.find((s) => s.id === v.supplierId);
  useEffect(() => {
    if (product)
      V((x) => ({
        ...x,
        unitPrice: String(product.price),
      }));
  }, [v.productId]);
  return (
    <form
      className="form-grid grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        save({
          id: id("PO"),
          ...v,
          supplier: supplier?.name || "Supplier",
          productName: product?.name || "Product",
          productId: product?.id,
          quantity: +v.quantity,
          unitPrice: +v.unitPrice,
          total: +v.quantity * +v.unitPrice,
          status: "Pending",
          date: v.date,
          expected: v.expected,
        });
        close();
      }}
    >
      <Field label="Supplier">
        <select
          required
          value={v.supplierId}
          onChange={(e) =>
            V({
              ...v,
              supplierId: e.target.value,
            })
          }
        >
          {data.suppliers.map((s) => (
            <option value={s.id} key={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Product">
        <select
          required
          value={v.productId}
          onChange={(e) =>
            V({
              ...v,
              productId: e.target.value,
            })
          }
        >
          {data.products.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Quantity">
        <input
          type="number"
          min="1"
          required
          value={v.quantity}
          onChange={(e) =>
            V({
              ...v,
              quantity: e.target.value,
            })
          }
        />
      </Field>
      <Field label="Unit price (₹)">
        <input
          type="number"
          min="0"
          required
          value={v.unitPrice}
          onChange={(e) =>
            V({
              ...v,
              unitPrice: e.target.value,
            })
          }
        />
      </Field>
      <Field label="Order date">
        <input
          type="date"
          required
          value={v.date}
          onChange={(e) =>
            V({
              ...v,
              date: e.target.value,
            })
          }
        />
      </Field>
      <Field label="Expected date">
        <input
          type="date"
          value={v.expected}
          onChange={(e) =>
            V({
              ...v,
              expected: e.target.value,
            })
          }
        />
      </Field>
      <div className="order-total">
        <span>Order total</span>
        <b>{money((+v.quantity || 0) * (+v.unitPrice || 0))}</b>
      </div>
      <div className="modal-actions col-span-full flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="button secondary transition-colors duration-200 hover:bg-slate-50"
          onClick={close}
        >
          Cancel
        </button>
        <button className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0">
          Create purchase
        </button>
      </div>
    </form>
  );
}
