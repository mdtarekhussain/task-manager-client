import React from "react";
import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";
import Swal from "sweetalert2";

const Login = () => {
  const { GoogleLogin, GithubLogin } = useAuth();
  const axiosLocal = useAxios();

  const handleGoogle = () => {
    GoogleLogin()
      .then((res) => {
        const user = {
          name: res.user.displayName,
          email: res.user.email,
          image: res.user.photoURL,
        };
        axiosLocal
          .post("/user", user)
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                title: "সফল!",
                text: "ব্যবহারকারী সফলভাবে যুক্ত হয়েছে!",
                icon: "success",
                confirmButtonText: "ঠিক আছে",
              });
            }
          })
          .catch((err) => {
            console.error("User save error:", err);
          });
      })
      .catch((err) => {
        console.error("Google login error:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4 font-bengali">
      {/* ব্যাকগ্রাউন্ড এনিমেশন */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-400/20 to-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Login কার্ড */}
      <div className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/95 shadow-2xl rounded-lg border-0 animate-scale-in relative z-10 p-8">
        <div className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">স্বাগতম</h2>
          <p className="text-gray-600 text-lg">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-300"
          >
            Login with Google
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">
              অথবা
            </span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">নতুন ব্যবহারকারী?</p>
          <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors duration-200 hover:underline">
            এখানে রেজিস্টার করুন
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            লগইন করার মাধ্যমে আপনি আমাদের <br />
            <a className="text-purple-600 hover:underline">নিয়মাবলী</a> এবং
            <a className="text-purple-600 hover:underline">
              {" "}
              গোপনীয়তা নীতি
            </a>{" "}
            মেনে নিচ্ছেন
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
