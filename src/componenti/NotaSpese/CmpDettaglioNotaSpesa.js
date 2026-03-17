import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton, {
  getIconButtonUtilityClass,
} from "@mui/material/IconButton";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Form from "react-bootstrap/Form";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotesIcon from "@mui/icons-material/Notes";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import utilityCrono from "../utility/utilityCrono";
export default class CmpDettaglioNotaSpesa extends Component {
  utilityCrono = new utilityCrono();
  state = {
    intestazione: "",
    tabSelezionato: "1",
    notaSpesaSelezionata: null,

    avvisaOperazione: false,
    checkMessaggio: "",
    severity: "success",

    errorRifUtente: false,
    errorRifGara: false,
    errorDataServizio: false,
    errorStato: false,

    fileAllegato1: null,
    fileAllegato2: null,
  };

  notaSpesaVuota = {
    id: null,
    rif_utente: sessionStorage.getItem("ID"), //l'utente di riferimento è sempre quello loggato
    rif_gara: "",
    data_servizio: "",

    ora_inizio_servizio: "",
    ora_fine_servizio: "",
    ora_inizio_gara: "",
    ora_fine_gara: "",

    km_percorsi: "",
    spese_autostrada_eur: "",

    targa_auto: "",
    persone_trasportate: "",
    trasportato_da: "",

    spesa1_descrizione: "",
    spesa1_eur: "",
    spesa2_descrizione: "",
    spesa2_eur: "",

    somme_ricevute_da: "",
    somme_ricevute_eur: "",

    note_servizio: "",

    allegato1_path: "",
    allegato1_nome_file: "",
    allegato2_path: "",
    allegato2_nome_file: "",
    remove_allegato1: 0,
    remove_allegato2: 0,

    stato: "BOZZA",
  };

