import axios from "axios";
import React from "react";
const axiosLocal = axios.create({
  baseURL: "https://taks-manager-server.vercel.app",
});
const useAxios = () => {
  return axiosLocal;
};

export default useAxios;
