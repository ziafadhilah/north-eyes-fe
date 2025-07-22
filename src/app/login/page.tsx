/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loginUser } from "@/service/login/authService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { RegisterData } from "@/constants/registerData";
import { registrationUser } from "@/service/customer-registration/registrationService";
import { fetchFeatureFE } from "@/service/features/featuresService";
import { featureData } from "@/constants/featuresData";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userNameRef = useRef<HTMLInputElement>(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [features, setFeatures] = useState<featureData[]>();

  const loadFeatures = async () => {
    const res = await fetchFeatureFE();
    setFeatures(res.data.data.feature);
  };

  const handlePrev = () => {
    if (!features) return;
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    if (!features) return;
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentFeature(index);
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      toastr.error("All field must be filled");
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginUser(identifier, password);

      if (result.status === "success") {
        toastr.success("Login Success");

        localStorage.setItem("token", result.data?.token ?? "");
        localStorage.setItem("user_id", result.data?.user_id ?? "");
        localStorage.setItem("company", result.data?.company_name ?? "");
        localStorage.setItem("company_id", result.data?.company_id ?? "");
        localStorage.setItem("photo_url", result.data?.photo_url ?? "");
        localStorage.setItem("lastActivity", Date.now().toString());

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toastr.error("Failed to Login : " + result.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Unexpected error occurred");
      }
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !phoneNumber || !message) {
      toastr.error("All fields must be filled for registration");
      return;
    }
    try {
      setIsLoading(true);
      const payload: RegisterData = {
        full_name: fullName,
        email: email,
        phone: phoneNumber,
        message: message,
      };
      const res = await registrationUser(payload);

      if (res.data.status === "success") {
        toastr.success("Register success. Please Login.");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setIdentifier("");
        setIsRegister(false);
      } else {
        toastr.error(res.data.message || "Failed to register.");
      }
    } catch (error) {
      toastr.error("An error occurred while registering");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  useEffect(() => {
    if (!features || features.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features]);

  useEffect(() => {
    if (userNameRef.current) {
      userNameRef.current.focus();
    }
  }, []);

  return (
    <div
      className="relative h-screen flex flex-col md:flex-row bg-cover bg-center"
      style={{ backgroundImage: 'url("/static/images/bg_login.jpg")' }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100/70 to-purple-800/100 animate-gradientMove"></div>

      <div className="relative z-10 flex w-full h-full flex-col md:flex-row">
        {/* Left Form */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center min-h-screen p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-full max-w-xl p-8 rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-center mb-8">
              <span className="text-xl font-bold text-gray-800 mr-2">
                Powered By
              </span>
              <img
                src="/static/images/idea_logo.png"
                alt="Idea Logo"
                className="h-5"
              />
            </div>
            <h1 className="text-sm text-center font-bold text-blue-600">
              {isRegister ? "Create an account" : "Sign in to account"}
            </h1>
            <h1 className="text-gray-400 text-sm mb-7 text-center">
              {isRegister
                ? "Please insert your details to register"
                : "Please insert your login details to login"}
            </h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isRegister) {
                  handleRegister();
                } else {
                  handleLogin();
                }
              }}
            >
              {isRegister ? (
                <>
                  <label className="text-gray-700 text-sm">Full Name:</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name here"
                    className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-5"
                  />

                  <label className="text-gray-700 text-sm">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-5"
                  />

                  <label className="text-gray-700 text-sm">Phone Number:</label>
                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Input phone number"
                    className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-5"
                  />

                  <label className="text-gray-700 text-sm">Message:</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-5"
                    rows={4}
                  ></textarea>
                </>
              ) : (
                <>
                  <label className="text-gray-700 text-sm">Username:</label>
                  <input
                    ref={userNameRef}
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Input your username"
                    className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-5"
                  />

                  <label className="text-gray-700 text-sm">Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Input your password"
                    className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-4"
                  />

                  <div className="text-center mb-3">
                    <a href="#" className="text-red-600 font-medium">
                      Reset password
                    </a>
                  </div>
                </>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center mt-6">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-blue-400/60 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-4 border-blue-300/30 border-t-transparent rounded-full animate-slow-spin"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full shadow-md animate-ping"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {isRegister ? "Registering" : "Logging in"}, please wait...
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    className="mt-2 mb-3 p-2 text-white rounded-md w-full bg-blue-700 hover:bg-blue-800"
                  >
                    {isRegister ? "Register" : "Login"}
                  </button>

                  {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

                  <p className="text-sm text-gray-400 mb-4 text-center">
                    {isRegister
                      ? "Already have an account?"
                      : "Don’t have an account?"}{" "}
                    <button
                      type="button"
                      className="text-red-600 font-medium cursor-pointer"
                      onClick={() => setIsRegister(!isRegister)}
                    >
                      {isRegister ? "Login here" : "Register here"}
                    </button>
                  </p>
                </>
              )}
            </form>
          </div>
        </motion.div>

        {/* Right Carousel */}
        <motion.div
          className="hidden md:flex w-full md:w-1/2 items-center justify-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="text-center text-white">
            <h1 className="text-5xl font-semibold mb-4">North Eyes AI</h1>
            <h2 className="text-3xl font-semibold mb-4">
              {features && features.length > 0
                ? features[currentFeature].name
                : "Live View"}
            </h2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={handlePrev}
                className="text-white text-3xl hover:text-gray-300"
              >
                <span className="material-symbols">arrow_left</span>
              </button>

              <p className="text-center text-lg italic max-w-md">
                {features && features.length > 0
                  ? features[currentFeature].description
                  : "Loading features..."}
              </p>

              <button
                onClick={handleNext}
                className="text-white text-3xl hover:text-gray-300"
              >
                <span className="material-symbols">arrow_right</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 mt-4">
              {features &&
                features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1 w-10 rounded-full transition-all ${
                      currentFeature === index
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
