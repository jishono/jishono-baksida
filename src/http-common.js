import axios from "axios";

export default axios.create({
  baseURL: "http://api.jisho.no/",
  headers: {
    "Content-type": "application/json",
    'Authorization': localStorage.getItem('jwt') || ''
  }
});