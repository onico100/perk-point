import axios from "axios";

const my_http = axios.create({
  baseURL: "/api", // `url` here is redundant; remove it
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  },
});

export default my_http;