  componentDidUpdate = (prevProps) => {
    const dialogAppenaAperto =
      this.props.openDialog === true && prevProps.openDialog === false;

    if (dialogAppenaAperto && this.props.idNotaSpesa !== null) {
      let urlApi = process.env.REACT_APP_API_URL;

      axios
        .get(urlApi + "/nota_spesa/detail.php?id=" + this.props.idNotaSpesa, {
          withCredentials: true,
        })
        .then((response) => {
          let nota = response.data.item ? response.data.item : response.data;

          if (Array.isArray(nota)) {
            nota = nota[0];
          }

          this.setState({
            intestazione: "Dettaglio Nota Spesa #" + (nota.id || ""),
            notaSpesaSelezionata: {
              ...this.notaSpesaVuota,
              ...nota,
            },
            tabSelezionato: "1",
            errorRifUtente: false,
            errorRifGara: false,
            errorDataServizio: false,
            errorStato: false,
            fileAllegato1: null,
            fileAllegato2: null,
          });
        })
        .catch((error) => {
          console.log("Errore caricamento dettaglio nota spesa:", error);
          this.setState({
            severity: "error",
            checkMessaggio: "Errore caricamento dettaglio nota spesa.",
            avvisaOperazione: true,
          });
        });
    }

    if (dialogAppenaAperto && this.props.idNotaSpesa === null) {
      this.setState({
        intestazione: "Nuova Nota Spesa",
        tabSelezionato: "1",
        notaSpesaSelezionata: { ...this.notaSpesaVuota },

        errorRifUtente: false,
        errorRifGara: false,
        errorDataServizio: false,
        errorStato: false,
        fileAllegato1: null,
        fileAllegato2: null,
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }

    this.props.chiudiDettaglio(false);
  };

  handleTabsChange = (event, newValue) => {
    this.setState({ tabSelezionato: newValue });
  };

  cambioProprietaNotaSpesa = (proprieta, valore) => {
    this.setState(
      (prevState) => ({
        notaSpesaSelezionata: {
          ...prevState.notaSpesaSelezionata,
          [proprieta]: valore,
        },
      }),
      () => {
        this.validaCampo(proprieta, valore);
      },
    );
  };

  validaCampo = (proprieta, valore) => {
    let errore = false;
    let propState = "";

    switch (proprieta) {
      case "rif_utente":
        propState = "errorRifUtente";
        errore = !valore || String(valore).trim() === "";
        break;

      case "rif_gara":
        propState = "errorRifGara";
        errore = !valore || String(valore).trim() === "";
        break;

      case "data_servizio":
        propState = "errorDataServizio";
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

  handleCambioAllegato = (numeroAllegato, evt) => {
    const file =
      evt.target.files && evt.target.files[0] ? evt.target.files[0] : null;

    if (!file) {
      if (numeroAllegato === 1) {
        this.setState({ fileAllegato1: null });
      } else {
        this.setState({ fileAllegato2: null });
      }
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      this.setState({
        severity: "error",
        checkMessaggio: "Il file supera la dimensione massima di 5MB.",
        avvisaOperazione: true,
      });

      evt.target.value = "";
      return;
    }

    const tipiConsentiti = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/bmp",
    ];

    if (!tipiConsentiti.includes(file.type)) {
      this.setState({
        severity: "error",
        checkMessaggio: "Sono consentiti solo file PDF o immagini.",
        avvisaOperazione: true,
      });

      evt.target.value = "";
      return;
    }

    if (numeroAllegato === 1) {
      this.setState({ fileAllegato1: file });
      this.cambioProprietaNotaSpesa("allegato1_nome_file", file.name);
      this.cambioProprietaNotaSpesa("allegato1_path", "");
      this.cambioProprietaNotaSpesa("remove_allegato1", 0);
    } else {
      this.setState({ fileAllegato2: file });
      this.cambioProprietaNotaSpesa("allegato2_nome_file", file.name);
      this.cambioProprietaNotaSpesa("allegato2_path", "");
      this.cambioProprietaNotaSpesa("remove_allegato2", 0);
    }
  };

  rimuoviAllegato = (numeroAllegato) => {
    if (numeroAllegato === 1) {
      this.setState({ fileAllegato1: null });
      this.setState((prevState) => ({
        notaSpesaSelezionata: {
          ...prevState.notaSpesaSelezionata,
          allegato1_nome_file: "",
          allegato1_path: "",
          remove_allegato1: 1,
        },
      }));
      return;
    }

    this.setState({ fileAllegato2: null });
    this.setState((prevState) => ({
      notaSpesaSelezionata: {
        ...prevState.notaSpesaSelezionata,
        allegato2_nome_file: "",
        allegato2_path: "",
        remove_allegato2: 1,
      },
    }));
  };

  checkValue = (valore) => {
    if (valore === null || valore === undefined) return false;
    if (String(valore).trim() === "") return false;
    return true;
  };

  validaInteroForm = () => {
    const nota = this.state.notaSpesaSelezionata || {};

    this.validaCampo("rif_utente", nota.rif_utente);
    this.validaCampo("rif_gara", nota.rif_gara);
    this.validaCampo("data_servizio", nota.data_servizio);
    this.validaCampo("stato", nota.stato);

    const checks = [
      this.checkValue(nota.rif_utente),
      this.checkValue(nota.rif_gara),
      this.checkValue(nota.data_servizio),
      this.checkValue(nota.stato),
    ];

    return checks.every(Boolean);
  };

  aggiornaNotaSpesa = () => {
    const nota = this.state.notaSpesaSelezionata;
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
      this.props.idNotaSpesa === null
        ? "/nota_spesa/create.php"
        : "/nota_spesa/update.php";

    const formData = new FormData();

    Object.keys(nota).forEach((key) => {
      const valore =
        nota[key] !== null && nota[key] !== undefined ? nota[key] : "";
      formData.append(key, valore);
    });

    if (this.state.fileAllegato1) {
      formData.append("allegato1_file", this.state.fileAllegato1);
    }

    if (this.state.fileAllegato2) {
      formData.append("allegato2_file", this.state.fileAllegato2);
    }

    //debugger;
    axios
      .post(urlApi + endpoint, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Salvataggio nota spesa eseguito:", response.data);

        this.setState({
          severity: "success",
          checkMessaggio: "Salvataggio eseguito correttamente.",
          avvisaOperazione: true,
          fileAllegato1: null,
          fileAllegato2: null,
        });

        this.props.chiudiDettaglio(true);
      })
      .catch((error) => {
        console.log("Errore salvataggio nota spesa:", error);

        let messaggio = "Errore durante il salvataggio della nota spesa.";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            messaggio = error.response.data.message;
          } else if (error.response.data.error) {
            messaggio = error.response.data.error;
          }
        }

        this.setState({
          severity: "error",
          checkMessaggio: messaggio,
          avvisaOperazione: true,
        });
      });
  };

