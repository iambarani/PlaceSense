# PlaceSense - Advanced Placement Prediction System

PlaceSense is a modernized placement preparation and prediction platform for students and faculty. It features a robust SQL backend and an ML-enhanced prediction engine to help students identify their readiness for top-tier companies.

## Recent Updates (March 2026)

### 🚀 SQL Backend Integration
- **Node.js/Express Server**: A new full-stack backend handles data persistence via MySQL.
- **Relational Data Mapping**: Student profiles are now constructed from multiple joined tables including `students`, `school_academics`, `college_academics`, and `student_experience`.
- **RESTful API**: Professional API endpoints for profile management, company lookups, and prediction history.

### 🧠 ML-Enhanced Placement Prediction
- **Weighted Scoring Model**: Evaluation using weighted factors (CGPA, Skill Match, Projects) compared against real company criteria (`company_expectations`).
- **Explainable AI (XAI)**: A new "Model Insights" section in the UI provides transparency into the prediction algorithm's decision-making process.
- **Dynamic Action Plans**: Strategic career roadmaps are generated based on identified skill gaps and academic history.

## Setup & Installation

### 1. Frontend
```bash
npm install
npm run dev
```

### 2. Backend
1. Navigate to the `/server` directory.
2. Run `npm install`.
3. Create a `.env` file from the provided `.env.example`.
4. Run `npm start` or `npm run dev`.

## Environment Variables (.env)
- `DB_HOST`: Your MySQL host (e.g., localhost)
- `DB_USER`: Your MySQL username
- `DB_PASSWORD`: Your MySQL password
- `DB_NAME`: `placesense`
- `PORT`: 5000 (standard backend port)
