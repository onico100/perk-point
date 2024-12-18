import axios from "axios";
export const fetchCache = "force-no-store";

const my_http = axios.create({
  url: "/api",
  baseURL: "/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store, no-cache,max-age=0",
  },
});

export default my_http;
