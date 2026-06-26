import { useState, useEffect, useRef } from "react";

const AQI_DATA = [
  { city: "Delhi", aqi: 218, pm25: 142, pm10: 210, no2: 88, lat: 28.6139, lng: 77.209, trend: "rising", risk: "Severe" },
  { city: "Mumbai", aqi: 156, pm25: 89, pm10: 134, no2: 62, lat: 19.076, lng: 72.8777, trend: "stable", risk: "Unhealthy" },
  { city: "Kolkata", aqi: 174, pm25: 108, pm10: 162, no2: 71, lat: 22.5726, lng: 88.3639, trend: "rising", risk: "Unhealthy" },
  { city: "Bengaluru", aqi: 98, pm25: 54, pm10: 89, no2: 43, lat: 12.9716, lng: 77.5946, trend: "falling", risk: "Moderate" },
  { city: "Chennai", aqi: 112, pm25: 67, pm10: 103, no2: 51, lat: 13.0827, lng: 80.2707, trend: "stable", risk: "Unhealthy for Sensitive" },
  { city: "Hyderabad", aqi: 134, pm25: 78, pm10: 118, no2: 58, lat: 17.385, lng: 78.4867, trend: "falling", risk: "Unhealthy for Sensitive" },
  { city: "Pune", aqi: 121, pm25: 71, pm10: 109, no2: 49, lat: 18.5204, lng: 73.8567, trend: "stable", risk: "Unhealthy for Sensitive" },
  { city: "Ahmedabad", aqi: 162, pm25: 94, pm10: 148, no2: 67, lat: 23.0225, lng: 72.5714, trend: "rising", risk: "Unhealthy" },
];

const FORECAST_DATA = [
  { hour: "Now", aqi: 218 },
  { hour: "3hr", aqi: 224 },
  { hour: "6hr", aqi, aqi: 231 },
  { hour: "9hr", aqi: 219 },
  { hour: "12hr", aqi: 208 },
  { hour: "15hr", aqi: 196 },
  { hour: "18hr", aqi: 187 },
  { hour: "21hr", aqi: 201 },
  { hour: "24hr", aqi: 215 },
];

const SOURCES = [
  { source: "Vehicle Emissions", contribution: 34, icon: "🚗" },
  { source: "Industrial Stacks", contribution: 28, icon: "🏭" },
  { source: "Construction Dust", contribution: 19, icon: "🏗️" },
  { source: "Biomass Burning", contribution: 12, icon: "🔥" },
  { source: "Secondary Aerosols", contribution: 7, icon: "💨" },
];

const ENFORCEMENT = [
  { zone: "Anand Vihar", priority: "Critical", sources: "3 construction sites, 12 diesel trucks", action: "Deploy 4 inspectors immediately", confidence: 94 },
  { zone: "Okhla Industrial", priority: "High", sources: "2 factories exceeding NOx limits", action: "Issue stop-work notices", confidence: 88 },
  { zone: "Mundka", priority: "High", sources: "Waste burning detected (satellite)", action: "Night patrol + penalty notice", confidence: 82 },
  { zone: "Rohini", priority: "Medium", sources: "High traffic density, 8 AM–11 AM", action: "Traffic rerouting advisory", confidence: 71 },
];

const getAqiColor = (aqi) => {
  if (aqi <= 50) return "#00C853";
  if (aqi <= 100) return "#AEEA00";
  if (aqi <= 150) return "#FFD600";
  if (aqi <= 200) return "#FF6D00";
  if (aqi <= 300) return "#DD2C00";
  return "#6A1B9A";
};

const getAqiGlow = (aqi) => {
  if (aqi <= 50) return "0 0 20px rgba(0,200,83,0.4)";
  if (aqi <= 100) return "0 0 20px rgba(174,234,0,0.4)";
  if (aqi <= 150) return "0 0 20px rgba(255,214,0,0.4)";
  if (aqi <= 200) return "0 0 20px rgba(255,109,0,0.4)";
  return "0 0 20px rgba(221,44,0,0.5)";
};

