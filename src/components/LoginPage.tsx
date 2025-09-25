import type React from "react";
import { useState } from "react";

import img4 from "../assets/loginpageImage/Vector.png"; 
import img8 from "../assets/loginpageImage/ride-side-image.png";

interface LoginPageProps {
  onLogin: () => void;
}
function Loginpage({ onLogin }: LoginPageProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // form handling
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate login success
    onLogin();
    console.log(" your Login attempt:", { employeeId, password, rememberMe });
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-blue-50">
        <div className="w-full max-w-md">
          <div className="flex mb-8 md:mb-10 justify-center md:justify-start">
            <img
              src={img4}
              alt="Vector"
              className="w-auto mt-2"
            />
          </div>

          {/* Header */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-semibold text-black">Log in to your Account</h1>
            <p className="text-gray-600 text-sm md:text-base">Please fill in your credentials to login.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 md:mt-8">
            <div>
              <label className="font-semibold block mb-1" htmlFor="employeeId">
                Employee ID / Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="employeeId"
                type="text"
                placeholder="Enter employee ID or Phone Number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700">
              <label htmlFor="remember" className="flex items-center space-x-2 mb-2 sm:mb-0">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-green-700"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium text-base"
            >
              Login
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-10 text-center">
            <p className="text-sm md:text-lg text-gray-500">
              Do not share your login credentials with anyone.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-7 text-center">
            <p className="text-xs md:text-sm text-gray-400">
              Designed and Developed by <span className="text-purple-600 font-medium">Digicon Technologies PLC</span>
            </p>
          </div>
        </div>
      </div>

    {/* Right side - Illustration with bottom text */}
<div className="flex-1 relative overflow-hidden bg-[#9ae1fb]">
  <img
    src={img8}
    alt="Quiz illustration"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* optional gradient so text is readable on any image */}
  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#9ae1fb] to-transparent" />

  {/* bottom caption */}
  <div className="absolute inset-x-0 bottom-20 z-10 p-6">
    <p className="text-center text-slate-800 text-base md:text-m font-medium">
      Test your knowledge and challenge yourself on our Quiz Portal!
    </p>
    <br/>
    <p className="text-center text-slate-700 text-sm md:text-base">
     Expand Your Digital Creativity
    </p>
  </div>
</div>

     
    </div>
  );
}

export default Loginpage;
