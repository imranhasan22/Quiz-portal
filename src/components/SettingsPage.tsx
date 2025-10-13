"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  FileQuestion,
  Users,
  BookOpenCheck,
  FileBarChart,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type PermissionMap = Record<string, boolean>;
type RolePermissions = Record<string, PermissionMap>;
type Group = {
  key: string;
  icon?: React.ReactNode;
  title: string;
  items: { key: string; label: string }[];
};

const GROUPS: Group[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />,
    items: [
      { key: "quiz_activity", label: "Quiz’s Activity" },
      { key: "process_ratio", label: "Process Wise Pass & Fail Ratio" },
    ],
  },
  {
    key: "user",
    title: "User",
    icon: <Users className="h-3.5 w-3.5 text-blue-600" />,
    items: [
      { key: "user_table", label: "User Table" },
      { key: "create_user", label: "Create User" },
      { key: "remove_user", label: "Remove User" },
      { key: "view_user", label: "View User" },
    ],
  },
  {
    key: "question",
    title: "Question",
    icon: <FileQuestion className="h-3.5 w-3.5 text-purple-600" />,
    items: [
      { key: "create_question", label: "Question Create" },
      { key: "view_question", label: "View Question" },
      { key: "edit_question", label: "Edit Question" },
      { key: "upload_question", label: "Upload Question" },
      { key: "export_question", label: "Export Question" },
    ],
  },
  {
    key: "quiz",
    title: "Quiz",
    icon: <BookOpenCheck className="h-3.5 w-3.5 text-green-600" />,
    items: [
      { key: "quiz_create", label: "Quiz Create" },
      { key: "quiz_upload", label: "Upload Quiz" },
      { key: "quiz_export", label: "Export Quiz" },
      { key: "quiz_edit", label: "Edit Quiz" },
    ],
  },
  {
    key: "result",
    title: "Result",
    icon: <FileBarChart className="h-3.5 w-3.5 text-amber-600" />,
    items: [
      { key: "result_export", label: "Result Export" },
      { key: "view_result", label: "View Result" },
    ],
  },
  {
    key: "report",
    title: "Report",
    icon: <Shield className="h-3.5 w-3.5 text-rose-600" />,
    items: [
      { key: "report_export", label: "Report Export" },
      { key: "report_delete", label: "Report Delete" },
    ],
  },
];

const ROLES = ["Admin", "Supervisor", "Agent", "Viewer"];

const emptyRolePerms = (): RolePermissions =>
  ROLES.reduce((acc, role) => {
    const gmap: Record<string, boolean> = {};
    GROUPS.forEach((g) => g.items.forEach((it) => (gmap[`${g.key}.${it.key}`] = false)));
    acc[role] = gmap;
    return acc;
  }, {} as RolePermissions);

const SettingsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [rolePerms, setRolePerms] = useState<RolePermissions>(emptyRolePerms);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
 
  const navigate = useNavigate();

  const current: PermissionMap | null = useMemo(() => {
    if (!selectedRole) return null;
    return rolePerms[selectedRole];
  }, [rolePerms, selectedRole]);

  const toggle = (fullKey: string) => {
    if (!selectedRole) return;
    setRolePerms((prev) => ({
      ...prev,
      [selectedRole]: { ...prev[selectedRole], [fullKey]: !prev[selectedRole][fullKey] },
    }));
  };

  const setGroupAll = (groupKey: string, value: boolean) => {
    if (!selectedRole) return;
    setRolePerms((prev) => {
      const next = { ...prev[selectedRole] };
      GROUPS.find((g) => g.key === groupKey)?.items.forEach((it) => {
        next[`${groupKey}.${it.key}`] = value;
      });
      return { ...prev, [selectedRole]: next };
    });
  };

  const useHeaderCheckbox = (groupKey: string) => {
    const all = GROUPS.find((g) => g.key === groupKey)!.items.map((it) => `${groupKey}.${it.key}`);
    const checkedCount = all.filter((k) => current?.[k]).length;
    const allCount = all.length;
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = checkedCount > 0 && checkedCount < allCount;
      }
    }, [checkedCount, allCount]);
    return {
      ref,
      checked: checkedCount === allCount && allCount > 0,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setGroupAll(groupKey, e.target.checked),
    };
  };

  const canSave = !!selectedRole;

  const resetRolePerms = (pm: PermissionMap): PermissionMap =>
    Object.fromEntries(Object.keys(pm).map((k) => [k, false])) as PermissionMap;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      const payload = rolePerms[selectedRole];
      const anyTrue = Object.values(payload).some(Boolean);

      if (anyTrue) {
        console.log("Selected Role:", selectedRole);
        console.log("Permissions:", payload);

        // ✅ Reset permissions
        setRolePerms((prev) => ({
          ...prev,
          [selectedRole]: resetRolePerms(prev[selectedRole]),
        }));

        // ✅ Reset role name input
        setSelectedRole("");

        setShowSuccess(true);
      } else {
        throw new Error("No permissions selected");
      }
    } catch (e) {
      setShowFailure(true);
      setSelectedRole("");
    }
  };

  return (
    <div className="flex min-h-screen text-gray-900">
      <div className="flex-1">
        <main className="mx-auto w-full max-w-[1300px] px-4 py-5 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Add Role</h2>

          {/* Role name input */}
          <div className="mb-4">
            <label className="mb-1 block text-[13px] font-medium text-gray-800">
              Role Name
            </label>
            <input
              type="text"
              value={selectedRole}
              onChange={(e) => {
                const newRole = e.target.value.trim();
                setSelectedRole(newRole);

                //  Always reset permissions for new typed role
                setRolePerms((prev) => {
                  if (!newRole) return prev;
                  const newPerms: PermissionMap = {};
                  GROUPS.forEach((g) =>
                    g.items.forEach((it) => {
                      newPerms[`${g.key}.${it.key}`] = false;
                    })
                  );
                  return { ...prev, [newRole]: newPerms };
                });
              }}
              placeholder="Enter role name (e.g. Admin)"
              className="w-full max-w-sm rounded-xl border border-gray-400 px-3 py-1.5 text-[13px] text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Permission groups */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            {GROUPS.map((g) => {
              const hdr = useHeaderCheckbox(g.key);
              return (
                <section key={g.key} className="rounded-lg border bg-white shadow-sm text-[13px]">
                  <header className="flex items-center justify-between rounded-t-lg bg-gray-100 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm">
                        {g.icon ?? <Shield className="h-3.5 w-3.5 text-gray-700" />}
                      </div>
                      <h3 className="text-[13px] font-semibold">{g.title}</h3>
                    </div>
                    <input
                      type="checkbox"
                      ref={hdr.ref}
                      checked={hdr.checked}
                      onChange={hdr.onChange}
                      disabled={!current}
                      className="h-3.5 w-3.5"
                    />
                  </header>

                  <div className="px-3 py-3">
                    {g.items.map((it) => {
                      const fullKey = `${g.key}.${it.key}`;
                      const val = current?.[fullKey] ?? false;
                      return (
                        <label
                          key={it.key}
                          className="mb-2 flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 hover:bg-gray-50 last:mb-0"
                        >
                          <span className="text-gray-800">{it.label}</span>
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5"
                            disabled={!current}
                            checked={val}
                            onChange={() => toggle(fullKey)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-5 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-4 py-1.5 text-[13px] font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={!canSave}
              onClick={handleSave}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-[13px] font-medium ${
                !canSave
                  ? "bg-[#5670F7] text-[#FDFFFF] cursor-not-allowed"
                  : "bg-[#5670F7] text-[#FDFFFF] hover:bg-blue-600"
              }`}
            >
              Save
            </button>
          </div>
        </main>
      </div>

      {/* Failure popup */}
      {showFailure && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 shadow-inner">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="mb-6 text-center text-lg font-semibold text-gray-800">
              ❌ Failed to save permissions.
            </p>
            <button
              onClick={() => setShowFailure(false)}
              className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:scale-[1.02] hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="mb-6 text-center text-lg font-semibold text-gray-800">
              🎉 Role added successfully!
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:scale-[1.02] hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
