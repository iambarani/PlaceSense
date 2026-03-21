# PlaceSense - Unified Next.js AI Predictor

PlaceSense is an AI-driven placement prediction platform, now consolidated into a modern **Next.js App Router** architecture.

## 🚀 Unified Architecture (Next.js)

We have migrated from a split Vite + Express setup to a single, high-performance framework:
- **Zero-Latency API Routes**: Backend logic is now integrated directly into the `src/app/api` directory.
- **Modern Routing**: Uses the Next.js App Router for faster navigation and server-side optimization.
- **Clean Structure**: No more separate `server` folder—everything is managed within a single project root.

## Setup & Installation

### 1. Configure Environment
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=placesense
```

### 2. Run the Application
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## Directory Structure
- `src/app`: Pages (`profile`, `analysis`, `predict`) and API routes.
- `src/components`: Shared UI components like the Sidebar Navigation.
- `src/hooks`: Custom React hooks like `useStorage`.
- `src/lib`: Core utilities like the MySQL database connection pool.
