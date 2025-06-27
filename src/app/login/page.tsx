/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loginUser } from "@/service/login/authService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { registerUser } from "@/service/login/registerService";
import { RegisterData } from "@/constants/registerData";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userNameRef = useRef<HTMLInputElement>(null);
  const [currentText, setCurrentText] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const carouselTexts = [
    "Empowering your decisions through AI-driven insights.",
    "Secure, seamless, and smart login experience.",
    "Designed to scale with your business needs.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % carouselTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userNameRef.current) {
      userNameRef.current.focus();
    }
  }, []);

  const goToSlide = (index: number) => {
    setCurrentText(index);
  };

  const handlePrev = () => {
    setCurrentText(
      (prev) => (prev - 1 + carouselTexts.length) % carouselTexts.length
    );
  };

  const handleNext = () => {
    setCurrentText((prev) => (prev + 1) % carouselTexts.length);
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      alert("Identifier dan Password harus diisi");
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginUser(identifier, password);

      if (result.status === "success") {
        toastr.success("Login berhasil");

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
        toastr.error("Login gagal : " + result.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !identifier || !password || !phoneNumber) {
      toastr.error("All field must be filled for registration");
      return;
    }
    try {
      setIsLoading(true);
      const payload: RegisterData = {
        full_name: fullName,
        email: email,
        username: identifier,
        password_hash: password,
        phone_number: phoneNumber,
        profile_picture_url: "test",
      };
      const res = await registerUser(payload);

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

  return (
    <div
      className="relative h-screen flex flex-col md:flex-row bg-cover bg-center"
      style={{
        backgroundImage: 'url("/static/images/bg_login.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 to-purple-800 opacity-80"></div>

      <div className="relative z-10 flex w-full h-full flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen p-4">
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

            {isRegister && (
              <>
                <label className="text-gray-700 text-sm">Full Name:</label>
                <input
                  type="text"
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
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Input phone number"
                  className="mt-2 p-2 text-gray-600 border border-gray-300 rounded-xl w-full bg-white mb-5"
                />
              </>
            )}

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

              {!isRegister && (
                <div className="text-center mb-3">
                  <a href="#" className="text-red-600 font-medium">
                    Reset password
                  </a>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center mt-6">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600 mt-3">
                    Logging in, please wait...
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
        </div>

        {/* Right Side - Carousel */}
        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center text-white">
          <div className="text-center text-white">
            <h1 className="text-5xl font-semibold mb-4">North Eyes AI</h1>
            <h2 className="text-3xl font-semibold mb-4">Live View</h2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={handlePrev}
                className="text-white text-3xl hover:text-gray-300"
                aria-label="Previous"
              >
                <span className="material-symbols">arrow_left</span>
              </button>
              <p className="text-center text-lg italic max-w-md">
                {carouselTexts[currentText]}
              </p>
              <button
                onClick={handleNext}
                className="text-white text-3xl hover:text-gray-300"
                aria-label="Next"
              >
                <span className="material-symbols">arrow_right</span>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {carouselTexts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 w-10 rounded-full transition-all ${
                    currentText === index
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
