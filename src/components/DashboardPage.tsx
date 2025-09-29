import React from "react";
import { useState, useRef } from "react";
import Topbar from "./Topbar";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileBarChart,

  ChevronDown,
  CalendarDays,
  Download,

  UserCircle2,
  CheckSquare,

} from "lucide-react";


const skills = ["IB", "Sales", "Support", "QA"];


const processes = [
  "Haier",
  "Titas",
  "Link3",
  "Xiaomi",
  "Bexcom",
  "Nagad",
  "Hatil",
  "MMBL",
  "SBL",
  "Whirlpool",
  "LG",
  "BTCL",
  "UML",
  "Linde",
  "Coca-Cola",
  "CTGWASA",
  "NCSA",
  "DESCO",
  "RAL",
  "VECV",
  "Jadoo",
  "Agni",
  "BREB",
  "BPDB",
];

const chartData = processes.map((name) => ({
  name,
  pass: Math.floor(30 + Math.random() * 55),
  fail: Math.floor(10 + Math.random() * 30),
}));

// --- Small UI helpers ---
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="rounded-2xl border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 text-gray-600">
      <div className="grid h-10 w-10 place-items-center rounded-xl border bg-gray-50">{icon}</div>
      <div className="text-sm">{label}</div>
    </div>
    <div className="mt-3 text-2xl font-semibold">{value}</div>
  </div>
);

const FilterPill: React.FC<{
  label: string;
  value?: string;
}> = ({ label, value }) => (
  <button className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
    <span>{label}</span>
    <span className="font-medium text-gray-900">{value ?? "All"}</span>
    <ChevronDown className="h-4 w-4" />
  </button>
  
)
const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, options, placeholder, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="appearance-none rounded-xl border bg-white px-3 py-2 pr-8 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        {/* ✅ placeholder option shown when value === "" */}
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <ChevronDown
        className={`pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"   // ✅ fixed class
          }`}
      />
    </div>
  );
};

const Banner: React.FC = () => (
  <div className="rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700">
    <div className="flex items-center gap-2">
      <span className="text-gray-500">//</span>
      <div className="whitespace-nowrap overflow-hidden">
        <div className="animate-[scroll_25s_linear_infinite] inline-block">
          <span className="mx-6">Nagad Trainee Quiz Today at 3.30 PM.</span>
          <span className="mx-6">New Quiz Schedule Added for Bexcom Agent 30th December, 2024.</span>
          <span className="mx-6">New Employee - Training Batch B starts tomorrow.</span>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes scroll { from { transform: translateX(0%); } to { transform: translateX(-50%); } }
    `}</style>
  </div>
);

const ChartCard: React.FC<{ data: { name: string;fail: number;pass: number; }[] }> = ({ data }) => (
  <div className="rounded-2xl border bg-white p-4 md:p-6">
    <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h3 className="text-base font-semibold">Process Wise Pass & Fail Ratio</h3>
      </div>
      <div className="flex items-center gap-2">
        <FilterPill label="March 2024" />
        <button className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-gray-50" aria-label="Download">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>

    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={10}>
          <XAxis dataKey="name" angle={-35} textAnchor="end" height={60} interval={0} tick={{ fontSize: 15, fill: "#161618ff" }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ paddingBottom: 8 }} />

          <Bar dataKey="pass" name="Pass" radius={[2, 3, 0, 0]} fill="#196074ff" />
          <Bar dataKey="fail" name="Fail" radius={[2, 3, 0, 0]} fill="#41213aff" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-3 h-3 rounded-full bg-gray-200">
      <div className="h-3 w-2/3 rounded-full bg-gray-400" />
    </div>
  </div>
);


const Content: React.FC = () => {
  const [selectedProcess, setSelectedProcess] = useState<string>("All Process");
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  // dropdownের options
  const processOptions = ["All Process", ...processes];

  // data ফিল্টার: শুধু Process অনুযায়ী (ডেমো)
  const filteredData =
    selectedProcess === "All Process"
      ? chartData
      : chartData.filter((d) => d.name === selectedProcess);

  // date shows

  const [selectedDate, setSelectedDate] = useState<string>(""); // ISO yyyy-mm-dd
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    // modern browsers
    // @ts-ignore - showPicker not in TS DOM types for all targets
    dateInputRef.current?.showPicker?.();
    // fallback
    dateInputRef.current?.click();
  };

  const displayDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "Today";



  return (
    <div className="flex-1 bg-gray-50">
      {/* topbar calls here
        <Topbar
          title= "Quiz Portal Admin Dashboard"
          userName="Imran Hasan"
          onSettings={() => { }}
          onChangePassword={() => { }}
          onLogout={() => { }}
          icon={<LayoutDashboard />}
        /> */}
       

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
        <Banner />

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Quiz’s Activity</h2>

            {/* ⬇️ এখানে Select গুলো */}
            <div className="flex items-center gap-2">
              <SelectField
                value={selectedProcess}
                onChange={setSelectedProcess}
                options={processOptions}
              />
              <SelectField
                value={selectedSkill}
                onChange={setSelectedSkill}
                options={skills}
                placeholder="Select Skills"
              />
              {/* <button className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm">
                <span>Today</span>
                <CalendarDays className="h-4 w-4" />
              </button> */}
              

              {/* date button  */}
              <div className="relative">
                <button
                  onClick={openDatePicker}
                  className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm"
                  type="button"
                >
                  <span>{displayDate}</span>
                  <CalendarDays className="h-4 w-4" />
                </button>

                {/* hidden input that triggers the native calendar */}
                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="sr-only"   // keep it accessible but visually hidden
                />
              </div>


            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard icon={<CheckSquare className="h-5 w-5" />} label="Active Quiz" value={45} />
            <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Total Quiz" value={254} />
            <StatCard icon={<Users className="h-5 w-5" />} label="Total Participants" value={352} />
            <StatCard icon={<FileBarChart className="h-5 w-5" />} label="Total Attempted" value={652} />
            <StatCard icon={<UserCircle2 className="h-5 w-5" />} label="Top Scorer" value={15} />
          </div>
        </section>

        <section className="mt-6">
          {/* ⬇️ ফিল্টারড ডাটা পাঠাচ্ছি */}
          <ChartCard data={filteredData} />
        </section>
      </main>
    </div>
  );
};


// --- Page Layout ---
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50 text-gray-900">
    {/* <Sidebar /> */}
    {children}
  </div>
);

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Content />
    </DashboardLayout>
  );
};

export default DashboardPage;
