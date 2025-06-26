"use client";
// import Main from "@/components/General/Layout/Main";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import Sidebar from "@/components/General/Layout/Sidebar";
import Header from "@/components/General/Layout/Header";

type BarDataItem = {
  name: string;
  users: number;
};

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: BarDataItem;
}

const barData: BarDataItem[] = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 300 },
  { name: "Mar", users: 500 },
  { name: "Apr", users: 200 },
  { name: "May", users: 700 },
];

const pieData = [
  { name: "Chrome", value: 600 },
  { name: "Firefox", value: 300 },
  { name: "Safari", value: 100 },
];

const maxValue = Math.max(...barData.map((item) => item.users));

const CustomBarShape = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
}: CustomBarProps) => {
  const isMax = payload?.users === maxValue;
  const fill = isMax ? "url(#gradientMax)" : "#DBE7FE";
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
};

const pieColors = ["#B0D8D8", "#FFDD6D", "#B8BDD1"];

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<
    Record<string, { name: string; point: number }[]>
  >({});
  const [selectedBrand, setSelectedBrand] = useState("BrandA");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const generateData = () => {
      return {
        BrandA: Array.from({ length: 13 }, (_, i) => ({
          name: `Employee A${i + 1}`,
          point: Math.floor(Math.random() * 100),
        })),
        BrandB: Array.from({ length: 8 }, (_, i) => ({
          name: `Employee B${i + 1}`,
          point: Math.floor(Math.random() * 100),
        })),
        BrandC: Array.from({ length: 16 }, (_, i) => ({
          name: `Employee C${i + 1}`,
          point: Math.floor(Math.random() * 100),
        })),
      };
    };
    setEmployeeData(generateData());
  }, []);

  if (Object.keys(employeeData).length === 0) return null;

  const brands = Object.keys(employeeData);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedEmployees = employeeData[selectedBrand]
    .sort((a, b) => b.point - a.point)
    .slice(startIndex, endIndex);

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen"
      style={{
        background: "linear-gradient(180deg, #A7CBF0 0%, #1A2A6C 100%)",
      }}
    >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl text-white font-bold">Hi, Group A!</h1>
            <h2 className="text-xl text-white">This the Dashboard of you</h2>
          </div>
          <div className="flex gap-4">
            <button className="border border-blue-500 bg-white text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-600 transition flex items-center justify-center">
              Download&nbsp;
              <span className="material-symbols-outlined">download</span>
            </button>
            <button className="bg-white text-blue-600 px-4 py-2 border border-blue-500 rounded-xl hover:bg-gray-100 transition flex items-center justify-center">
              Date&nbsp;
              <span className="material-symbols-outlined">event_available</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-100">
            <h2 className="text-xl font-semibold text-center mb-4 bg-title-chart">
              Violation Chart
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="gradientMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A2A6C" />
                    <stop offset="100%" stopColor="#2671FF" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" shape={CustomBarShape} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-100">
            <h2 className="text-xl font-semibold text-center mb-4 bg-title-diagram">
              Violation Diagram
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-2xl text-center font-bold mb-4 bg-top-10">
            Top 10 Employee Points
          </h2>
          <div className="flex gap-4 mb-4">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setSelectedBrand(brand);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedBrand === brand
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {paginatedEmployees.map((emp, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-xl text-center shadow-sm hover:shadow-md transition"
              >
                <div className="text-lg font-semibold">{emp.name}</div>
                <div className="text-sm text-gray-500">Point: {emp.point}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of{" "}
              {Math.ceil(employeeData[selectedBrand].length / ITEMS_PER_PAGE)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={endIndex >= employeeData[selectedBrand].length}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
