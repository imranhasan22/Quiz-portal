// src/components/Topbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Lock, LogOut, Settings, UserCircle2 } from "lucide-react";

type TopbarProps = {
  title: string;                 // e.g. "User" / "Question"
  userName: string;             // e.g. "Imran Hasan
  icon?: React.ReactNode; // 👈 New prop for custom icon          // default: true
  onChangePassword?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  rightExtra?: React.ReactNode;  // extra content at the right (optional)
};

const Topbar: React.FC<TopbarProps> = ({
  title,
  userName = "",
 
  icon,
  onChangePassword,
  onSettings,
  onLogout,
  rightExtra,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
         {/* 👇 If no custom icon is passed, fallback to nothing */}
        {icon && <span className="h-5 w-5">{icon}</span>}
        
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center">
        
          <button
            className="mr-16 grid h-8 w-8 place-items-center rounded-xl border hover:bg-gray-50"
            aria-label="Notifications"
          >
            <Bell className="h-7 w-7" />
          </button>
        

        {rightExtra ?? (
          <div className="items-center gap-3 ml-5 bg-white px-2 py-2 md:flex">
            <UserCircle2 className="grid h-8 w-8 rounded-xl border hover:bg-gray-50" />
            <span className="text-xm font-medium">{userName}</span>
          </div>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-gray-50"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <ChevronDown
              className={`h-4 w-4 ml-6 transition-transform duration-200 ${
                menuOpen ? "-translate-y-0.5 rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg"
            >
              <button
                role="menuitem"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  onChangePassword?.();
                }}
              >
                <Lock className="h-4 w-4" />
                Change Password
              </button>

              <button
                role="menuitem"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  onSettings?.();
                }}
              >
                <Settings className="h-4 w-4" /> Settings
              </button>

              <button
                role="menuitem"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
