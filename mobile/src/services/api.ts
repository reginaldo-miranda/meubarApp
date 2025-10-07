import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000", // ou http://192.168.x.x:4000 para celular
});
