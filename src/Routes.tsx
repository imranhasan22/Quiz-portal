

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Loginpage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout'; // Import the new layout component
import DashboardPage from './components/DashboardPage';
import UserPage from './components/UserPage';
import Question from './components/QuestionPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';


const AppRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* Public route for the login page */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Loginpage onLogin={handleLogin} />}
        />
        
        {/* Protected routes wrapped in the DashboardLayout */}
        <Route element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/questions" element={<Question />} />
          <Route path="/quiz" element={<QuizPage/>}/>
          <Route path="result" element={<ResultPage/>}/>
          <Route path="report" element={<ReportPage/>}/>
          <Route path="setting" element={<SettingsPage/>}/>
          {/* Add more protected routes here */}
        </Route>
        
        {/* Optional: Add a catch-all for a 404 Not Found page */}
        <Route path="*" element={<p>404: Not Found</p>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;