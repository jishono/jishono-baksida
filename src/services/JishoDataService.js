import api from "../api";

class JishoDataService {

  getAll () {
    return api.get(`/jisho`);
  }

  get (id) {
    return api.get(`/oppslag/${id}`);
  }

  get_boyning (id) {
    return api.get(`/boyning/${id}`);
  }

  get_kommentarer (id) {
    return api.get(`/kommentarer/${id}`);
  }

  create (data) {
    return api.post(`/jisho`, data);
  }

  update (id, data) {
    return api.put(`/update/${id}`, data);
  }

  forslag (id, data) {
    return api.post(`/forslag/${id}`, data);
  }
  stemForslag (id, data) {
    return api.post(`/forslag/${id}/stem`, data);
  }

  deleteDefUttale (data) {
    console.log(data)
    return api.post(`/jisho/del`, data);
  }

  login (data) {
    return api.post(`/login`, data);
  }

  findByOppslag (q, meddef, utendef, medut, utenut, string) {
    return api.get(`/search?q=${q}&meddef=${meddef}&utendef=${utendef}&medut=${medut}&utenut=${utenut}${string}`);
  }
  getAllForslag () {
    return api.get(`/forslag`);
  }
}

export default new JishoDataService();