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
        console.log(res.user);
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
                title: "Success!",
                text: "User has been added successfully!",
                icon: "success",
                confirmButtonText: "OK",
              });
              console.log("User inserted successfully");
            }

            console.log("User saved:", res.data);
          })
          .catch((err) => {
            console.error("Error saving user:", err);
          });
      })
      .catch((err) => {
        console.error("Google login failed:", err);
      });
  };

  const handleGithub = () => {
    GithubLogin()
      .then((res) => {
        console.log(res.user);
        // Same logic can be used to store GitHub users if needed
      })
      .catch((err) => {
        console.error("GitHub login failed:", err);
      });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/hxS5h3Jh/log.jpg')",
      }}
    >
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        onClick={handleGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>
      <button
        disabled
        onClick={handleGithub}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;
