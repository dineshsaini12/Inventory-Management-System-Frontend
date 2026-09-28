import { useMemo, useState } from "react";
import { Plus, Search, Truck } from "lucide-react";
import { id } from "../utils/format";
import { Empty, Field, Modal, PageHeading } from "../components/ui";
export function Suppliers({ data, setData, notify }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const suppliers = useMemo(
    () =>
      data.suppliers.filter((supplier) =>
        `${supplier.name} ${supplier.email} ${supplier.phone}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data.suppliers, query],
  );
  function addSupplier(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supplier = {
      id: id("SUP"),
      name: form.get("name").trim(),
      phone: form.get("phone").trim(),
      email: form.get("email").trim(),
      address: form.get("address").trim(),
    };
    setData({
      ...data,
      suppliers: [supplier, ...data.suppliers],
    });
    setOpen(false);
    notify("Supplier added");
  }
  return (
    <>
      <PageHeading
        eyebrow="OPERATIONS"
        title="Suppliers"
        description="Supplier directory and contact details."
        action={
          <button
            className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0"
            onClick={() => setOpen(true)}
          >
            <Plus size={16} /> Add supplier
          </button>
        }
      />
      <label className="searchbox">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search suppliers"
        />
      </label>
      <div className="supplier-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-4">
        {suppliers.map((supplier) => (
          <article
            key={supplier.id}
            className="panel supplier-card rounded-lg border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="supplier-avatar">
                {supplier.name.slice(0, 1)}
              </span>
              <span className="badge badge-active">Active</span>
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-800">
              {supplier.name}
            </h2>
            <p className="text-xs text-slate-400">{supplier.id}</p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <p>{supplier.phone}</p>
              <p className="break-all">{supplier.email}</p>
              <p>{supplier.address}</p>
            </div>
          </article>
        ))}
        {suppliers.length === 0 && (
          <Empty message="No suppliers match your search." />
        )}
      </div>
      {open && (
        <Modal title="Add supplier" close={() => setOpen(false)}>
          <form
            className="form-grid grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={addSupplier}
          >
            <Field label="Supplier name">
              <input name="name" required autoFocus />
            </Field>
            <Field label="Phone">
              <input name="phone" type="tel" required />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required />
            </Field>
            <Field label="Address">
              <input name="address" required />
            </Field>
            <div className="modal-actions col-span-full flex justify-end gap-2">
              <button
                type="button"
                className="button secondary transition-colors duration-200 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0">
                Save supplier
              </button>
            </div>
          </form>
        </Modal>
      )}
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <Truck size={14} /> {data.suppliers.length} suppliers available for
        purchase orders
      </div>
    </>
  );
}
