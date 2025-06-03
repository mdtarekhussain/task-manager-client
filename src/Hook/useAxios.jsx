import axios from "axios";
import React from "react";
const axiosLocal = axios.create({
  // baseURL: "http://localhost:5000",

  baseURL: "https://task-maneger-henna.vercel.app",
});
const useAxios = () => {
  return axiosLocal;
};

export default useAxios;
