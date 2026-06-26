# 🌬️ VAYU·AI — Edge-Powered Air Quality Intelligence for Smart Cities

> **Hackathon Submission | Problem Statement 5: AI-Powered Urban Air Quality Intelligence for Smart City Intervention**  
> **Team:** UPHORIA | **Platform:** Unstop

---

## 🚨 Problem Statement

Urban air pollution is a silent crisis. Cities lack **real-time, actionable intelligence** to detect pollution hotspots, predict dangerous AQI spikes, and trigger timely interventions — putting millions of citizens at risk every day.

---

## 💡 Solution — VAYU·AI

VAYU·AI is an **AI-powered air quality intelligence platform** that provides real-time monitoring, predictive analytics, and smart city intervention recommendations through an intelligent React dashboard integrated with Claude AI.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **Real-Time AQI Dashboard** | Live air quality index visualization across city zones |
| 🤖 **Claude AI Integration** | Natural language insights, anomaly explanations & intervention recommendations |
| 🗺️ **Pollution Heatmap** | Geographic hotspot detection across urban zones |
| ⚠️ **Smart Alerts** | Automated threshold-based alerts for AQI spikes |
| 📈 **Trend Analytics** | Historical AQI trends and predictive pattern analysis |
| 🏙️ **Smart City Interventions** | AI-generated actionable recommendations for city authorities |

---

## 🏗️ Architecture

![VAYU·AI Architecture](./architecture/architecture-diagram.png)

**Core Components:**
- **Frontend:** React.js dashboard with real-time data visualization
- **AI Engine:** Claude API for intelligent insights and natural language recommendations
- **Edge Layer:** ESP32-based IoT sensors (MQ135, DHT22) for air quality data collection
- **Data Pipeline:** MQTT protocol for real-time sensor data streaming

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Recharts, Tailwind CSS |
| AI/LLM | Anthropic Claude API |
| Edge/IoT | ESP32, MQ135, DHT22, MQTT |
| Deployment | GitHub Pages / Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Anthropic API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/KasanagottuSnehith/VAYU-AI.git
cd VAYU-AI

# Install frontend dependencies
cd frontend
npm install

# Add your Claude API key
# Create .env file in /frontend
echo "REACT_APP_CLAUDE_API_KEY=your_api_key_here" > .env

# Start the dashboard
npm start
```

---

## 🌍 Impact

- **Real-time visibility** into urban air quality for city authorities
- **AI-driven recommendations** to reduce pollution exposure for citizens
- **Early warning system** to prevent health emergencies
- **Scalable** to any smart city with IoT sensor infrastructure

---

## 👨‍💻 Team UPHORIA

| Name | Role |
|---|---|
| Snehith Kasanagottu | Full Stack & AI Integration |

---

## 📄 Problem Statement Reference

**PS 5:** AI-Powered Urban Air Quality Intelligence for Smart City Intervention  
**Competition:** Unstop Hackathon — Revolutionizing the Future

---

> *Built with ❤️ by Team UPHORIA for a cleaner, smarter urban future.*
