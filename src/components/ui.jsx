import { Boxes, Search, X } from "lucide-react";
import "../App.css";
export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function PageToolbar({
  search,
  setSearch,
  button,
  placeholder = "Search…",
}) {
  return (
    <div className="toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label className="searchbox flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 sm:max-w-sm">
        <Search size={17} />
        <input
          className="min-w-0 flex-1 outline-none"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
        />
        <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-400 sm:block">
          ⌘ K
        </kbd>
      </label>
      {button}
    </div>
  );
}
export function PanelTable({ children, headers, empty }) {
  return (
    <div className="panel table-panel overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="table-scroll overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header) => (
                <th
                  className="whitespace-nowrap px-3 py-3 text-[10px] font-semibold tracking-wide text-slate-500"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
        {empty && <Empty message={empty} />}
      </div>
    </div>
  );
}
export function Badge({ value }) {
  const key = String(value).toLowerCase().replaceAll(" ", "-");
  const tone = ["completed", "received", "in-stock", "active"].includes(key)
    ? "bg-emerald-50 text-emerald-700"
    : ["confirmed", "pending", "low-stock"].includes(key)
      ? "bg-amber-50 text-amber-700"
      : ["cancelled", "out-of-stock"].includes(key)
        ? "bg-rose-50 text-rose-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span
      className={`badge inline-flex whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${tone} badge-${key}`}
    >
      {value}
    </span>
  );
}
export function Empty({ message }) {
  return (
    <div className="empty">
      <span>
        <Boxes size={19} />
      </span>
      <b>Nothing to show yet</b>
      <p>{message}</p>
    </div>
  );
}
export function Field({ label, children }) {
  return (
    <label className="field flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700 [&_input]:h-10 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-slate-200 [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:font-normal [&_input]:outline-none [&_input:focus]:border-blue-500 [&_select]:h-10 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-slate-200 [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:font-normal">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Modal({ title, close, children }) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section className="modal my-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <header className="mb-5 flex items-start justify-between">
          <div>
            <span className="eyebrow">DEMO WORKSPACE</span>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
          </div>
          <button
            className="icon-button grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={close}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
