# Data Mining Lab Report Dashboard

A full-stack data mining application featuring a **React + Vite** frontend and a **Flask (Python)** backend that runs an association rules pipeline (FP-Growth / Apriori) with business intelligence insights.

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** (includes `npm`) | 18+ recommended | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.9+ recommended | [python.org](https://www.python.org/) |

### Installation

1. Clone this repository (if you haven't already):
   ```bash
   git clone https://github.com/claireabass/DataMiningLabReport2.git
   cd DataMiningLabReport2
   ```

2. Install **frontend** dependencies:
   ```bash
   npm install
   ```

3. Install **Python backend** dependencies:
   ```bash
   # Use this command if 'pip' is not recognized
   python -m pip install flask flask-cors pandas mlxtend
   ```

   > [!TIP]
   > If `python` is also not recognized, try `py -m pip install ...` or ensure Python is added to your system's PATH.

### Running the Application

> [!IMPORTANT]
> **Both servers must be running at the same time.** The frontend connects to the Python backend at `http://localhost:5000`. If the backend is not running you will see a *"Failed to connect to ML backend"* error.

**Terminal 1 — Start the Python backend:**

```bash
python backend.py
```

The Flask server will start on `http://localhost:5000`.

**Terminal 2 — Start the frontend dev server:**

```bash
npm run dev
```

The Vite server will start on `http://localhost:5173` (or the next available port). Open that URL in your browser.

### Building for Production

When you are ready to deploy the application, you can build the production assets using:

```bash
npm run build
```

This will generate optimized, minified files in the `dist` directory.