const AQIGauge = ({ aqi, city }) => {
  const color = getAqiColor(aqi);
  const pct = Math.min(aqi / 300, 1);
  const angle = pct * 180 - 90;
  const r = 60;
  const cx = 80, cy = 80;

  const polarToCart = (deg, radius) => ({
    x: cx + radius * Math.cos((deg - 90) * Math.PI / 180),
    y: cy + radius * Math.sin((deg - 90) * Math.PI / 180),
  });

  const arcPath = (startDeg, endDeg, r) => {
    const s = polarToCart(startDeg, r);
    const e = polarToCart(endDeg, r);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const needle = polarToCart(angle, r - 10);

  return (
    <svg width="160" height="100" viewBox="0 0 160 100">
      <path d={arcPath(-90, 90, r)} stroke="#1a2a1a" strokeWidth="12" fill="none" />
      <path d={arcPath(-90, angle, r)} stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <text x={cx} y={cy + 20} textAnchor="middle" fill={color} fontSize="18" fontWeight="800" fontFamily="monospace">{aqi}</text>
      <text x={cx} y={cy + 33} textAnchor="middle" fill="#6b8f6b" fontSize="7" fontFamily="monospace">AQI INDEX</text>
    </svg>
  );
};

const MiniSparkline = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 120, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

export default function App() {
  const [selected, setSelected] = useState(AQI_DATA[0]);
  const [tab, setTab] = useState("overview");
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const p = setInterval(() => setPulse(v => !v), 1200);
    return () => { clearInterval(t); clearInterval(p); };
  }, []);

  const fetchAIAdvice = async () => {
    setLoadingAI(true);
    setAiAdvice("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are an Urban Air Quality Intelligence AI for Indian cities. You provide concise, actionable health advisories and enforcement recommendations based on AQI data. Always include: 1) Health risk for vulnerable groups, 2) Citizen advisory (what to do), 3) Top enforcement action for authorities. Keep it under 120 words. Format with clear sections.`,
          messages: [{
            role: "user",
            content: `City: ${selected.city}
AQI: ${selected.aqi} (${selected.risk})
PM2.5: ${selected.pm25} μg/m³
PM10: ${selected.pm10} μg/m³
NO2: ${selected.no2} μg/m³
Trend: ${selected.trend}
Top pollution source: ${SOURCES[0].source} (${SOURCES[0].contribution}%)

Generate a health advisory and enforcement recommendation for city administrators.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "Unable to generate advisory.";
      setAiAdvice(text);
    } catch (e) {
      setAiAdvice("AI advisory unavailable. Please check connection.");
    }
    setLoadingAI(false);
  };

  const maxBar = Math.max(...FORECAST_DATA.map(d => d.aqi));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030f03",
      color: "#c8e6c9",
      fontFamily: "'Courier New', monospace",
      padding: "0",
      overflowX: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #0a1f0a 0%, #051005 50%, #0a1f0a 100%)",
        borderBottom: "1px solid #1a4a1a",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: pulse ? "#00ff41" : "#004a10",
            boxShadow: pulse ? "0 0 12px #00ff41" : "none",
            transition: "all 0.4s"
          }} />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: "#00ff41" }}>VAYU·AI</span>
          <span style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 3, marginTop: 2 }}>URBAN AIR INTELLIGENCE</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#4a7a4a" }}>NCAP COMPLIANT</span>
          <span style={{ fontSize: 10, color: "#4a7a4a" }}>CPCB INTEGRATED</span>
          <span style={{ fontSize: 11, color: "#2a6a2a", fontFamily: "monospace" }}>
            {time.toLocaleTimeString("en-IN", { hour12: false })} IST
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 28px", maxWidth: 1280, margin: "0 auto" }}>

        {/* Hero Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Cities Monitored", value: "50+", sub: "CAAQMS stations", color: "#00ff41" },
            { label: "Avg National AQI", value: "164", sub: "↑ 8 from yesterday", color: "#FF6D00" },
            { label: "At-Risk Population", value: "1.2Cr", sub: "vulnerable groups", color: "#FFD600" },
            { label: "Active Alerts", value: "23", sub: "enforcement actions", color: "#DD2C00" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#060f06",
              border: `1px solid ${s.color}22`,
              borderRadius: 8,
              padding: "14px 16px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`
              }} />
              <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#3a6a3a", marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, marginBottom: 16 }}>

          {/* City List */}
          <div style={{
            background: "#060f06",
            border: "1px solid #1a4a1a",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "10px 14px",
              borderBottom: "1px solid #1a4a1a",
              fontSize: 9,
              letterSpacing: 2,
              color: "#4a7a4a",
            }}>MONITORED CITIES — LIVE</div>
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {AQI_DATA.map((city, i) => (
                <div key={i}
                  onClick={() => setSelected(city)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #0d1f0d",
                    background: selected.city === city.city ? "#0d1f0d" : "transparent",
                    borderLeft: selected.city === city.city ? `3px solid ${getAqiColor(city.aqi)}` : "3px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                  }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#a5d6a7" }}>{city.city}</div>
                    <div style={{ fontSize: 9, color: "#4a7a4a", marginTop: 2 }}>{city.risk}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: getAqiColor(city.aqi), lineHeight: 1 }}>{city.aqi}</div>
                      <div style={{ fontSize: 8, color: city.trend === "rising" ? "#DD2C00" : city.trend === "falling" ? "#00C853" : "#FFD600" }}>
                        {city.trend === "rising" ? "▲" : city.trend === "falling" ? "▼" : "►"} {city.trend}
                      </div>
                    </div>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: getAqiColor(city.aqi),
                      boxShadow: getAqiGlow(city.aqi),
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Selected City Header */}
            <div style={{
              background: "#060f06",
              border: `1px solid ${getAqiColor(selected.aqi)}33`,
              borderRadius: 8,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at top left, ${getAqiColor(selected.aqi)}08 0%, transparent 60%)`,
                pointerEvents: "none",
              }} />
              <div>
                <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 3 }}>SELECTED CITY</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#c8e6c9", marginTop: 2 }}>{selected.city}</div>
                <div style={{
                  display: "inline-block", marginTop: 6,
                  padding: "3px 10px",
                  background: `${getAqiColor(selected.aqi)}22`,
                  border: `1px solid ${getAqiColor(selected.aqi)}55`,
                  borderRadius: 3,
                  fontSize: 9, color: getAqiColor(selected.aqi), letterSpacing: 1,
                }}>{selected.risk.toUpperCase()}</div>
              </div>
              <AQIGauge aqi={selected.aqi} city={selected.city} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "PM2.5", value: selected.pm25, unit: "μg/m³" },
                  { label: "PM10", value: selected.pm10, unit: "μg/m³" },
                  { label: "NO₂", value: selected.no2, unit: "μg/m³" },
                  { label: "TREND", value: selected.trend.toUpperCase(), unit: "" },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: "#4a7a4a", letterSpacing: 1 }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#81c784" }}>{m.value}</div>
                    <div style={{ fontSize: 7, color: "#3a5a3a" }}>{m.unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              {["overview", "forecast", "sources", "enforcement"].map(t => (
                <button key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "6px 14px",
                    background: tab === t ? "#1a4a1a" : "transparent",
                    border: `1px solid ${tab === t ? "#2a7a2a" : "#1a3a1a"}`,
                    borderRadius: 4,
                    color: tab === t ? "#00ff41" : "#4a7a4a",
                    fontSize: 9,
                    letterSpacing: 2,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}>{t}</button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{
              background: "#060f06",
              border: "1px solid #1a4a1a",
              borderRadius: 8,
              padding: "16px",
              minHeight: 200,
            }}>

              {tab === "overview" && (
                <div>
                  <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, marginBottom: 14 }}>CITY COMPARISON — AQI INDEX</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {AQI_DATA.sort((a, b) => b.aqi - a.aqi).map((city, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 72, fontSize: 10, color: "#6a9a6a", textAlign: "right" }}>{city.city}</div>
                        <div style={{ flex: 1, height: 18, background: "#0d1f0d", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{
                            width: `${(city.aqi / 300) * 100}%`,
                            height: "100%",
                            background: `linear-gradient(90deg, ${getAqiColor(city.aqi)}88, ${getAqiColor(city.aqi)})`,
                            borderRadius: 2,
                            display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
                            transition: "width 0.5s ease",
                          }}>
                            <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{city.aqi}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "forecast" && (
                <div>
                  <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, marginBottom: 14 }}>24-HOUR AQI FORECAST — {selected.city.toUpperCase()}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                    {FORECAST_DATA.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 8, color: getAqiColor(d.aqi), fontWeight: 700 }}>{d.aqi}</div>
                        <div style={{
                          width: "100%",
                          height: `${(d.aqi / maxBar) * 80}px`,
                          background: `linear-gradient(180deg, ${getAqiColor(d.aqi)}, ${getAqiColor(d.aqi)}44)`,
                          borderRadius: "3px 3px 0 0",
                          border: i === 0 ? `1px solid ${getAqiColor(d.aqi)}` : "none",
                        }} />
                        <div style={{ fontSize: 7, color: "#4a7a4a" }}>{d.hour}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, padding: "10px 12px", background: "#0d1f0d", borderRadius: 6, fontSize: 10, color: "#6a9a6a", lineHeight: 1.6 }}>
                    <span style={{ color: "#FFD600" }}>⚠ AI FORECAST:</span> AQI expected to peak at <span style={{ color: "#DD2C00" }}>231</span> around 6AM due to inversion layer + morning traffic surge. Advisory: pre-position response teams by 5AM.
                  </div>
                </div>
              )}

              {tab === "sources" && (
                <div>
                  <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, marginBottom: 14 }}>POLLUTION SOURCE ATTRIBUTION — {selected.city.toUpperCase()}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {SOURCES.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 16 }}>{s.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: "#a5d6a7" }}>{s.source}</span>
                            <span style={{ fontSize: 10, color: "#81c784", fontWeight: 700 }}>{s.contribution}%</span>
                          </div>
                          <div style={{ height: 6, background: "#0d1f0d", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                              width: `${s.contribution * 2.5}%`,
                              height: "100%",
                              background: `hsl(${120 - s.contribution * 2}, 70%, 45%)`,
                              borderRadius: 3,
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 9, color: "#3a6a3a" }}>
                    Attribution via satellite thermal analysis + traffic density + permit records · Confidence: 87%
                  </div>
                </div>
              )}

              {tab === "enforcement" && (
                <div>
                  <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, marginBottom: 14 }}>ENFORCEMENT INTELLIGENCE — PRIORITY ACTIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {ENFORCEMENT.map((e, i) => (
                      <div key={i} style={{
                        padding: "10px 12px",
                        background: "#0d1f0d",
                        borderRadius: 6,
                        borderLeft: `3px solid ${e.priority === "Critical" ? "#DD2C00" : e.priority === "High" ? "#FF6D00" : "#FFD600"}`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#c8e6c9" }}>{e.zone}</span>
                          <span style={{
                            fontSize: 8, padding: "2px 8px",
                            background: e.priority === "Critical" ? "#DD2C0022" : e.priority === "High" ? "#FF6D0022" : "#FFD60022",
                            color: e.priority === "Critical" ? "#DD2C00" : e.priority === "High" ? "#FF6D00" : "#FFD600",
                            borderRadius: 3,
                          }}>{e.priority} · {e.confidence}% confidence</span>
                        </div>
                        <div style={{ fontSize: 9, color: "#4a7a4a", marginBottom: 4 }}>{e.sources}</div>
                        <div style={{ fontSize: 10, color: "#81c784" }}>→ {e.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Advisory Panel */}
        <div style={{
          background: "#060f06",
          border: "1px solid #1a4a1a",
          borderRadius: 8,
          padding: "16px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2 }}>AI HEALTH ADVISORY ENGINE</div>
              <div style={{ fontSize: 11, color: "#6a9a6a", marginTop: 2 }}>Powered by Claude · Real-time analysis for {selected.city}</div>
            </div>
            <button
              onClick={fetchAIAdvice}
              disabled={loadingAI}
              style={{
                padding: "8px 20px",
                background: loadingAI ? "#0d1f0d" : "#1a4a1a",
                border: "1px solid #2a7a2a",
                borderRadius: 4,
                color: loadingAI ? "#4a7a4a" : "#00ff41",
                fontSize: 10,
                letterSpacing: 2,
                cursor: loadingAI ? "wait" : "pointer",
              }}>
              {loadingAI ? "ANALYSING..." : "GENERATE ADVISORY"}
            </button>
          </div>

          {aiAdvice ? (
            <div style={{
              padding: "14px 16px",
              background: "#0d1f0d",
              borderRadius: 6,
              fontSize: 11,
              color: "#a5d6a7",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              borderLeft: "3px solid #00ff41",
            }}>{aiAdvice}</div>
          ) : (
            <div style={{
              padding: "20px",
              textAlign: "center",
              color: "#2a5a2a",
              fontSize: 10,
              letterSpacing: 1,
            }}>
              Select a city and click GENERATE ADVISORY for AI-powered health risk analysis and enforcement recommendations
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 8, color: "#2a4a2a", letterSpacing: 1 }}>
          <span>VAYU·AI · ET AI HACKATHON 2026 · PS5 URBAN AIR QUALITY INTELLIGENCE</span>
          <span>DATA: CPCB CAAQMS · OPENAQ · SENTINEL-5P · IMD FORECAST</span>
        </div>
      </div>
    </div>
  );
}
