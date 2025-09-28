// src/components/DashboardLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileBarChart,
  Settings,
 
  FileText,
  
  // ...other imports for your icons
} from 'lucide-react';
import { Link } from 'react-router-dom';
import img from '../assets/loginpageImage/Vector.png';

// NavItem and Sidebar remain the same as previously corrected
const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; to: string }> = ({
  icon,
  label,
  active,
  to,
}) => (
  <Link
    to={to}
    className={[
      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition",
      active ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50",
    ].join(" ")}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const Sidebar: React.FC = () => (
  <aside className="hidden w-64 shrink-0 border-r bg-white p-4 md:flex md:flex-col">
    <div className="mb-8 flex items-center gap-3 px-2">
      <img src={img} alt="DIGICON" className="h-12" />
    </div>
    <nav className="space-y-1">
      <NavItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" to="/dashboard" />
      <NavItem icon={<Users className="h-5 w-5" />} label="User" to="/user" />
      <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Question" to="/questions" />
      <NavItem icon={<FileText className="h-5 w-5" />} label="Quiz" to="/quiz" />
      <NavItem icon={<FileBarChart className="h-5 w-5" />} label="Result" to="/result" />
      <NavItem icon={<FileBarChart className="h-5 w-5" />} label="Report" to="/report" />
      <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" to="/setting" />
      {/* ... other NavItems */}
    </nav>
  </aside>
);

// The main layout component
const DashboardLayout: React.FC = () => (
  <div className="flex min-h-screen bg-gray-50 text-gray-900">
    <Sidebar />
    <div className="flex-1">
      {/* The outlet renders the child route's component */}
      <Outlet />
    </div>
  </div>
);

export default DashboardLayout;