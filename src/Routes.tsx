// src/AppRoutes.tsx
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
import AddRole from './components/AddRole';
import EditRole from './components/EditRole';
import UserQuiz from './components/UserQuiz';
import TakeQuizPage from './components/TakeQuizPage';
import CreateQuizModal from './components/CreateQuizModal';
import CalendarPage from './components/CalendarPage';
import Settings from './components/Settings';
import  QuizDetails  from './components/QuizDetails';
import Role from './components/Role';

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
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Loginpage onLogin={handleLogin} />}
        />

        {/* Protected routes wrapped in the DashboardLayout */}
        <Route
          element={
            isLoggedIn ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/questions" element={<Question />} />

          <Route path="/quiz" element={<QuizPage />} />
        
          <Route path="/quiz/create" element={<CreateQuizModal/>} />

          <Route path="/result" element={<ResultPage />} />
          <Route path="/report" element={<ReportPage />} />
    

          {/* User quiz */}
          <Route path="/userquiz" element={<UserQuiz />} />
          <Route path="/userquiz/take/:quizId" element={<TakeQuizPage />} />
          <Route path="/userquiz/details/:quizId" element={<QuizDetails/>}/>
          

          <Route path="/calendar" element={<CalendarPage/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/role" element={<Role/>}/>
          <Route path="/role/addrole/" element={<AddRole/>} />
          <Route path="/role/editrole/:roleId" element={<EditRole/>}/> 
        </Route>

        {/* 404 */}
        <Route path="*" element={<p>404: Not Found</p>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;




