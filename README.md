# A React based graphical user interface for Bluesky Adaptive Agents
🎯 Key Features
- Real-Time Visualization: Plotly-powered graphs show results from the agent ingesting and creating reports
- K-means Integration: Real-time clustering via ScikitJS and TensorFlow.js
- 2D/1D Mode Switching: Supports multiple data dimensionalities with dynamic component rendering
- Interactive Cluster Exploration: Navigate through cluster centers, inspect distance heatmaps, and compare observables
  
🧩 Technologies Used
- Frontend: React.js (with MVVM architecure), JavaScript, TypeScript
- Visualization: Plotly.js
- Clustering/ML: ScikitJS, TensorFlow.js
- Backend Simulation: Bluesky Pods
  
🚀 Getting Started

### 1. Backend Setup (Required)

This GUI communicates with a running **Bluesky Adaptive backend** provided by the Bluesky Pods repository:

https://github.com/bluesky/bluesky-pods/tree/main/compose/bluesky-adaptive

Follow the setup instructions in that repository to start the backend services using:

```bash
podman-compose -f compose.yaml up -d
```
### 2. Start the UI

To run the application locally, follow these steps:
  1. **Clone the repository**
      ```bash
      git clone https://github.com/ZeynepST/bluesky-adaptive-agent-ui
      cd bluesky-adaptive-agent-ui
      ```
  2. **Install dependencies**
     ```bash
     npm install
     ```
  4. **Start the development server**
     ```bash
     npm start
     ```
This will launch the GUI in your default browser at http://localhost:3000