  eliminaNotaSpesa = () => {
    if (!this.state.notaSpesaSelezionata?.id) {
      return;
    }

    if (!window.confirm("Confermi l'eliminazione della nota spesa?")) {
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .post(
        urlApi + "/nota_spesa/delete.php",
        { id: this.state.notaSpesaSelezionata.id },
        { withCredentials: true },
      )
      .then((response) => {
        console.log("Eliminazione nota spesa eseguita:", response.data);

        this.setState({
          severity: "success",
          checkMessaggio: "Eliminazione eseguita correttamente.",
          avvisaOperazione: true,
        });

        this.props.chiudiDettaglio(true);
      })
      .catch((error) => {
        console.log("Errore eliminazione nota spesa:", error);

        let messaggio = "Errore durante l'eliminazione della nota spesa.";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            messaggio = error.response.data.message;
          } else if (error.response.data.error) {
            messaggio = error.response.data.error;
          }
        }

        this.setState({
          severity: "error",
          checkMessaggio: messaggio,
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

  returnUserInfo = () => {
    let infoUser = this.utilityCrono.returnUserInfo();
    return <>&nbsp;{infoUser.last_name + " " + infoUser.first_name}</>;
  };

  retunInfoGara = () => {
    //debugger;
    if (
      this.state.notaSpesaSelezionata &&
      this.state.notaSpesaSelezionata.rif_gara != ""
    ) {
      let gara = <></>;
      this.props.elencoGare.map((garaSel) => {
        if (
          garaSel.id_gara === parseInt(this.state.notaSpesaSelezionata.rif_gara)
        ) {
          gara = garaSel;
        }
      });
      return (
        <>
          {gara.desc_regione +
            " - " +
            gara.desc_provincia +
            " - " +
            gara.desc_comune}
        </>
      );
    } else {
      return <>Gara non selezionata</>;
    }
  };

  render() {
    const nota = this.state.notaSpesaSelezionata;
    const elencoUtenti = this.props.elencoUtenti || [];
    const elencoGare = this.props.elencoGare || [];

    return (
      <div>
        {nota && (
          <Dialog
            fullWidth={true}
            maxWidth="md"
            disableEscapeKeyDown
            open={this.props.openDialog}
            onClose={this.handleClose}
          >
            <DialogContent>
              <Form onKeyDown={this.checkSubmit}>
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={this.state.tabSelezionato}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={this.handleTabsChange}
                        aria-label="Tabs Nota Spesa"
                      >
                        <Tab
                          icon={<ReceiptLongIcon />}
                          iconPosition="start"
                          label="Dati Principali"
                          value="1"
                        />
                        {/* <Tab
                          icon={<ScheduleIcon />}
                          iconPosition="start"
                          label="Orari / Servizio"
                          value="2"
                        /> */}
                        <Tab
                          icon={
                            <>
                              <AttachMoneyIcon /> <DirectionsCarIcon />
                            </>
                          }
                          iconPosition="start"
                          label="Spese"
                          value="3"
                        />
                        {/* <Tab
                          icon={<AttachMoneyIcon />}
                          iconPosition="start"
                          label="Spese"
                          value="4"
                        /> */}
                        <Tab
                          icon={<NotesIcon />}
                          iconPosition="start"
                          label="Note"
                          value="5"
                        />
                      </TabList>
                    </Box>

                    <TabPanel value="1">
                      <div className="container">
                        <div className="row">
                          <div className="col-4">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Utente
                              </Form.Label>
                              {/* <Form.Select
                                className="textFieldnk"
                                size="sm"
                                value={nota.rif_utente || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "rif_utente",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorRifUtente}
                                isInvalid={this.state.errorRifUtente}
                              >
                                <option value="">Seleziona utente...</option>
                                {elencoUtenti.map((item) => (
                                  <option
                                    key={item.id_utente}
                                    value={item.id_utente}
                                  >
                                    {item.nome ||
                                      item.display_name ||
                                      item.email}
                                  </option>
                                ))}
                              </Form.Select> */}
                              <Typography
                                variant="body2"
                                sx={{
                                  backgroundColor: "var(--colHeaderNavBar)",
                                  color: "white",
                                  borderRadius: "2px",
                                }}
                              >
                                {this.returnUserInfo()}
                              </Typography>
                            </Form.Group>
                          </div>

                          <div className="col-8">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Seleziona una GARA ASSEGNATA*
                              </Form.Label>
                              <Form.Select
                                className="textFieldnk"
                                size="sm"
                                value={nota.rif_gara || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "rif_gara",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorRifGara}
                                isInvalid={this.state.errorRifGara}
                              >
                                <option value="">Seleziona gara...</option>
                                {elencoGare.map((item) => (
                                  <option
                                    key={item.id_gara}
                                    value={item.id_gara}
                                  >
                                    {item.nome_gara}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <div
                              style={{ fontSize: "12px", fontWeight: "bold" }}
                            >
                              {this.retunInfoGara()}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Data SERVIZIO*
                              </Form.Label>
                              <Form.Control
                                className="textFieldnk"
                                size="sm"
                                type="date"
                                value={nota.data_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "data_servizio",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorDataServizio}
                                isInvalid={this.state.errorDataServizio}
                              />
                            </Form.Group>
                          </div>

                          {/* </div>

                        <div className="row"> */}
                          <div className="col-2">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Ora inizio
                              </Form.Label>
                              <Form.Control
                                className="textFieldnk"
                                size="sm"
                                type="time"
                                value={nota.ora_inizio_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_inizio_servizio",
                                    evt.target.value,
                                  )
                                }
                              />
                            </Form.Group>
                          </div>

                          <div className="col-2">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Ora fine
                              </Form.Label>
                              <Form.Control
                                className="textFieldnk"
                                size="sm"
                                type="time"
                                value={nota.ora_fine_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_fine_servizio",
                                    evt.target.value,
                                  )
                                }
                              />
                            </Form.Group>
                          </div>
                          {/* </div>

                        <div className="row"> */}
                          <div className="col-2">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                INIZIO GARA
                              </Form.Label>
                              <Form.Control
                                className="textFieldnk"
                                size="sm"
                                type="time"
                                value={nota.ora_inizio_gara || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_inizio_gara",
                                    evt.target.value,
                                  )
                                }
                              />
                            </Form.Group>
                          </div>

                          <div className="col-2">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                FINE GARA
                              </Form.Label>
                              <Form.Control
                                className="textFieldnk"
                                size="sm"
                                type="time"
                                value={nota.ora_fine_gara || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_fine_gara",
                                    evt.target.value,
                                  )
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-4">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Stato della Nota*
                              </Form.Label>
                              <Form.Select
                                className="textFieldnk"
                                size="sm"
                                value={nota.stato || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "stato",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorStato}
                                isInvalid={this.state.errorStato}
                              >
                                <option value="">Seleziona stato...</option>
                                <option value="BOZZA">BOZZA</option>
                                <option value="INVIATA">INVIATA</option>
                                <option value="APPROVATA">APPROVATA</option>
                                <option value="RESPINTA">RESPINTA</option>
                                <option value="LIQUIDATA">LIQUIDATA</option>
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="3">
                      <Card variant="outlined">
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "var(--colHeaderNavBar)",
                            color: "white",
                            borderRadius: "2px",
                          }}
                        >
                          &nbsp;di TRASPORTO
                        </Typography>
                        <CardContent>
                          <div className="container">
                            <div className="row">
                              <div className="col-2">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Targa auto
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="text"
                                    value={nota.targa_auto || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "targa_auto",
                                        evt.target.value,
                                      )
                                    }
                                    placeholder="AA000AA"
                                  />
                                </Form.Group>
                              </div>

                              <div className="col-3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Persone trasportate
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="text"
                                    value={nota.persone_trasportate || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "persone_trasportate",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>

                              <div className="col-5">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Trasportato da
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="text"
                                    value={nota.trasportato_da || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "trasportato_da",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-2">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Km percorsi
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="number"
                                    step="0.01"
                                    value={nota.km_percorsi || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "km_percorsi",
                                        evt.target.value,
                                      )
                                    }
                                    placeholder="0,00"
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-4">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Spese autostrada €
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="number"
                                    step="0.01"
                                    value={nota.spese_autostrada_eur || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "spese_autostrada_eur",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>

                              <div className="col-4">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Somme ricevute €
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="number"
                                    step="0.01"
                                    value={nota.somme_ricevute_eur || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "somme_ricevute_eur",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>

                              <div className="col-4">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Ricevute da
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="text"
                                    value={nota.somme_ricevute_da || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "somme_ricevute_da",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {/* </TabPanel>

                    <TabPanel value="4"> */}
                      <Card variant="outlined">
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "var(--colHeaderNavBar)",
                            color: "white",
                            borderRadius: "2px",
                          }}
                        >
                          &nbsp;GENERALI
                        </Typography>
                        <CardContent>
                          <div className="container">
                            <div className="row">
                              <div className="col-9">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Descrizione
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="text"
                                    value={nota.spesa1_descrizione || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "spesa1_descrizione",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>

                              <div className="col-3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Importo €
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="number"
                                    step="0.01"
                                    value={nota.spesa1_eur || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "spesa1_eur",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Allegato (max 5Mb)
                                  </Form.Label>
                                  <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                      className="textFieldnk"
                                      size="sm"
                                      type="file"
                                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                      onChange={(evt) =>
                                        this.handleCambioAllegato(1, evt)
                                      }
                                    />
                                    {(nota.allegato1_nome_file ||
                                      this.state.fileAllegato1) && (
                                      <IconButton
                                        size="small"
                                        title="Rimuovi allegato 1"
                                        onClick={() => this.rimuoviAllegato(1)}
                                      >
                                        <ClearIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </div>
                                  {nota.allegato1_nome_file && (
                                    <Form.Text
                                      className="text-muted d-block"
                                      style={{ fontSize: 10 }}
                                    >
                                      File: {nota.allegato1_nome_file}
                                    </Form.Text>
                                  )}
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* <Card variant="outlined">
                          <Typography
                            variant="body2"
                            sx={{
                              backgroundColor: "var(--colHeaderNavBar)",
                              color: "white",
                              borderRadius: "2px",
                            }}
                          >
                            &nbsp;Spesa 2
                          </Typography>
                          <CardContent>
                            {" "}
                            <div className="row">
                              <div className="col-9">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Descrizione
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="text"
                                    value={nota.spesa2_descrizione || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "spesa2_descrizione",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>

                              <div className="col-3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Importo €
                                  </Form.Label>
                                  <Form.Control
                                    className="textFieldnk"
                                    size="sm"
                                    type="number"
                                    step="0.01"
                                    value={nota.spesa2_eur || ""}
                                    onChange={(evt) =>
                                      this.cambioProprietaNotaSpesa(
                                        "spesa2_eur",
                                        evt.target.value,
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <Form.Group className="mb-3">
                                  <Form.Label className="labelFieldnk">
                                    Allegato (max 5Mb)
                                  </Form.Label>
                                  <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                      className="textFieldnk"
                                      size="sm"
                                      type="file"
                                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                      onChange={(evt) =>
                                        this.handleCambioAllegato(2, evt)
                                      }
                                    />
                                    {(nota.allegato2_nome_file ||
                                      this.state.fileAllegato2) && (
                                      <IconButton
                                        size="small"
                                        title="Rimuovi allegato 2"
                                        onClick={() => this.rimuoviAllegato(2)}
                                      >
                                        <ClearIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </div>
                                  {nota.allegato2_nome_file && (
                                    <Form.Text
                                      className="text-muted d-block"
                                      style={{ fontSize: 10 }}
                                    >
                                      File: {nota.allegato2_nome_file}
                                    </Form.Text>
                                  )}
                                </Form.Group>
                              </div>
                            </div>
                          </CardContent>
                        </Card> */}
                      {/* </div> */}
                    </TabPanel>

                    <TabPanel value="5">
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <Form.Group className="mb-3">
                              <Form.Label className="labelFieldnk">
                                Note servizio
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={5}
                                className="textFieldnk"
                                value={nota.note_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "note_servizio",
                                    evt.target.value,
                                  )
                                }
                                placeholder="Note sulla nota spesa"
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </Form>
            </DialogContent>

            <DialogActions>
              {this.props.idNotaSpesa !== null && (
                <Button className="styleButton" onClick={this.eliminaNotaSpesa}>
                  Elimina
                </Button>
              )}

              <Button className="styleButton" onClick={this.handleClose}>
                <ClearIcon /> Annulla
              </Button>

              <Button className="styleButton" onClick={this.aggiornaNotaSpesa}>
                <CheckIcon /> Conferma
              </Button>
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
