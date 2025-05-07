import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Main({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen p-4"
      style={{
        background: "linear-gradient(180deg, #A7CBF0 0%, #1A2A6C 100%)",
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col ml-3 mr-3">
        <Header />
        <main
          className="flex-1 rounded-3xl shadow-2xl p-8 ml-2 border-5"
          style={{
            backgroundColor: "rgba(243, 243, 243, 1)",
            borderColor: "#A7CBF0",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
