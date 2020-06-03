import axios from "axios";
import config from "./config.js";

export default axios.create({
  baseURL: config.apiurl,
  headers: {
    "Content-type": "application/json",
    'Authorization': localStorage.getItem('jwt') || ''
  }
});