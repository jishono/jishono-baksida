import axios from "axios";

export default axios.create({
  baseURL: process.env.VUE_APP_NODE_HOST,
  headers: {
    "Content-type": "application/json",
    'Authorization': localStorage.getItem('jwt') || ''
  }
});