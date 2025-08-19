/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import Main from "@/components/General/Layout/Main";
import {
  EditViolationDataList,
  ViolationDataList,
} from "@/constants/violationData";
import {
  getViolationList,
  updateViolationList,
} from "@/service/camera/violationService";
import Link from "next/link";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function SuspectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;
  const outlet_id = searchParams.get("outlet_id") as string;
  const area_name = searchParams.get("area_name") as string;
  const [autoValid, setAutoValid] = useState(false);

  const [violation, setViolation] = useState<ViolationDataList[]>([]);
  const [originalViolation, setOriginalViolation] = useState<
    ViolationDataList[]
  >([]);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const getViolationData = async () => {
    const token = localStorage.getItem("token") || "";
    const company_id = localStorage.getItem("company_id") || "";
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await getViolationList(token, company_id, outlet_id);
      console.log(res);
      if (res.status === 200) {
        const allData: ViolationDataList[] = res.data.data.data;
        const filtered = allData.filter((item) => item.is_valid === false);
        setViolation(filtered);
        setOriginalViolation(filtered);
      } else {
        toastr.error("Violation data not found");
      }
    } catch (error) {
      console.error(error);
      toastr.error("Failed to load violation data");
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload: EditViolationDataList[] = violation.map((v) => ({
        violation_id: v.violation_id,
        is_valid: v.is_valid,
        // type: v.type,
        note: v.note ?? "",
      }));

      await updateViolationList(token, payload);

      toastr.success("All changes submitted successfully");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error(error);
      toastr.error("Failed to submit changes");
    }
  };

  // helper untuk cek perubahan
  const isChanged = (orig: ViolationDataList, curr: ViolationDataList) => {
    return (
      orig.is_valid !== curr.is_valid || (orig.note || "") !== (curr.note || "")
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (token && companyId && id) {
      getViolationData();
    }
  }, [id]);

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <Link
              href={{
                pathname: `/brand/live-preview/${id}`,
              }}
            >
              <span
                className="material-symbols-outlined mr-5"
                style={{ fontSize: "32px" }}
              >
                arrow_back
              </span>
            </Link>

            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Violation
              </h1>
              <nav
                className="text-sm text-gray-500 mt-1"
                aria-label="breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/brand" className="hover:underline">
                      Brand
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">Live View</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              {dayName}
            </span>
            <p className="text-md font-medium text-black mt-4">
              {dateTimeString}
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between mb-3 w-full">
          <h1 className="text-2xl font-bold mb-4">
            Suspect{" "}
            <span className="text-white text-sm me-2 text-center font-medium px-2.5 py-1 rounded-md ne-accent">
              200
            </span>
          </h1>

          <div className="text-right">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="accent-blue-600 w-6 h-6"
                checked={autoValid}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAutoValid(checked);

                  setViolation((prev) =>
                    prev.map((v) => {
                      const updated = { ...v, is_valid: checked };
                      return updated;
                    })
                  );
                }}
              />
              <h1 className="text-black text-md">Auto Valid</h1>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
          {violation?.map((item, index) => (
            <div key={index} className="rounded-lg shadow-md p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">
                  OD{" "}
                  <span className="text-yellow-600">Case #{index + 101}</span>
                </h2>
                <input
                  type="checkbox"
                  className="accent-blue-600 w-6 h-6"
                  checked={isChanged(originalViolation[index], item)}
                  readOnly
                />
              </div>

              <img
                src={item.image ?? "/static/images/bg_login.png"}
                alt="Violation"
                className="w-full h-60 object-cover rounded-md mb-3"
              />

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Violation</span>
                <span className="font-semibold">Supervisor</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <p className="text-red-600">{item.detected}</p>
                <div className="flex gap-2">
                  <button
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      item.is_valid ? "bg-false" : "bg-true"
                    }`}
                    onClick={() =>
                      setViolation((prev) =>
                        prev.map((v, i) => {
                          if (i !== index) return v;
                          const updated = { ...v, is_valid: true };
                          return updated;
                        })
                      )
                    }
                  >
                    Valid
                  </button>

                  <button
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      item.is_valid === false ? "bg-false" : "bg-true"
                    }`}
                    onClick={() =>
                      setViolation((prev) =>
                        prev.map((v, i) => {
                          if (i !== index) return v;
                          const updated = { ...v, is_valid: false };
                          return updated;
                        })
                      )
                    }
                  >
                    Invalid
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">Date/Time</span>
                <span className="font-semibold">Type</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span>
                  {new Date(item.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <div className="flex gap-1 text-xs justify-content-end">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                    Low
                  </span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                    Med
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    High
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Area:</span> {area_name}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note:
                </label>
                <input
                  type="text"
                  value={item.note || ""}
                  placeholder="Add Note"
                  onChange={(e) =>
                    setViolation((prev) =>
                      prev.map((v, i) => {
                        if (i !== index) return v;
                        const updated = { ...v, note: e.target.value };
                        return updated;
                      })
                    )
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-right mt-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
            style={{
              background:
                "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
            }}
          >
            Submit
          </button>
        </div>
      </Main>
    </div>
  );
}
