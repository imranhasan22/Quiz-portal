// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Loginpage from './components/LoginPage';
// import DashboardLayout from './components/DashboardLayout';
// import DashboardPage from './components/DashboardPage';
// import UserPage from './components/UserPage';
// import Question from './components/QuestionPage';
// import QuizPage from './components/QuizPage';
// import ResultPage from './components/ResultPage';
// import ReportPage from './components/ReportPage';
// import SettingsPage from './components/SettingsPage';

// const AppRoutes: React.FC = () => {
  
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
//     return localStorage.getItem('isLoggedIn') == 'true';
//   });

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//     localStorage.setItem('isLoggedIn', 'true');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem('isLoggedIn');
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public route for the login page */}
//         <Route
//           path="/"
//           element={isLoggedIn ? <Navigate to="/dashboard"  replace/> : <Loginpage onLogin={handleLogin} />}
//         />

//         {/* Protected routes wrapped in the DashboardLayout */}
//         <Route
//           element={
//             isLoggedIn ? (
//               <DashboardLayout onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/" replace/>
//             )
//           }
//         >
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/user" element={<UserPage />} />
//           <Route path="/questions" element={<Question />} />
//           <Route path="/quiz" element={<QuizPage />} />
//           <Route path="/result" element={<ResultPage />} />
//           <Route path="/report" element={<ReportPage />} />
//           <Route path="/setting" element={<SettingsPage />} />
//         </Route>

//         {/* 404 */}
//         <Route path="*" element={<p>404: Not Found</p>} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;


import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  
} from 'react-router-dom';

// Admin components
import Loginpage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import UserPage from './components/UserPage';
import Question from './components/QuestionPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';

// User components (user portal)
import QuizModal  from './components/userportal/QuizModal';
import CalendarModal from './components/userportal/CalendarModal';
import SettingsModal from './components/userportal/SettingsModal';
import UserLayout from './components/userportal/UserLayout'

type Role = 'admin' | 'user';

const AppRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [role, setRole] = useState<Role>(() => {
    const r = localStorage.getItem('role') as Role | null;
    return r ?? 'user';
  });

  // Loginpage থেকে onLogin("admin" | "user") কল করবে
  const handleLogin = (r: Role) => {
    setIsLoggedIn(true);
    setRole(r);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', r);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
  };

  /** Guard: must be logged in + role match */
  const RequireAuth: React.FC<{ allowed: Role; children: React.ReactNode }> = ({ allowed, children }) => {
    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (role !== allowed) {
      return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/u'} replace />;
    }
    return <>{children}</>;
  };

  const homeAfterLogin = role === 'admin' ? '/admin/dashboard' : '/u';

  return (
    <Router>
      <Routes>
        {/* Public login */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={homeAfterLogin} replace />
            ) : (
              <Loginpage onLogin={handleLogin} />
            )
          }
        />

        {/* ---------- Admin Portal (now under /admin/...) ---------- */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowed="admin">
              <DashboardLayout onLogout={handleLogout} />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="questions" element={<Question />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="setting" element={<SettingsPage />} />
          {/* চাইলে index redirect */}
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
        </Route>

        {/* ---------- User Portal (under /u/...) ---------- */}
        <Route
          path="/u"
          element={
            <RequireAuth allowed="user">
              <UserLayout onLogout={handleLogout} />
            </RequireAuth>
          }
        >
          {/* User home */}
          <Route index element={<QuizModal  />} />
          <Route path="calendar" element={<CalendarModal />} />
          <Route path="settings" element={<SettingsModal />} />
        </Route>

        {/* ---------- Legacy redirects (keep old links working) ---------- */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/user" element={<Navigate to="/admin/user" replace />} />
        <Route path="/questions" element={<Navigate to="/admin/questions" replace />} />
        <Route path="/quiz" element={<Navigate to="/admin/quiz" replace />} />
        <Route path="/result" element={<Navigate to="/admin/result" replace />} />
        <Route path="/report" element={<Navigate to="/admin/report" replace />} />
        <Route path="/setting" element={<Navigate to="/admin/setting" replace />} />

        {/* 404 */}
        <Route path="*" element={<p>404: Not Found</p>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;



