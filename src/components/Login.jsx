import { useState } from "react";
import { Activity, ArrowUpRight, Boxes, ShieldCheck } from "lucide-react";
import "../App.css";
export function Login({ onLogin }) {
  const [name, setName] = useState("manager"),
    [password, setPassword] = useState("manager123"),
    [error, setError] = useState("");
  return (
    <main className="login-page">
      <div className="login-art">
        <div className="art-brand">
          <span className="brand-mark">
            <Boxes />
          </span>
          <span>
            Inventory Management System<span className="brand-dot">.</span>
          </span>
        </div>
        <div className="art-copy">
          <span className="eyebrow">INVENTORY, IN CONTROL</span>
          <h1>
            A clearer view
            <br />
            of your business.
          </h1>
          <p>
            One workspace for your products, purchases and day-to-day stock
            movements.
          </p>
          <div className="art-metric">
            <span className="metric-icon">
              <Activity />
            </span>
            <div>
              <strong>Everything in its place</strong>
              <small>Live inventory overview</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
        <small className="art-foot">DEMO WORKSPACE · INDIA</small>
      </div>
      <section className="login-panel">
        <div className="login-box">
          <div className="login-mobile-brand">
            <span className="brand-mark">
              <Boxes />
            </span>{" "}
            Stockroom.
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your workspace</h2>
          <p className="muted">Enter your demo credentials to continue.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name === "manager" && password === "manager123") onLogin();
              else
                setError(
                  "That username or password doesn’t match the demo account.",
                );
            }}
          >
            <label>
              Username
              <input
                autoComplete="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="button primary full">
              Sign in <ArrowUpRight size={16} />
            </button>
          </form>
          <div className="demo-note">
            <ShieldCheck size={17} />
            <span>
              <b>Demo access</b>
              <br />
              manager <span className="sep">/</span> manager123
            </span>
          </div>
          <div className="login-privacy">
            Demo data stays in this browser using local storage.
          </div>
        </div>
      </section>
    </main>
  );
}
