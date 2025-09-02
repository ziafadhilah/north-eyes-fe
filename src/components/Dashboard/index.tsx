/* eslint-disable react-hooks/exhaustive-deps */
"use client";
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
import { SkeletonBox } from "@/components/General/Skleton/Skleton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import {
  getViolationChart,
  getViolationDiagram,
} from "@/service/camera/violationService";
import { ChartData, DiagramData } from "@/constants/dashboardData";

const pieColors = ["#B0D8D8", "#FFDD6D", "#B8BDD1"];
const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<
    Record<string, { name: string; point: number }[]>
  >({});
  const [selectedBrand, setSelectedBrand] = useState("BrandA");
  const [currentPage, setCurrentPage] = useState(1);
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const violationChart = async () => {
    const token = localStorage.getItem("token");
    const company_id = localStorage.getItem("company_id");
    if (!token || !company_id) {
      router.push("/login");
      return;
    }
    getViolationChart(token, company_id).then((res) => {
      if (res?.status === 200) {
        setChartData(res.data);
      } else {
        console.error("Error fetching violation chart data");
      }
    });
  };

  const violationDiagram = async () => {
    const token = localStorage.getItem("token");
    const company_id = localStorage.getItem("company_id");
    if (!token || !company_id) {
      router.push("/login");
      return;
    }
    getViolationDiagram(token, company_id).then((res) => {
      if (res?.status === 200) {
        setDiagramData(res.data);
      } else {
        console.error("Error fetching violation diagram data");
      }
    });
  };

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

  useEffect(() => {
    const TIMEOUT = 10 * 60 * 1000;
    let timeoutId: NodeJS.Timeout;

    const logout = () => {
      localStorage.clear();

      toastr.options = {
        timeOut: 10000,
        extendedTimeOut: 2000,
        closeButton: true,
        progressBar: true,
      };

      toastr.info("You've been logged out due to 10 minutes of inactivity.");
      router.push("/login");
    };

    const resetTimer = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, TIMEOUT);
    };

    const last = localStorage.getItem("lastActivity");
    if (last && Date.now() - parseInt(last, 10) > TIMEOUT) {
      logout();
      return;
    }

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    timeoutId = setTimeout(logout, TIMEOUT);

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timeoutId);
    };
  }, [router]);

  useEffect(() => {
    const companyData = localStorage.getItem("company");
    const token = localStorage.getItem("token");
    if (!companyData || !token) {
      router.push("/login");
      return;
    }
    violationChart();
    violationDiagram();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
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
      className="flex flex-col lg:flex-row min-h-screen"
      style={{
        background: "linear-gradient(180deg, #A7CBF0 0%, #1A2A6C 100%)",
      }}
    >
      {/* Sidebar */}
      <div
        className={`p-2 fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <motion.div
        className="flex-1 flex flex-col p-4 min-h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Content */}
        <div className="flex-1 flex flex-col p-2 min-h-screen overflow-hidden">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl text-white font-bold">
                Hi, Group A!
              </h1>
              <h2 className="text-md lg:text-lg text-white">
                This the Dashboard of you
              </h2>
            </div>
            <div className="flex gap-4">
              <button className="border border-blue-500 bg-white text-blue-600 px-4 py-2 rounded-xl hover:bg-gray-200 transition flex items-center justify-center">
                Download&nbsp;
                <span className="material-symbols-outlined">download</span>
              </button>
              <button className="bg-white text-blue-600 px-4 py-2 border border-blue-500 rounded-xl hover:bg-gray-200 transition flex items-center justify-center">
                Date&nbsp;
                <span className="material-symbols-outlined">
                  event_available
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            {isLoading ? (
              <SkeletonBox className="w-full h-[300px]" />
            ) : (
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="bg-white rounded-2xl shadow-md p-6 h-auto w-full">
                  <h2 className="text-xl font-semibold text-center mb-4 bg-title-chart">
                    Violation Chart
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData?.data.brands.map((b) => ({
                        name: b.brand_name,
                        users: b.total_violation,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#2671FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Pie Chart */}
            {isLoading ? (
              <SkeletonBox className="w-full h-[300px] rounded-full" />
            ) : (
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="bg-white rounded-2xl shadow-md p-6 h-auto w-full">
                  <h2 className="text-xl font-semibold text-center mb-4 bg-title-diagram">
                    Violation Diagram
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart
                      margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                    >
                      <Pie
                        data={
                          diagramData?.data.categories
                            ? [
                                {
                                  name: "Behaviour",
                                  value:
                                    diagramData.data.categories.behaviour.count,
                                },
                                {
                                  name: "Grooming",
                                  value:
                                    diagramData.data.categories.grooming.count,
                                },
                                {
                                  name: "Strangers",
                                  value:
                                    diagramData.data.categories.strangers.count,
                                },
                                {
                                  name: "Uniform",
                                  value:
                                    diagramData.data.categories.uniform.count,
                                },
                              ]
                            : []
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                      >
                        {diagramData?.data.categories &&
                          ["behaviour", "grooming", "strangers", "uniform"].map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={pieColors[index % pieColors.length]}
                              />
                            )
                          )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>
          {/* Employee List */}
          {isLoading ? (
            <SkeletonBox className="w-full h-[300px] rounded-full mt-6" />
          ) : (
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {paginatedEmployees.map((emp, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-xl text-center shadow-sm hover:shadow-md transition"
                    >
                      <div className="text-lg font-semibold">{emp.name}</div>
                      <div className="text-sm text-gray-500">
                        Point: {emp.point}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of{" "}
                    {Math.ceil(
                      employeeData[selectedBrand].length / ITEMS_PER_PAGE
                    )}
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
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
