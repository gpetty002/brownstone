import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import "./App.css";

const API_URL = "http://localhost:4000";

const AI_OPTIONS = ["ChatGPT", "Claude", "BingAI", "Perplexity", "Gemini"];

function App() {
  const [view, setView] = useState("register");

  return (
    <div className="container">
      <div className="card">
        <h1>Brownstone</h1>
        <nav className="tabs">
          <button
            className={view === "register" ? "tab active" : "tab"}
            onClick={() => setView("register")}
          >
            Register site
          </button>
          <button
            className={view === "analytics" ? "tab active" : "tab"}
            onClick={() => setView("analytics")}
          >
            Analytics
          </button>
          <button
            className={view === "usage" ? "tab active" : "tab"}
            onClick={() => setView("usage")}
          >
            Logs
          </button>
        </nav>
        {view === "register" && <RegisterView />}
        {view === "analytics" && <AnalyticsView />}
        {view === "usage" && <UsageView />}
      </div>
    </div>
  );
}

function RegisterView() {
  const [form, setForm] = useState({
    name: "",
    licenseModel: "free",
    rate: "",
    permission: "allowed",
    enforcementEnabled: false,
    blockedAIs: [],
  });
  const [site, setSite] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function toggleBlockedAI(ai) {
    setForm((prev) => ({
      ...prev,
      blockedAIs: prev.blockedAIs.includes(ai)
        ? prev.blockedAIs.filter((a) => a !== ai)
        : [...prev.blockedAIs, ai],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/sites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          license: {
            model: form.licenseModel,
            rate: form.rate || null,
            permission: form.permission,
          },
          enforcementEnabled: form.enforcementEnabled,
          blockedAIs: form.blockedAIs,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSite(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (site) {
    return (
      <>
        <div className="api-key-box">
          <p className="label">API Key</p>
          <code>{site.apiKey}</code>
          <p className="hint">Copy this — it won't be shown again.</p>
        </div>
        <div className="site-details">
          <Row label="Site ID" value={site.id} />
          <Row label="Name" value={site.name} />
          <Row label="License" value={`${site.license.model} / ${site.license.permission}`} />
          {site.license.rate && <Row label="Rate" value={site.license.rate} />}
          <Row label="Enforcement" value={site.enforcementEnabled ? "Enabled" : "Disabled"} />
          {site.blockedAIs.length > 0 && (
            <Row label="Blocked AIs" value={site.blockedAIs.join(", ")} />
          )}
        </div>
        <button className="btn-secondary" onClick={() => setSite(null)}>
          Register another site
        </button>
      </>
    );
  }

  return (
    <>
      <p className="subtitle">Register a site to start tracking AI access.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Site name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="my-app"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="licenseModel">License model</label>
            <select id="licenseModel" name="licenseModel" value={form.licenseModel} onChange={handleChange}>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="permission">Permission</label>
            <select id="permission" name="permission" value={form.permission} onChange={handleChange}>
              <option value="allowed">Allowed</option>
              <option value="restricted">Restricted</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {form.licenseModel === "paid" && (
          <div className="field">
            <label htmlFor="rate">Rate</label>
            <input
              id="rate"
              name="rate"
              type="text"
              placeholder="$0.001-per-1000-tokens"
              value={form.rate}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="field">
          <label>Block specific AIs</label>
          <div className="checkbox-group">
            {AI_OPTIONS.map((ai) => (
              <label key={ai} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.blockedAIs.includes(ai)}
                  onChange={() => toggleBlockedAI(ai)}
                />
                {ai}
              </label>
            ))}
          </div>
        </div>

        <div className="field checkbox-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enforcementEnabled"
              checked={form.enforcementEnabled}
              onChange={handleChange}
            />
            Enable enforcement
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register site"}
        </button>
      </form>
    </>
  );
}

function AnalyticsView() {
  const [siteId, setSiteId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/sites/${siteId}/analytics`, {
        headers: { "x-api-key": apiKey },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch analytics");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="subtitle">View AI access analytics for a registered site.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="a-siteId">Site ID</label>
            <input
              id="a-siteId"
              type="text"
              placeholder="64f3a..."
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="a-apiKey">API Key</label>
            <input
              id="a-apiKey"
              type="text"
              placeholder="your-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Load analytics"}
        </button>
      </form>

      {data && (
        <div className="analytics-results">
          <h3 className="analytics-site-name">{data.name}</h3>

          <div className="stat-row">
            <Stat label="Total requests" value={data.summary.total} />
            <Stat label="Last 7 days" value={data.summary.last7Days} />
            <Stat label="Last 30 days" value={data.summary.last30Days} />
          </div>

          {data.byProvider.length > 0 && (
            <div className="chart-section">
              <p className="chart-label">Requests by AI provider</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.byProvider} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <XAxis dataKey="provider" tick={{ fill: "#aaa", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#aaa", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#1e1e1e", border: "1px solid #444", borderRadius: 6 }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#646cff" }}
                  />
                  <Bar dataKey="count" fill="#646cff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.daily.length > 0 && (
            <div className="chart-section">
              <p className="chart-label">Requests over the last 30 days</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.daily} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid stroke="#2a2a2a" />
                  <XAxis dataKey="date" tick={{ fill: "#aaa", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#aaa", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#1e1e1e", border: "1px solid #444", borderRadius: 6 }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#a0f0a0" }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#a0f0a0" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.byProvider.length === 0 && (
            <p className="hint" style={{ marginTop: "1.5rem" }}>No AI access logged yet.</p>
          )}
        </div>
      )}
    </>
  );
}

function UsageView() {
  const [siteId, setSiteId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/sites/${siteId}/usage`, {
        headers: { "x-api-key": apiKey },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch usage");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="subtitle">Raw AI access logs for a registered site.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="u-siteId">Site ID</label>
            <input
              id="u-siteId"
              type="text"
              placeholder="64f3a..."
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="u-apiKey">API Key</label>
            <input
              id="u-apiKey"
              type="text"
              placeholder="your-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch logs"}
        </button>
      </form>

      {result && (
        <div className="usage-results">
          <p className="usage-header">
            <strong>{result.name}</strong> — {result.usage.length} request{result.usage.length !== 1 ? "s" : ""}
          </p>
          {result.usage.length === 0 ? (
            <p className="hint">No AI access logged yet.</p>
          ) : (
            <table className="usage-table">
              <thead>
                <tr>
                  <th>AI</th>
                  <th>Path</th>
                  <th>IP</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {result.usage.map((log) => (
                  <tr key={log._id}>
                    <td>{log.aiProvider}</td>
                    <td>{log.path}</td>
                    <td>{log.ip}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="detail-row">
      <span className="label">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default App;
