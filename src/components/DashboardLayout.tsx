// src/components/DashboardLayout.tsx
import React from 'react';
import { Outlet, useLocation, useNavigate, Link, matchPath } from 'react-router-dom';
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
  UserCog,
  CalendarDays,
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

/** ---------- Route → Title/Icon mapping (supports dynamic paths) ---------- */
type TitleRule = {
  pattern: string;
  title: string | ((params: Record<string, string>) => string);
  icon?: React.ReactNode;
  end?: boolean;
};

const ROUTE_TITLES: TitleRule[] = [
  { pattern: '/dashboard', title: 'Quiz Portal Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { pattern: '/user', title: 'User', icon: <Users className="h-5 w-5" /> },
  { pattern: '/questions', title: 'Questions', icon: <FileQuestion className="h-5 w-5" /> },

  // Quiz list + child pages
  { pattern: '/quiz', title: 'Quiz', icon: <ClipboardPlus className="h-5 w-5" />, end: true },
  { pattern: '/quiz/create', title: 'New Quiz Creation', icon: <ClipboardPlus className="h-5 w-5" />, end: true },

  { pattern: '/result', title: 'Result', icon: <FileBarChart className="h-5 w-5" /> },
  { pattern: '/report', title: 'Report', icon: <FileBarChart className="h-5 w-5" /> },
  { pattern: '/setting', title: 'Settings', icon: <Settings className="h-5 w-5" /> },

  // UserQuiz pages
  { pattern: '/userquiz', title: 'UserQuiz', icon: <ClipboardPlus className="h-5 w-5" />, end: true },
  {
    pattern: '/userquiz/take/:quizId',
    title: (p) => `Take Quiz ${p.quizId ?? ''}`,
    icon: <ClipboardPlus className="h-5 w-5" />,
    end: true,
  },
  {
    pattern: '/userquiz/details/:quizId',
    title: `Quiz Details`,
    icon: <ClipboardPlus className="h-5 w-5" />,
    end: true,
  },

  { pattern: '/calendar', title: 'Calendar', icon: <CalendarDays className="h-5 w-5" />, end: true },
  { pattern: '/usersetting', title: 'UserSettings', icon: <Settings className='h-5 w-5' />, end: true },
  { pattern:'/role',title:'Role',icon :<UserCog className='h-5 w-5'/>,end:true }
];

/** pick most specific (longest) matched rule; else derive title from URL last segment */
function getPageMeta(pathname: string) {
  let best: { title: string; icon?: React.ReactNode } | null = null;
  let bestLen = -1;

  for (const r of ROUTE_TITLES) {
    const match = matchPath({ path: r.pattern, end: r.end ?? true }, pathname);
    if (!match) continue;

    const title =
      typeof r.title === 'function'
        ? r.title((match.params as unknown) as Record<string, string>)
        : r.title;

    const weight = r.pattern.length; // prefer more specific
    if (weight > bestLen) {
      best = { title, icon: r.icon };
      bestLen = weight;
    }
  }

  if (best) return best;

  // --------- custom fallback (no hard-coded default) ----------
  // derive from last segment of URL, e.g. "/quiz/create" -> "Create"
  const clean = pathname.split('?')[0].replace(/\/+$/, '');
  const seg = clean.split('/').filter(Boolean).pop() || 'dashboard';
  const human = seg
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: human };
}

/** ----------------------------- Sidebar ------------------------------ */
const Sidebar: React.FC<{ pathname: string }> = ({ pathname }) => {
  const isActive = (pattern: string) => !!matchPath({ path: pattern, end: true }, pathname);

  // userquiz active when /userquiz OR /userquiz/take/:quizId
  // const isUserQuizActive =
  //   isActive('/userquiz') || !!matchPath({ path: '/userquiz/take/:quizId', end: true }, pathname);

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white p-4 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={img} alt="DIGICON" className="h-12" />
      </div>
      <nav className="space-y-1">
        <NavItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" to="/dashboard" active={isActive('/dashboard')} />
        <NavItem icon={<Users className="h-5 w-5" />} label="User" to="/user" active={isActive('/user')} />
        <NavItem icon={<FileText className="h-5 w-5" />} label="Question" to="/questions" active={isActive('/questions')} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="Quiz" to="/quiz" active={isActive('/quiz')} />
        <NavItem icon={<FileBarChart className="h-5 w-5" />} label="Result" to="/result" active={isActive('/result')} />
        <NavItem icon={<FileBarChart className="h-5 w-5" />} label="Report" to="/report" active={isActive('/report')} />
        <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" to="/setting" active={isActive('/setting')} />
        <NavItem icon={<ClipboardList className="h-5 w-5" />} label="userQuiz" to="/userquiz" active={isActive('/userquiz')} />
        <NavItem icon={<CalendarDays className="h-5 w-5" />} label="Calendar" to="/calendar" active={isActive('/calendar')} />
        <NavItem icon={<Settings className="h-5 w-5" />} label="UserSettings" to="/usersetting" active={isActive('/usersetting')} />
        <NavItem icon={<UserCog className="h-5 w-5" />} label="Role" to="/role" active={isActive('/role')} />
      </nav>
    </aside>
  );
};

/** ------------------------- Main Layout -------------------------- */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const pageMeta = getPageMeta(pathname);
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

        <main className="flex-1 p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
