import Link from "next/link";
import Main from "../General/Layout/Main";

export default function LIndex() {
  return (
    <div>
      <Main>
        <h1 className="text-3xl text-black font-bold">Live View</h1>
        <nav className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2 items-center">
            <li>
              <Link href="/home" className="hover:underline">
                Home
              </Link>
            </li>
            <span className="material-symbols-outlined">chevron_right</span>
            <li className="font-medium">Brand A</li>
            <span className="material-symbols-outlined">chevron_right</span>
            <li className="font-medium">Outlet A</li>
            <span className="material-symbols-outlined">chevron_right</span>
            <li className="text-gray-700 font-medium">Live View</li>
          </ol>
        </nav>
        <p className="font-bold text-black mb-3">Camera 1</p>
        <div className="grid grid-cols-2 lg:grid-cols-2 mb-5">
          <div
            className="w-[110%] rounded-xl shadow-xl"
            style={{
              backgroundImage: "url('/static/images/bg_login.png')",
              backgroundSize: "cover",
            }}
          ></div>

          <div className="flex ml-25 flex-col gap-5">
            <div className="flex gap-3">
              <div
                className="w-[100%] h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold"
                style={{
                  background:
                    "linear-gradient(240.88deg, #A599FF 3.29%, #7B78E4 18.81%, #5442B7 51.44%, #000980 94.23%)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  borderColor: "rgba(139, 162, 255, 1)",
                }}
              >
                <p className="text-6xl">15</p>
                <span className="text-sm font-normal text-gray-300 mt-2">
                  Suspect
                </span>
              </div>
              <div
                className="w-[100%] h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold"
                style={{
                  background:
                    "linear-gradient(61.86deg, #256E1D 9.14%, #2AA032 49.59%, #32C248 76.12%, #51D437 90.86%)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  borderColor: "rgba(198, 255, 201, 1)",
                }}
              >
                <p className="text-6xl">10</p>
                <span className="text-sm font-normal text-gray-300 mt-2">
                  Violation
                </span>
              </div>
            </div>

            <div className="w-[100%] h-[260px] p-4 rounded-xl shadow-xl bg-white text-black text-xl font-bold flex flex-col justify-between">
              <div className="px-5 flex justify-between items-start">
                <span className="text-lg">Violation</span>
              </div>

              <div className="flex justify-around h-full items-center mt-2">
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl text-blue-700">1</p>
                    <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "rgba(212, 175, 55, 1)" }}
                      >
                        person_apron
                      </span>
                      Uniform
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl text-blue-700">15</p>
                    <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "rgba(212, 175, 55, 1)" }}
                      >
                        face_5
                      </span>
                      Grooming
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl text-blue-700">15</p>
                    <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "rgba(212, 175, 55, 1)" }}
                      >
                        directions_walk
                      </span>
                      Strangers
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl text-blue-700">1</p>
                    <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "rgba(212, 175, 55, 1)" }}
                      >
                        accessible_menu
                      </span>
                      Behavior
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <div className="bg-white text-black rounded-lg p-4 w-full h-[150px] flex items-center justify-center">
            Image 1
          </div>
          <div className="bg-white text-black rounded-lg p-4 w-full h-[150px] flex items-center justify-center">
            Image 2
          </div>
          <div className="bg-white text-black rounded-lg p-4 w-full h-[150px] flex items-center justify-center">
            Image 3
          </div>
        </div>
      </Main>
    </div>
  );
}
