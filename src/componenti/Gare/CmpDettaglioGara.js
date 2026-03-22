import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Form from "react-bootstrap/Form";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlaceIcon from "@mui/icons-material/Place";
import NotesIcon from "@mui/icons-material/Notes";
import GroupIcon from "@mui/icons-material/Group";

import CmpUtentiGara from "./CmpUtentiGare";
import utilityCrono from "../utility/utilityCrono";

export default class CmpDettaglioGara extends Component {
  utilityCrono = new utilityCrono();

  state = {
    intestazione: "",
    tabSelezionato: "1",
    garaSelezionata: null,

    avvisaOperazione: false,
    checkMessaggio: "",
    severity: "success",

    errorNomeGara: false,
    errorDisciplina: false,
    errorManifestazione: false,
    errorRegione: false,
    errorProvincia: false,
    errorComune: false,
    errorDataInizio: false,
    errorStato: false,
  };

  garaVuota = {
    id_gara: null,
    nome_gara: "",
    rif_disciplina: "",
    rif_manifestazione: "",
    rif_regione: "",
    rif_provincia: "",
    rif_comune: "",
    data_inizio: "",
    data_fine: "",
    stato: "BOZZA",
    note: "",
  };

  inputStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "10px",
    boxShadow: "none",
    minHeight: "42px",
  };

  componentDidUpdate = (prevProps) => {
    const dialogAppenaAperto =
      this.props.openDialog === true && prevProps.openDialog === false;

    if (dialogAppenaAperto && this.props.idGara !== null) {
      let urlApi = process.env.REACT_APP_API_URL;

      axios
        .get(urlApi + "/gare/detail.php?id_gara=" + this.props.idGara, {
          withCredentials: true,
        })
        .then((response) => {
          let gara = response.data.item ? response.data.item : response.data;

          if (Array.isArray(gara)) {
            gara = gara[0];
          }

          this.setState({
            intestazione: gara.nome_gara || "Dettaglio Gara",
            garaSelezionata: {
              ...this.garaVuota,
              ...gara,
            },
            tabSelezionato: "1",
            errorNomeGara: false,
            errorDisciplina: false,
            errorManifestazione: false,
            errorRegione: false,
            errorProvincia: false,
            errorComune: false,
            errorDataInizio: false,
            errorStato: false,
          });
        })
        .catch((error) => {
          console.log("Errore caricamento dettaglio gara:", error);
          this.setState({
            severity: "error",
            checkMessaggio: "Errore caricamento dettaglio gara.",
            avvisaOperazione: true,
          });
        });
    }

    if (dialogAppenaAperto && this.props.idGara === null) {
      this.setState({
        intestazione: "Nuova Gara",
        tabSelezionato: "1",
        garaSelezionata: { ...this.garaVuota },

        errorNomeGara: false,
        errorDisciplina: false,
        errorManifestazione: false,
        errorRegione: false,
        errorProvincia: false,
        errorComune: false,
        errorDataInizio: false,
        errorStato: false,
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    this.props.chiudiDettaglio(false);
  };

  handleTabsChange = (event, newValue) => {
    if (newValue === "4" && !this.state.garaSelezionata?.id_gara) {
      this.setState({
        severity: "warning",
        checkMessaggio:
          "Salvare prima la gara per poter gestire le assegnazioni utenti.",
        avvisaOperazione: true,
      });
      return;
    }

    this.setState({ tabSelezionato: newValue });
  };

  handleTabsChange_old = (event, newValue) => {
    if (newValue === "4") {
      this.ensureGaraSaved();
    }
    this.setState({ tabSelezionato: newValue });
  };

  ensureGaraSaved = async () => {
    if (this.state.garaSelezionata.id_gara) return;

    let urlApi = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.post(
        urlApi + "/gare/create.php",
        this.state.garaSelezionata,
        { withCredentials: true },
      );

      const gara = response.data.item;

      this.setState({
        garaSelezionata: gara,
        intestazione: gara.nome_gara,
      });
    } catch (err) {
      console.error("Errore creazione gara", err);
    }
  };

  cambioProprietaGara = (proprieta, valore) => {
    this.setState(
      (prevState) => ({
        garaSelezionata: {
          ...prevState.garaSelezionata,
          [proprieta]: valore,
        },
      }),
      () => {
        this.validaCampo(proprieta, valore);
      },
    );
  };

  cambioProprietaGaraMultipla = (valori) => {
    this.setState((prevState) => ({
      garaSelezionata: {
        ...prevState.garaSelezionata,
        ...valori,
      },
    }));
  };

  validaCampo = (proprieta, valore) => {
    let errore = false;
    let propState = "";

    switch (proprieta) {
      case "nome_gara":
        propState = "errorNomeGara";
        errore = !valore || String(valore).trim().length < 4;
        break;

      case "rif_disciplina":
        propState = "errorDisciplina";
        errore = !valore || String(valore).trim() === "";
        break;

      case "rif_manifestazione":
        propState = "errorManifestazione";
        errore = !valore || String(valore).trim() === "";
        break;

      case "rif_regione":
        propState = "errorRegione";
        errore = !valore || String(valore).trim() === "";
        break;

      case "rif_provincia":
        propState = "errorProvincia";
        errore = !valore || String(valore).trim() === "";
        break;

      case "rif_comune":
        propState = "errorComune";
        errore = !valore || String(valore).trim() === "";
        break;

      case "data_inizio":
        propState = "errorDataInizio";
        errore = !valore || String(valore).trim() === "";
        break;

      case "stato":
        propState = "errorStato";
        errore = !valore || String(valore).trim() === "";
        break;

      default:
        break;
    }

    if (propState !== "") {
      this.setState({ [propState]: errore });
    }
  };

  checkValue = (valore) => {
    if (valore === null || valore === undefined) return false;
    if (String(valore).trim() === "") return false;
    return true;
  };

  validaInteroForm = () => {
    const gara = this.state.garaSelezionata || {};

    this.validaCampo("nome_gara", gara.nome_gara);
    this.validaCampo("rif_disciplina", gara.rif_disciplina);
    this.validaCampo("rif_manifestazione", gara.rif_manifestazione);
    this.validaCampo("rif_regione", gara.rif_regione);
    this.validaCampo("rif_provincia", gara.rif_provincia);
    this.validaCampo("rif_comune", gara.rif_comune);
    this.validaCampo("data_inizio", gara.data_inizio);
    this.validaCampo("stato", gara.stato);

    const checks = [
      this.checkValue(gara.nome_gara),
      this.checkValue(gara.rif_disciplina),
      this.checkValue(gara.rif_manifestazione),
      this.checkValue(gara.rif_regione),
      this.checkValue(gara.rif_provincia),
      this.checkValue(gara.rif_comune),
      this.checkValue(gara.data_inizio),
      this.checkValue(gara.stato),
    ];

    return checks.every(Boolean);
  };

  aggiornaGara = () => {
    const gara = this.state.garaSelezionata;
    const formValido = this.validaInteroForm();

    if (!formValido) {
      this.setState({
        severity: "error",
        checkMessaggio: "I dati inseriti sono incompleti!",
        avvisaOperazione: true,
      });
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;
    let endpoint =
      this.props.idGara === null ? "/gare/create.php" : "/gare/update.php";

    axios
      .post(urlApi + endpoint, gara, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Salvataggio gara eseguito:", response.data);

        this.setState({
          severity: "success",
          checkMessaggio: "Salvataggio eseguito correttamente.",
          avvisaOperazione: true,
        });

        this.props.chiudiDettaglio(true);
      })
      .catch((error) => {
        console.log("Errore salvataggio gara:", error);
        let errori = error.response?.data?.fields || {};
        let messaggio = "";
        let key;
        for (key in errori) {
          messaggio += key + ": " + errori[key] + " ";
        }
        this.setState({
          severity: "error",
          checkMessaggio:
            messaggio || "Errore durante il salvataggio della gara.",
          avvisaOperazione: true,
        });
      });
  };

  chiudiAvvisa = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({ avvisaOperazione: false });
  };

  checkSubmit = (evt) => {
    if (evt.key === "Enter") evt.preventDefault();
  };

  renderSezione = (titolo, children, extra = null) => (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        p: 2,
        mb: 2,
        backgroundColor: "#fcfcfd",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700 }}>{titolo}</div>
        {extra}
      </div>
      {children}
    </Paper>
  );

  render() {
    const gara = this.state.garaSelezionata;
    const elencoDiscipline = this.props.elencoDiscipline || [];
    const elencoManifestazioni = this.props.elencoManifestazioni || [];
    const elencoRegioni = this.props.elencoRegioni || [];
    const elencoProvince = this.props.elencoProvince || [];
    const elencoComuni = this.props.elencoComuni || [];

    const manifestazioniFiltrate = elencoManifestazioni.filter(
      (m) => String(m.rif_disciplina) === String(gara?.rif_disciplina || ""),
    );

    const provinceFiltrate = elencoProvince.filter(
      (p) => String(p.codice_regione) === String(gara?.rif_regione || ""),
    );

    const comuniFiltrati = elencoComuni.filter(
      (c) => String(c.codice_provincia) === String(gara?.rif_provincia || ""),
    );

    return (
      <div>
        {gara && (
          <Dialog
            fullWidth
            maxWidth="lg"
            disableEscapeKeyDown
            open={this.props.openDialog}
            onClose={this.handleClose}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>
                    {this.state.intestazione}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    Gestione dati gara e assegnazioni
                  </div>
                </div>

                <Chip
                  label={gara.stato || "BOZZA"}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    backgroundColor:
                      gara.stato === "PUBBLICATA"
                        ? "#2e7d32"
                        : gara.stato === "CHIUSA"
                          ? "#6a1b9a"
                          : "#1976d2",
                  }}
                />
              </div>
            </DialogTitle>

            <DialogContent dividers sx={{ backgroundColor: "#f8fafc" }}>
              <Form onKeyDown={this.checkSubmit}>
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={this.state.tabSelezionato}>
                    <Box sx={{ mb: 2 }}>
                      <TabList
                        onChange={this.handleTabsChange}
                        aria-label="Tabs Gara"
                        sx={{
                          minHeight: 48,
                          "& .MuiTabs-flexContainer": {
                            gap: "8px",
                            flexWrap: "wrap",
                          },
                          "& .MuiTab-root": {
                            minHeight: 44,
                            textTransform: "none",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#fff",
                            fontWeight: 600,
                          },
                          "& .Mui-selected": {
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8 !important",
                            borderColor: "#bfdbfe",
                          },
                          "& .MuiTabs-indicator": {
                            display: "none",
                          },
                        }}
                      >
                        <Tab
                          icon={<EmojiEventsIcon />}
                          iconPosition="start"
                          label="Dati Gara"
                          value="1"
                        />
                        <Tab
                          icon={<PlaceIcon />}
                          iconPosition="start"
                          label="Località"
                          value="2"
                        />
                        <Tab
                          icon={<NotesIcon />}
                          iconPosition="start"
                          label="Note / Stato"
                          value="3"
                        />
                        <Tab
                          icon={<GroupIcon />}
                          iconPosition="start"
                          label="Assegnazione Utenti"
                          value="4"
                          disabled={!gara?.id_gara}
                        />
                      </TabList>
                    </Box>

                    <TabPanel value="1" sx={{ p: 0 }}>
                      <div
                        className={
                          this.utilityCrono.defineIfIsAdministrator()
                            ? "container"
                            : "container disabledContent"
                        }
                      >
                        {this.renderSezione(
                          "Dati principali",
                          <div className="row">
                            <div className="col-12 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Nome gara *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={gara.nome_gara || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "nome_gara",
                                      evt.target.value,
                                    )
                                  }
                                  isValid={!this.state.errorNomeGara}
                                  isInvalid={this.state.errorNomeGara}
                                  placeholder="Nome gara"
                                  style={this.inputStyle}
                                />
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-6 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Disciplina *
                                </Form.Label>
                                <Form.Select
                                  value={gara.rif_disciplina || ""}
                                  onChange={(evt) => {
                                    this.cambioProprietaGaraMultipla({
                                      rif_disciplina: evt.target.value,
                                      rif_manifestazione: "",
                                    });
                                    this.validaCampo(
                                      "rif_disciplina",
                                      evt.target.value,
                                    );
                                    this.validaCampo("rif_manifestazione", "");
                                  }}
                                  isValid={!this.state.errorDisciplina}
                                  isInvalid={this.state.errorDisciplina}
                                  style={this.inputStyle}
                                >
                                  <option value="">
                                    Seleziona disciplina...
                                  </option>
                                  {elencoDiscipline.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.nome}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-6 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Manifestazione *
                                </Form.Label>
                                <Form.Select
                                  value={gara.rif_manifestazione || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "rif_manifestazione",
                                      evt.target.value,
                                    )
                                  }
                                  isValid={!this.state.errorManifestazione}
                                  isInvalid={this.state.errorManifestazione}
                                  disabled={!gara.rif_disciplina}
                                  style={this.inputStyle}
                                >
                                  <option value="">
                                    Seleziona manifestazione...
                                  </option>
                                  {manifestazioniFiltrate.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.nome}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Data inizio *
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  value={gara.data_inizio || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "data_inizio",
                                      evt.target.value,
                                    )
                                  }
                                  isValid={!this.state.errorDataInizio}
                                  isInvalid={this.state.errorDataInizio}
                                  style={this.inputStyle}
                                />
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Data fine
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  value={gara.data_fine || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "data_fine",
                                      evt.target.value,
                                    )
                                  }
                                  style={this.inputStyle}
                                />
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Stato *
                                </Form.Label>
                                <Form.Select
                                  value={gara.stato || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "stato",
                                      evt.target.value,
                                    )
                                  }
                                  isValid={!this.state.errorStato}
                                  isInvalid={this.state.errorStato}
                                  style={this.inputStyle}
                                >
                                  <option value="">Seleziona stato...</option>
                                  <option value="BOZZA">BOZZA</option>
                                  <option value="PUBBLICATA">PUBBLICATA</option>
                                  <option value="CHIUSA">CHIUSA</option>
                                </Form.Select>
                              </Form.Group>
                            </div>
                          </div>,
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label="Gara"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />,
                        )}
                      </div>
                    </TabPanel>

                    <TabPanel value="2" sx={{ p: 0 }}>
                      <div
                        className={
                          this.utilityCrono.defineIfIsAdministrator()
                            ? "container"
                            : "container disabledContent"
                        }
                      >
                        {this.renderSezione(
                          "Località",
                          <div className="row">
                            <div className="col-12 col-md-4 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Regione *
                                </Form.Label>
                                <Form.Select
                                  value={gara.rif_regione || ""}
                                  onChange={(evt) => {
                                    this.cambioProprietaGaraMultipla({
                                      rif_regione: evt.target.value,
                                      rif_provincia: "",
                                      rif_comune: "",
                                    });
                                    this.validaCampo(
                                      "rif_regione",
                                      evt.target.value,
                                    );
                                    this.validaCampo("rif_provincia", "");
                                    this.validaCampo("rif_comune", "");
                                  }}
                                  isValid={!this.state.errorRegione}
                                  isInvalid={this.state.errorRegione}
                                  style={this.inputStyle}
                                >
                                  <option value="">Seleziona regione...</option>
                                  {elencoRegioni.map((item) => (
                                    <option
                                      key={item.codice_regione}
                                      value={item.codice_regione}
                                    >
                                      {item.nome}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Provincia *
                                </Form.Label>
                                <Form.Select
                                  value={gara.rif_provincia || ""}
                                  onChange={(evt) => {
                                    this.cambioProprietaGaraMultipla({
                                      rif_provincia: evt.target.value,
                                      rif_comune: "",
                                    });
                                    this.validaCampo(
                                      "rif_provincia",
                                      evt.target.value,
                                    );
                                    this.validaCampo("rif_comune", "");
                                  }}
                                  isValid={!this.state.errorProvincia}
                                  isInvalid={this.state.errorProvincia}
                                  disabled={!gara.rif_regione}
                                  style={this.inputStyle}
                                >
                                  <option value="">
                                    Seleziona provincia...
                                  </option>
                                  {provinceFiltrate.map((item) => (
                                    <option
                                      key={item.codice_provincia}
                                      value={item.codice_provincia}
                                    >
                                      {item.nome}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4 mb-3">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Comune *
                                </Form.Label>
                                <Form.Select
                                  value={gara.rif_comune || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "rif_comune",
                                      evt.target.value,
                                    )
                                  }
                                  isValid={!this.state.errorComune}
                                  isInvalid={this.state.errorComune}
                                  disabled={!gara.rif_provincia}
                                  style={this.inputStyle}
                                >
                                  <option value="">Seleziona comune...</option>
                                  {comuniFiltrati.map((item) => (
                                    <option
                                      key={item.codice_comune}
                                      value={item.codice_comune}
                                    >
                                      {item.nome}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </div>
                          </div>,
                          <Chip
                            icon={<PlaceIcon />}
                            label="Territorio"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />,
                        )}
                      </div>
                    </TabPanel>

                    <TabPanel value="3" sx={{ p: 0 }}>
                      <div
                        className={
                          this.utilityCrono.defineIfIsAdministrator()
                            ? "container"
                            : "container disabledContent"
                        }
                      >
                        {this.renderSezione(
                          "Note e stato",
                          <div className="row">
                            <div className="col-12">
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 600 }}>
                                  Note
                                </Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={6}
                                  value={gara.note || ""}
                                  onChange={(evt) =>
                                    this.cambioProprietaGara(
                                      "note",
                                      evt.target.value,
                                    )
                                  }
                                  placeholder="Note sulla gara"
                                  style={this.inputStyle}
                                />
                              </Form.Group>
                            </div>
                          </div>,
                          <Chip
                            icon={<NotesIcon />}
                            label="Annotazioni"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />,
                        )}
                      </div>
                    </TabPanel>

                    <TabPanel value="4" sx={{ p: 0 }}>
                      {this.renderSezione(
                        "Assegnazione utenti",
                        <CmpUtentiGara idGara={gara.id_gara} />,
                        <Chip
                          icon={<GroupIcon />}
                          label="Utenti"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />,
                      )}
                    </TabPanel>
                  </TabContext>
                </Box>
              </Form>
            </DialogContent>

            <DialogActions
              sx={{ px: 3, py: 2, justifyContent: "space-between" }}
            >
              <Button onClick={this.handleClose}>
                <ClearIcon />
                &nbsp;Annulla
              </Button>

              {this.utilityCrono.defineIfIsAdministrator() && (
                <Button onClick={this.aggiornaGara} variant="contained">
                  <CheckIcon />
                  &nbsp;Conferma
                </Button>
              )}
            </DialogActions>
          </Dialog>
        )}

        <Snackbar
          open={this.state.avvisaOperazione}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
          onClose={this.chiudiAvvisa}
        >
          <Alert
            onClose={this.chiudiAvvisa}
            severity={this.state.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {this.state.checkMessaggio}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
