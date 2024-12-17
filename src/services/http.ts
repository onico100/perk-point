import axios from "axios";

const my_http = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  params: {
    _t: new Date().getTime(),
  },
});

export default my_http;
