import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { id, money } from "../utils/format";
import { Badge, Empty, Field, Modal, PageHeading } from "../components/ui";
export function Products({ data, setData, notify }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const products = useMemo(
    () =>
      data.products.filter((product) =>
        `${product.name} ${product.sku}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data.products, query],
  );
  function addProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = {
      id: id("PRD"),
      name: form.get("name").trim(),
      sku: form.get("sku").trim(),
      category: form.get("category").trim() || "General",
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
    };
    setData({
      ...data,
      products: [product, ...data.products],
    });
    setOpen(false);
    notify("Product added to catalogue");
  }
  function removeProduct(product) {
    if (!window.confirm(`Delete ${product.name} from the catalogue?`)) return;
    setData({
      ...data,
      products: data.products.filter((item) => item.id !== product.id),
    });
    notify("Product removed");
  }
  return (
    <>
      <PageHeading
        eyebrow="CATALOGUE"
        title="Products"
        description="Manage products and opening stock."
        action={
          <button
            className="button primary transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0"
            onClick={() => setOpen(true)}
          >
            <Plus size={16} /> Add product
          </button>
        }
      />
      <div className="toolbar">
        <label className="searchbox">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or SKU"
          />
        </label>
      </div>
      <div className="panel table-panel overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr>
              {[
                "PRODUCT",
                "SKU",
                "CATEGORY",
                "PRICE",
                "STOCK",
                "STATUS",
                "",
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
                <td>{product.category}</td>
                <td>{money(product.price)}</td>
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
                <td>
                  <button
                    className="icon-button"
                    title="Delete product"
                    onClick={() => removeProduct(product)}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <Empty message="Add a product or adjust your search." />
        )}
      </div>
      {open && (
        <Modal title="Add product" close={() => setOpen(false)}>
          <form
            className="form-grid grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={addProduct}
          >
            <Field label="Product name">
              <input name="name" required autoFocus />
            </Field>
            <Field label="SKU">
              <input name="sku" required />
            </Field>
            <Field label="Category">
              <input name="category" placeholder="General" />
            </Field>
            <Field label="Unit price (₹)">
              <input name="price" type="number" min="0" required />
            </Field>
            <Field label="Opening stock">
              <input name="stock" type="number" min="0" required />
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
                Save product
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
