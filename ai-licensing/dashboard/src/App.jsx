import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:4000";

const AI_OPTIONS = ["ChatGPT", "Claude", "BingAI", "Perplexity", "Gemini"];

function App() {
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

  function handleReset() {
    setSite(null);
    setError(null);
    setForm({
      name: "",
      licenseModel: "free",
      rate: "",
      permission: "allowed",
      enforcementEnabled: false,
      blockedAIs: [],
    });
  }

  if (site) {
    return (
      <div className="container">
        <div className="card success-card">
          <h2>Site registered</h2>
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
          <button onClick={handleReset}>Register another site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Brownstone</h1>
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
      </div>
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
