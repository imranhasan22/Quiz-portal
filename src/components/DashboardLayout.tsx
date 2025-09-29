// src/components/DashboardLayout.tsx
import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import Topbar from './Topbar';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileBarChart,
  Settings,
  FileText,
  FileQuestion,
  ClipboardPlus,
} from 'lucide-react';
import img from '../assets/loginpageImage/Vector.png';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; to: string; active?: boolean }> = ({
  icon,
  label,
  to,
  active,
}) => (
  <Link
    to={to}
    className={[
      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition',
      active ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
    ].join(' ')}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

type DashboardLayoutProps = {
  onLogout: () => void;
};

const Sidebar: React.FC<{ pathname: string }> = ({ pathname }) => (
  <aside className="hidden w-64 shrink-0 border-r bg-white p-4 md:flex md:flex-col">
    <div className="mb-8 flex items-center gap-3 px-2">
      <img src={img} alt="DIGICON" className="h-12" />
    </div>
    <nav className="space-y-1">
      <NavItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" to="/dashboard" active={pathname === '/dashboard'} />
      <NavItem icon={<Users className="h-5 w-5" />} label="User" to="/user" active={pathname === '/user'} />
      <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Question" to="/questions" active={pathname === '/questions'} />
      <NavItem icon={<FileText className="h-5 w-5" />} label="Quiz" to="/quiz" active={pathname === '/quiz'} />
      <NavItem icon={<FileBarChart className="h-5 w-5" />} label="Result" to="/result" active={pathname === '/result'} />
      <NavItem icon={<FileBarChart className="h-5 w-5" />} label="Report" to="/report" active={pathname === '/report'} />
      <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" to="/setting" active={pathname === '/setting'} />
    </nav>
  </aside>
);

// Map route → title (and optional icon if you want to show a page icon in Topbar)
const TITLE_MAP: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/dashboard': { title: 'Quiz Portal Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  '/user': { title: 'User', icon: <Users className="h-5 w-5" /> },
  '/questions': { title: 'Questions', icon: <FileQuestion className="h-5 w-5" /> },
  '/quiz': { title: 'Quiz', icon: <ClipboardPlus className="h-5 w-5" /> },
  '/result': { title: 'Result', icon: <FileBarChart className="h-5 w-5" /> },
  '/report': { title: 'Report', icon: <FileBarChart className="h-5 w-5" /> },
  '/setting': { title: 'Settings', icon: <Settings className="h-5 w-5" /> },
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const pageMeta = TITLE_MAP[pathname] ?? { title: 'Dashboard' };

  // Get the user name from storage (or however you store it at login)
  const userName = localStorage.getItem('userName') || 'Imran Hasan';
  

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar pathname={pathname} />

      {/* Right side: column with Topbar + content */}
      <div className="flex-1 flex flex-col">
        <Topbar
          title={pageMeta.title}
          icon={pageMeta.icon}
          userName={userName}
          onSettings={() => navigate('/setting')}
          onChangePassword={() => navigate('/setting')} 
          onLogout={() => {
            onLogout();                
            navigate('/', { replace: true }); 
          }}
        />

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
