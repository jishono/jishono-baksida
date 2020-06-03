import http from "../http-common";

class JishoDataService {

  getAll () {
    return http.get(`/jisho`);
  }

  get (id) {
    return http.get(`/oppslag/${id}`);
  }

  get_boyning (id) {
    return http.get(`/boyning/${id}`);
  }

  get_kommentarer (id) {
    return http.get(`/kommentarer/${id}`);
  }

  create (data) {
    return http.post(`/jisho`, data);
  }

  update (id, data) {
    return http.put(`/update/${id}`, data);
  }

  deleteDefUttale (data) {
    console.log(data)
    return http.post(`/jisho/del`, data);
  }

  login (data) {
    return http.post(`/login`, data);
  }

  findByOppslag (q, meddef, utendef, medut, utenut, string) {
    return http.get(`/search?q=${q}&meddef=${meddef}&utendef=${utendef}&medut=${medut}&utenut=${utenut}${string}`);
  }
}

export default new JishoDataService();