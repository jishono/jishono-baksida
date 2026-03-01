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

  findByOppslag (q, meddef, utendef, medut, utenut, kunwiki, utenwiki, kun_skjult, string) {
    return api.get(`/search_baksida?q=${q}&meddef=${meddef}&utendef=${utendef}&medut=${medut}&utenut=${utenut}&kunwiki=${kunwiki}&utenwiki=${utenwiki}&kun_skjult=${kun_skjult}${string}`);
  }
  getAllForslag (status) {
    return api.get(`/forslag?status=${status}`);
  }
  getMyForslag (user_id) {
    return api.get(`/forslag/user/${user_id}`);
  }
  hentEnkeltForslag (id) {
    return api.get(`/forslag/${id}`);
  }
  getForslagKommentarer (id) {
    return api.get(`/oppslag/${id}/kommentarer`);
  }
  postForslagKommentar (id, data) {
    return api.post(`/oppslag/${id}/kommentarer`, data);
  }
  postWordSuggestion (data) {
    return api.post(`/words/suggestions/new`, data);
  }
  getWordSuggestion(id) {
    return api.get(`/words/suggestions/${id}`);
  }
  getAllWordSuggestions() {
    return api.get(`/words/suggestions`);
  }
  acceptWordSuggestion(id, data) {
    return api.post(`/words/suggestions/${id}/accept`, data);
  }
  rejectWordSuggestion(id) {
    return api.post(`/words/suggestions/${id}/reject`);
  }
  getAnbefalinger () {
    return api.get(`/anbefalinger`);
  }
  getRequests () {
    return api.get(`/requests`);
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
    return api.get(id ? `/veggen/innlegg/${id}` : `/veggen/innlegg`)
  }
  postVegginnlegg(data) {
    return api.post(`/veggen/nytt_innlegg`, data)
  }
  endreVegginnlegg(id, data) {
    return api.post(`/veggen/innlegg/${id}/endre`, data)
  }
  deleteVegginnlegg(id) {
    return api.post(`/veggen/innlegg/${id}/delete`)
  }
  hentUsetteVeggeninnlegg() {
    return api.get(`/veggen/usette_innlegg/`)
  }
  updateLastSeen(id) {
    return api.post(`/bruker/${id}/sist_sett`)
  }
  getAllUsers() {
    return api.get(`/brukere`)
  }
  getPageVisits() {
    return api.get(`/pagevisits`)
  }
}

export default new JishoDataService();