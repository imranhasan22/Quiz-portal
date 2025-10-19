"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { GROUPS } from "../lib/dummy-data";

type PermissionMap = Record<string, boolean>;

const EditRole: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleData = location.state?.role;

  const [roleName, setRoleName] = useState(roleData?.name || "");
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [initialPermissions, setInitialPermissions] = useState<PermissionMap>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const isSuperAdmin = roleData?.name === "Super Admin";
  const currentUserPermissions = isSuperAdmin
    ? GROUPS.flatMap((g) => g.items.map((i) => i.key))
    : roleData?.permissions || [];

  // Initialize permissions (all unchecked by default)
  useEffect(() => {
    if (!roleData) return;

    const Permission: PermissionMap = {};

    GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        const key = `${group.key}.${item.key}`;
        Permission[key] = false; 
      });
    });

    setPermissions(Permission);
    setInitialPermissions(Permission);
  }, [roleData]);

  // ===== Toggle handler =====
  const toggle = (key: string) =>
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));

  // ===== Save handler =====
  const handleSave = () => {
    const isChanged =
      roleName !== roleData?.name ||
      Object.keys(permissions).some(
        (key) => permissions[key] !== initialPermissions[key]
      );

    if (!isChanged || !roleName.trim()) {
      setShowFailure(true);
      return;
    }

    const updatedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key]
    );

    console.log("Updated Role:", roleName);
    console.log(" Updated Permissions:", updatedPermissions);

    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen p-6 text-gray-900">
      <div className="mx-auto max-w-[1400px]">
        {/* ===== Header ===== */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Edit Role</h1>
            <p className="text-sm text-gray-500">
              Modify permissions for this role.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 rounded-lg bg-[#69e8ff] px-3 py-1.5 text-sm font-medium hover:bg-sky-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#5670F7] px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ===== Role name ===== */}
        <div className="mb-6 max-w-sm">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Role Name
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full rounded-lg border border-gray-400 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* ===== Permission Groups ===== */}
        <div className="grid md:grid-cols-2 gap-6">
          {GROUPS.map((group) => (
            <div
              key={group.key}
              className="p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-blue-50"
            >
              {/* Group Header */}
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-blue-700">{group.title}</h2>
              </div>

              {/* Permission Items */}
              {group.items.map((it) => {
                const fullKey = `${group.key}.${it.key}`;
                const hasAccess = currentUserPermissions.includes(it.key);

                return (
                  <div
                    key={it.key}
                    className="flex justify-between items-center py-2 px-3 mb-2 rounded-lg bg-white border hover:bg-blue-50 transition"
                  >
                    <label className="text-sm font-medium text-gray-800">
                      {it.label}
                    </label>
                    <input
                      type="checkbox"
                      checked={permissions[fullKey] || false}
                      onChange={() => toggle(fullKey)}
                      disabled={!isSuperAdmin && !hasAccess}
                      className={`h-4 w-4 accent-blue-600 ${
                        !isSuperAdmin && !hasAccess
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ===== Success Popup ===== */}
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
                ✅ Role updated successfully!
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

        {/* ===== Failure Popup ===== */}
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
                ❌ Failed to save permissions — no changes detected.
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
      </div>
    </div>
  );
};

export default EditRole;
