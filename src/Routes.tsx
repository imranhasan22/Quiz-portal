import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Loginpage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import UserPage from './components/UserPage';
import Question from './components/QuestionPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';

const AppRoutes: React.FC = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') == 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <Routes>
        {/* Public route for the login page */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard"  replace/> : <Loginpage onLogin={handleLogin} />}
        />

        {/* Protected routes wrapped in the DashboardLayout */}
        <Route
          element={
            isLoggedIn ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace/>
            )
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/questions" element={<Question />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/setting" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<p>404: Not Found</p>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
