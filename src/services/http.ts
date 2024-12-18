import axios from "axios";

const my_http = axios.create({
  url: "/api",
  baseURL: "/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store, no-cache",
  },
});

export default my_http;
