
import React, { useState } from "react";
import { User } from "lucide-react";
import Sessions from "./Sessions";
import AccountSettings from "./AccountSettings";

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 min-h-screen">
      {/* Left Sidebar */}
      <div className="col-span-1">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center mb-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold">Super Admin</h2>
          <br/>
          <button className="bg-green-100 cursor-pointer text-green-700 px-4 py-1 rounded-md text-sm font-medium">
            Change Avatar
          </button>
        </div>

        {/* Roles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-2">Roles</h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            Super Admin
          </span>
        </div>

        {/* Manage */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-2">Manage</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-3 py-2 rounded-md cursor-pointer text-sm ${
                  activeTab === "account"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Account Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`w-full text-left px-3 py-2 rounded-md cursor-pointer text-sm ${
                  activeTab === "sessions"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Sessions
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("permissions")}
                className={`w-full text-left px-3 py-2 rounded-md cursor-pointer text-sm ${
                  activeTab === "permissions"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Permissions
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Content */}
      <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
        {activeTab === "account" &&  (
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Details</h2>
            <AccountSettings/>
          </div>
        )}

        {activeTab === "sessions" && <Sessions />}

        {activeTab === "permissions" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Permissions</h2>
            <p > permissions mapping here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
