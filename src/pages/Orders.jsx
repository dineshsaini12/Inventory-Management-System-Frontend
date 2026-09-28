import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { id, money, prettyDate } from "../utils/format";
import { PageHeading, PanelTable, Badge, Modal, Field } from "../components/ui";
import "../App.css";
export function Orders({ data, setData, notify }) {
  const [modal, M] = useState(false);
  const complete = (o) => {
    if (o.status !== "Confirmed") return;
    const p = data.products.find((x) => x.id === o.productId);
    if (!p || p.stock < o.quantity) {
      notify("Not enough stock to complete this order", "error");
      return;
    }
    const products = data.products.map((x) =>
        x.id === o.productId
          ? {
              ...x,
              stock: x.stock - o.quantity,
            }
          : x,
      ),
      inventory = [
        {
          id: id("INV"),
          productName: o.productName,
          productId: o.productId,
          change: -o.quantity,
          type: "CUSTOMER_ORDER",
          date: new Date().toISOString(),
          reference: o.id,
        },
        ...data.inventory,
      ];
    setData({
      ...data,
      products,
      orders: data.orders.map((x) =>
        x.id === o.id
          ? {
              ...x,
              status: "Completed",
            }
          : x,
      ),
      inventory,
    });
    notify("Order completed · stock updated");
  };
  return (
    <>
      <PageHeading
        eyebrow="TRANSACTIONS"
        title="Customer orders"
        description="Record sales and keep customer order fulfilment moving."
        action={
          <button
            className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0"
            onClick={() => M(true)}
          >
            <Plus size={16} /> New order
          </button>
        }
      />
      <div className="mini-stats grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div>
          <span>All orders</span>
          <b>{data.orders.length}</b>
        </div>
        <div>
          <span>Confirmed</span>
          <b className="amber-text">
            {data.orders.filter((o) => o.status === "Confirmed").length}
          </b>
        </div>
        <div>
          <span>Completed</span>
          <b className="green-text">
            {data.orders.filter((o) => o.status === "Completed").length}
          </b>
        </div>
        <div>
          <span>Sales revenue</span>
          <b>{money(data.orders.reduce((a, o) => a + o.total, 0))}</b>
        </div>
      </div>
      <PanelTable
        headers={[
          "ORDER ID",
          "CUSTOMER",
          "PRODUCT",
          "QUANTITY",
          "TOTAL AMOUNT",
          "ORDER DATE",
          "STATUS",
          "ACTIONS",
        ]}
        empty={data.orders.length ? "" : "No customer orders yet."}
      >
        {data.orders.map((o) => (
          <tr key={o.id}>
            <td>
              <b className="id-text">{o.id}</b>
            </td>
            <td>{o.customer}</td>
            <td>{o.productName}</td>
            <td>{o.quantity}</td>
            <td>
              <b>{money(o.total)}</b>
            </td>
            <td>{prettyDate(o.date)}</td>
            <td>
              <Badge value={o.status} />
            </td>
            <td>
              {o.status === "Confirmed" ? (
                <button
                  className="button tiny primary transition-all duration-200 hover:-translate-y-px hover:shadow-sm"
                  onClick={() => complete(o)}
                >
                  <Check size={13} /> Complete
                </button>
              ) : (
                <span className="muted">—</span>
              )}
            </td>
          </tr>
        ))}
      </PanelTable>
      {modal && (
        <Modal title="Create customer order" close={() => M(false)}>
          <OrderForm
            data={data}
            close={() => M(false)}
            save={(o) => {
              setData({
                ...data,
                orders: [o, ...data.orders],
              });
              notify("Customer order created · awaiting confirmation");
            }}
          />
        </Modal>
      )}
    </>
  );
}
export function OrderForm({ data, close, save }) {
  const [v, V] = useState({
    customer: data.customers[0] || "",
    productId: data.products[0]?.id || "",
    quantity: "1",
    date: new Date().toISOString().slice(0, 10),
  });
  const p = data.products.find((x) => x.id === v.productId);
  return (
    <form
      className="form-grid grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (+v.quantity > p.stock) return;
        save({
          id: id("ORD"),
          customer: v.customer,
          productId: p.id,
          productName: p.name,
          quantity: +v.quantity,
          total: p.price * +v.quantity,
          status: "Confirmed",
          payment: "Pending",
          date: v.date,
        });
        close();
      }}
    >
      <Field label="Customer">
        <select
          value={v.customer}
          onChange={(e) =>
            V({
              ...v,
              customer: e.target.value,
            })
          }
        >
          {data.customers.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Product">
        <select
          value={v.productId}
          onChange={(e) =>
            V({
              ...v,
              productId: e.target.value,
            })
          }
        >
          {data.products.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} · {x.stock} available
            </option>
          ))}
        </select>
      </Field>
      <Field label="Quantity">
        <input
          type="number"
          min="1"
          max={p?.stock || 1}
          required
          value={v.quantity}
          onChange={(e) =>
            V({
              ...v,
              quantity: e.target.value,
            })
          }
        />
        {p && <small className="field-help">Available stock: {p.stock}</small>}
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
      <div className="order-total">
        <span>Order total</span>
        <b>{money((p?.price || 0) * (+v.quantity || 0))}</b>
      </div>
      <div className="modal-actions col-span-full flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="button secondary transition-colors duration-200 hover:bg-slate-50"
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0"
          disabled={!p || +v.quantity > p.stock}
        >
          Create order
        </button>
      </div>
    </form>
  );
}
