import React from "react";
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import TopbarUser from "./TopbarUser";
import { Settings, ClipboardPlus, CalendarDays } from "lucide-react";
import img from '../../assets/loginpageImage/Vector.png';

export interface UserLayoutProps {
  onLogout: () => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; to: string }> = ({
  icon,
  label,
  to,
}) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      [
        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition',
        isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
      ].join(' ')
    }
  >
    {icon}
    <span className="text-sm">{label}</span>
  </NavLink>
);

const Sidebar: React.FC = () => (
  <aside className="hidden w-64 shrink-0 border-r bg-white p-4 md:flex md:flex-col">
    <div className="mb-8 flex items-center gap-3 px-2">
      <img src={img} alt="DIGICON" className="h-12" />
    </div>
    <nav className="space-y-1">
      {/* index = Quiz */}
      <NavItem icon={<ClipboardPlus className="h-5 w-5" />} label="Quiz" to="/u" />
      <NavItem icon={<CalendarDays className="h-5 w-5" />} label="Calendar" to="/u/calendar" />
      <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" to="/u/settings" />
    </nav>
  </aside>
);

const TITLE_MAP: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/u': { title: 'Quiz', icon: <ClipboardPlus className="h-5 w-5" /> },
  '/u/calendar': { title: 'Calendar', icon: <CalendarDays className="h-5 w-5" /> },
  '/u/settings': { title: 'Settings', icon: <Settings className="h-5 w-5" /> },
};

const UserLayout: React.FC<UserLayoutProps> = ({ onLogout }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const normalized = pathname === '/u/' ? '/u' : pathname;
  const pageMeta = TITLE_MAP[normalized] ?? { title: 'Dashboard' };

  const userName = localStorage.getItem('userName') || 'Imran Hasan';

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopbarUser
          title={pageMeta.title}
          icon={pageMeta.icon}
          userName={userName}

          onSettings={() => navigate('/u/settings')}
          onChangePassword={() => navigate('/u/settings')}
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

export default UserLayout;
