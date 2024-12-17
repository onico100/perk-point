import axios from "axios";

const my_http = axios.create({
  url: "/api",
  baseURL: "/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    cache: "no-store",
  },
});

export default my_http;
