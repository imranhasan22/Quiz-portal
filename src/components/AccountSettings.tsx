
import React, { useState, useEffect } from "react";
import { Save, Mail,Layers, XCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const AccountSettings: React.FC = () => {
  const initialData = {
    email: "admin@example.com",
    username: "AdminUser",
    process: "Nagad",
    // roleManage: true,
  };

  const [email, setEmail] = useState(initialData.email);
  const [username, setUsername] = useState(initialData.username);
  const [process, setProcess] = useState(initialData.process);
//   const [roleManage, setRoleManage] = useState(initialData.roleManage);

  const [isEdited, setIsEdited] = useState(false);

  // Popup states
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const onClosePopup = () => {
    setShowFailure(false);
    setShowSuccess(false);
  };

  // Check if any field has changed
  useEffect(() => {
    if (email !== initialData.email || username !== initialData.username || process !== initialData.process) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [email, username,process]);

  const handleSave = () => {
    if (!email || !username || !process) {
      setShowFailure(true);
      return;
    }

    setShowSuccess(true);
    console.log("Saved:", { email, username, process });

    // Update initial data to current values after save
    initialData.email = email;
    initialData.username = username;
    initialData.process=process
    // initialData.roleManage = roleManage;
    setIsEdited(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Admin Profile */}
      <Card className="shadow-sm border">
       

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div >
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 "
                />
              </div>
            </div>


              <div>
              <Label htmlFor="text">Process</Label>
              <div className="relative mt-2">
                <Layers className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input
                  id="process"
                  type="text"
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
           
            
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!isEdited} 
              className={`flex items-center gap-2 ${!isEdited ? "bg-blue-600 cursor-not-allowed" : "bg-blue-600 cursor-pointer hover:bg-blue-700"}`}
            > 
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popups */}
      {showFailure && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl text-center w-[300px]">
            <XCircle className="mx-auto text-red-500 h-10 w-10 mb-3" />
            <h3 className="font-semibold mb-2">Failed to Save Changes</h3>
            <button
              onClick={onClosePopup}
              className="mt-2 w-full rounded-lg bg-red-500 cursor-pointer text-white py-1.5 hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl text-center w-[300px]">
            <CheckCircle2 className="mx-auto text-green-500 h-10 w-10 mb-3" />
            <h3 className="font-semibold mb-2">Successfully Saved!</h3>
            <button
              onClick={onClosePopup}
              className="mt-2 w-full rounded-lg bg-green-500 cursor-pointer text-white py-1.5 hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;



      {/* Roles Manage */}
      {/* <Card className="shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-gray-700" />
            <CardTitle className="text-lg font-semibold">Roles Manage</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border rounded-lg px-4 py-3">
            <div>
              <p className="font-medium text-sm">Allow Role Management</p>
              <p className="text-xs text-gray-500">
                Enable this option to manage user roles and permissions.
              </p>
            </div>
            <Switch checked={roleManage} onCheckedChange={setRoleManage} />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Save size={16} /> Update Roles
            </Button>
          </div>
        </CardContent>
      </Card> */}