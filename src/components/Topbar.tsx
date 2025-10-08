// src/components/Topbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Lock, LogOut, Settings, UserCircle2 } from "lucide-react";

type TopbarProps = {
  title: string;
  userName: string;
  icon?: React.ReactNode;
  onChangePassword?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  rightExtra?: React.ReactNode;
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
        {icon && <span className="h-5 w-5">{icon}</span>}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* notifications */}
        <button
          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-7 w-7" />
        </button>

       
        <div className="relative" ref={menuRef}>
          {rightExtra ?? (
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="topbar-user-menu"
              className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-gray-50"
            >
              <UserCircle2 className="h-8 w-8 rounded-xl border" />
              <span className="text-sm font-medium">{userName}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}

          {menuOpen && (
            <div
              id="topbar-user-menu"
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
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <button
                role="menuitem"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
