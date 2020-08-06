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

  addForslag (id, data) {
    return api.post(`/oppslag/${id}/nytt_forslag`, data);
  }
  stemForslag (id, data) {
    return api.post(`/forslag/${id}/stem`, data);
  }
  godkjennForslag (id, data) {
    return api.post(`/forslag/${id}/godkjenn`, data);
  }
  redigerForslag (id, data) {
    return api.post(`/forslag/${id}/rediger`, data);
  }
  fjernForslag (id) {
    return api.post(`/forslag/${id}/fjern`);
  }
  avvisForslag (id) {
    return api.post(`/forslag/${id}/avvis`);
  }

  deleteDefUttale (data) {
    return api.post(`/jisho/del`, data);
  }

  login (data) {
    return api.post(`/logg_inn`, data);
  }
  registrer (data) {
    return api.post(`/registrer`, data);
  }

  findByOppslag (q, meddef, utendef, medut, utenut, string) {
    return api.get(`/search?q=${q}&meddef=${meddef}&utendef=${utendef}&medut=${medut}&utenut=${utenut}${string}`);
  }
  getAllForslag () {
    return api.get(`/forslag`);
  }
  getForslagKommentarer (id) {
    return api.get(`/forslag/${id}/kommentarer`);
  }
  postForslagKommentar (id, data) {
    return api.post(`/forslag/${id}/ny_kommentar`, data);
  }
  getAnbefalinger () {
    return api.get(`/anbefalinger`);
  }
  getStatistikk () {
    return api.get(`/statistikk`);
  }
  getBruker(id) {
    return api.get(`/bruker/${id}`)
  }
  getBrukerforslag(id) {
    return api.get(`/bruker/${id}/forslag`)
  }
  updateBrukerdata(id, data) {
    return api.post(`/bruker/${id}/oppdater`, data)
  }
  hentVegginnlegg(id) {
    return api.get(`/veggen/innlegg/${id}`)
  }
  postVegginnlegg(data) {
    return api.post(`/veggen/nytt_innlegg`, data)
  }
  endreVegginnlegg(id, data) {
    return api.post(`/veggen/innlegg/${id}/endre`, data)
  }
}

export default new JishoDataService();