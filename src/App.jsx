import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Predict from './pages/student/Predict';
import Analysis from './pages/student/Analysis';
import FacultyDashboard from './pages/faculty/Dashboard';
import CompanyData from './pages/faculty/CompanyData';
import Analytics from './pages/faculty/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Helper to redirect legacy routes if needed, but mainly standard routes */}
        <Route path="/" element={<Landing />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/predict" element={<Predict />} />
        <Route path="/student/analysis" element={<Analysis />} />

        {/* Faculty Routes */}
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/companies" element={<CompanyData />} />
        <Route path="/faculty/analytics" element={<Analytics />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

