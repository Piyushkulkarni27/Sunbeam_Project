import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend
  withCredentials: true,                // send cookies (JWT)
});

export default api;
