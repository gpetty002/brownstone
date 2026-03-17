import { useState } from "react";
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
            className={view === "usage" ? "tab active" : "tab"}
            onClick={() => setView("usage")}
          >
            View usage
          </button>
        </nav>
        {view === "register" ? <RegisterView /> : <UsageView />}
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
      <p className="subtitle">Look up AI access logs for a registered site.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="siteId">Site ID</label>
          <input
            id="siteId"
            type="text"
            placeholder="64f3a..."
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            type="text"
            placeholder="your-api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch usage"}
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

function Row({ label, value }) {
  return (
    <div className="detail-row">
      <span className="label">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default App;
