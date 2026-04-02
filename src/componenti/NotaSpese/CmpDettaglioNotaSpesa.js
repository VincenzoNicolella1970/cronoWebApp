import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Form from "react-bootstrap/Form";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotesIcon from "@mui/icons-material/Notes";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

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
    errorOraInizioServizio: false,
    errorOraFineServizio: false,

    fileAllegato1: null,

    openConfirmInvio: false,
  };

  notaSpesaVuota = {
    id: null,
    rif_utente: sessionStorage.getItem("ID"),
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

    somme_ricevute_da: "",
    somme_ricevute_eur: "",

    note_servizio: "",

    allegato1_path: "",
    allegato1_nome_file: "",
    remove_allegato1: 0,

    stato: "BOZZA",
  };

  inputStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "10px",
    boxShadow: "none",
    minHeight: "42px",
  };

  disabledInputStyle = {
    border: "2px solid #d0d5dd",
    borderRadius: "10px",
    boxShadow: "none",
    minHeight: "42px",
    backgroundColor: "#f8fafc",
    color: "#667085",
    cursor: "not-allowed",
    opacity: 1,
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

          const statoNormalizzato = nota.stato.toString().toUpperCase();

          // (nota.stato || "BOZZA").toString().toUpperCase() === "INVIATA"
          //   ? "INVIATA"
          //   : "BOZZA";

          this.setState({
            intestazione: "Dettaglio Nota Spesa #" + (nota.id || ""),
            notaSpesaSelezionata: {
              ...this.notaSpesaVuota,
              ...nota,
              stato: statoNormalizzato,
            },
            tabSelezionato: "1",
            errorRifUtente: false,
            errorRifGara: false,
            errorDataServizio: false,
            errorOraInizioServizio: false,
            errorOraFineServizio: false,
            fileAllegato1: null,
            openConfirmInvio: false,
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
        notaSpesaSelezionata: { ...this.notaSpesaVuota, stato: "BOZZA" },

        errorRifUtente: false,
        errorRifGara: false,
        errorDataServizio: false,
        errorOraInizioServizio: false,
        errorOraFineServizio: false,
        fileAllegato1: null,
        openConfirmInvio: false,
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    this.props.chiudiDettaglio(false);
  };

  handleTabsChange = (event, newValue) => {
    this.setState({ tabSelezionato: newValue });
  };

  isNotaModificabile = () => {
    const stato = (this.state.notaSpesaSelezionata?.stato || "BOZZA")
      .toString()
      .toUpperCase();
    return stato === "BOZZA";
  };

  getControlStyle = (alignRight = false) => {
    const baseStyle = this.isNotaModificabile()
      ? this.inputStyle
      : this.disabledInputStyle;

    return alignRight ? { ...baseStyle, textAlign: "right" } : baseStyle;
  };

  getChipStato = (stato) => {
    const statoUpper = (stato || "BOZZA").toString().toUpperCase();

    if (statoUpper !== "BOZZA") {
      return {
        label: statoUpper,
        bg: "#2e7d32",
      };
    }

    return {
      label: "BOZZA",
      bg: "#1976d2",
    };
  };

  cambioProprietaNotaSpesa = (proprieta, valore) => {
    if (!this.isNotaModificabile()) return;

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

      case "ora_inizio_servizio":
        propState = "errorOraInizioServizio";
        errore = !valore || String(valore).trim() === "";
        break;

      case "ora_fine_servizio":
        propState = "errorOraFineServizio";
        errore = !valore || String(valore).trim() === "";
        break;

      default:
        break;
    }

    if (propState !== "") {
      this.setState({ [propState]: errore });
    }
  };

  handleCambioAllegato = (evt) => {
    if (!this.isNotaModificabile()) return;

    const file =
      evt.target.files && evt.target.files[0] ? evt.target.files[0] : null;

    if (!file) {
      this.setState({ fileAllegato1: null });
      return;
    }

    const maxSize = 5 * 1024 * 1024;

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

    this.setState({ fileAllegato1: file });
    this.cambioProprietaNotaSpesa("allegato1_nome_file", file.name);
    this.cambioProprietaNotaSpesa("allegato1_path", "");
    this.cambioProprietaNotaSpesa("remove_allegato1", 0);
  };

  rimuoviAllegato = () => {
    if (!this.isNotaModificabile()) return;

    this.setState({ fileAllegato1: null });
    this.setState((prevState) => ({
      notaSpesaSelezionata: {
        ...prevState.notaSpesaSelezionata,
        allegato1_nome_file: "",
        allegato1_path: "",
        remove_allegato1: 1,
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
    this.validaCampo("ora_inizio_servizio", nota.ora_inizio_servizio);
    this.validaCampo("ora_fine_servizio", nota.ora_fine_servizio);

    const checks = [
      this.checkValue(nota.rif_utente),
      this.checkValue(nota.rif_gara),
      this.checkValue(nota.data_servizio),
      this.checkValue(nota.ora_inizio_servizio),
      this.checkValue(nota.ora_fine_servizio),
    ];

    return checks.every(Boolean);
  };

  salvaNotaSpesa = (statoDaSalvare = "BOZZA") => {
    const nota = {
      ...this.state.notaSpesaSelezionata,
      stato: statoDaSalvare,
    };

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

    axios
      .post(urlApi + endpoint, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Salvataggio nota spesa eseguito:", response.data);

        const messaggioSuccesso =
          statoDaSalvare === "INVIATA"
            ? "Nota spesa inviata correttamente."
            : "Salvataggio eseguito correttamente.";

        this.setState({
          severity: "success",
          checkMessaggio: messaggioSuccesso,
          avvisaOperazione: true,
          fileAllegato1: null,
          openConfirmInvio: false,
          notaSpesaSelezionata: {
            ...nota,
          },
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
          openConfirmInvio: false,
        });
      });
  };

  apriConfermaInvio = () => {
    if (!this.isNotaModificabile()) return;

    const formValido = this.validaInteroForm();

    if (!formValido) {
      this.setState({
        severity: "error",
        checkMessaggio: "Completa i dati obbligatori prima dell'invio.",
        avvisaOperazione: true,
      });
      return;
    }

    this.setState({ openConfirmInvio: true });
  };

  confermaInvio = () => {
    this.salvaNotaSpesa("INVIATA");
  };

  chiudiConfermaInvio = () => {
    this.setState({ openConfirmInvio: false });
  };

  eliminaNotaSpesa = () => {
    if (!this.state.notaSpesaSelezionata?.id || !this.isNotaModificabile()) {
      return;
    }

    if (!window.confirm("Confermi l'eliminazione della nota spesa?")) return;

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
    return <>{infoUser.last_name + " " + infoUser.first_name}</>;
  };

  retunInfoGara = () => {
    if (
      this.state.notaSpesaSelezionata &&
      this.state.notaSpesaSelezionata.rif_gara !== ""
    ) {
      let gara = null;
      this.props.elencoGare.forEach((garaSel) => {
        if (
          garaSel.id_gara === parseInt(this.state.notaSpesaSelezionata.rif_gara)
        ) {
          gara = garaSel;
        }
      });

      if (!gara) {
        return {
          nome: "-",
          disciplina: "-",
          manifestazione: "-",
          comune: "-",
          provincia: "-",
          regione: "-",
        };
      }

      return {
        nome: gara.nome_gara || "-",
        disciplina:
          gara.disciplina ||
          gara.nome_disciplina ||
          gara.desc_disciplina ||
          "-",
        manifestazione:
          gara.manifestazione ||
          gara.nome_manifestazione ||
          gara.desc_manifestazione ||
          "-",
        comune: gara.desc_comune || gara.comune || "-",
        provincia: gara.desc_provincia || gara.provincia || "-",
        regione: gara.desc_regione || gara.regione || "-",
      };
    }

    return {
      nome: "-",
      disciplina: "-",
      manifestazione: "-",
      comune: "-",
      provincia: "-",
      regione: "-",
    };
  };

  parseNumero = (valore) => {
    if (valore === null || valore === undefined || valore === "") return 0;
    if (typeof valore === "number") return Number.isNaN(valore) ? 0 : valore;

    const cleaned = String(valore).replace(",", ".").trim();
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? 0 : num;
  };

  formattaImporto = (valore) => {
    const num = this.parseNumero(valore);
    return new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  calcolaTotaleNota = () => {
    const nota = this.state.notaSpesaSelezionata || {};

    const autostrada = this.parseNumero(nota.spese_autostrada_eur);
    const sp1 = this.parseNumero(nota.spesa1_eur);
    const ricevute = this.parseNumero(nota.somme_ricevute_eur);

    //return autostrada + sp1 - ricevute;
    return autostrada + sp1;
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

  renderFieldBox = (label, value) => (
    <div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
        {label}
      </div>
      <div
        style={{
          minHeight: 42,
          padding: "10px 12px",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          background: "#fff",
          fontWeight: 600,
        }}
      >
        {value || "-"}
      </div>
    </div>
  );

  renderImportoRow = (descrizione, valore, strong = false) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #eef2f7",
        gap: "16px",
      }}
    >
      <div
        style={{
          color: strong ? "#0f172a" : "#334155",
          fontWeight: strong ? 700 : 500,
        }}
      >
        {descrizione}
      </div>
      <div
        style={{
          minWidth: "150px",
          textAlign: "right",
          fontWeight: strong ? 800 : 700,
          color: strong ? "#0f172a" : "#111827",
        }}
      >
        € {this.formattaImporto(valore)}
      </div>
    </div>
  );

  renderInputImporto = (label, fieldName, value) => (
    <Form.Group>
      <Form.Label style={{ fontWeight: 600 }}>{label}</Form.Label>
      <Form.Control
        type="number"
        step="0.01"
        value={value || ""}
        onChange={(evt) =>
          this.cambioProprietaNotaSpesa(fieldName, evt.target.value)
        }
        style={this.getControlStyle(true)}
        disabled={!this.isNotaModificabile()}
      />
    </Form.Group>
  );

  render() {
    const nota = this.state.notaSpesaSelezionata;
    const elencoGare = this.props.elencoGare || [];
    const infoGara = this.retunInfoGara();
    const totaleNota = this.calcolaTotaleNota();
    const isModificabile = this.isNotaModificabile();

    if (!nota) return <div />;

    const chipStato = this.getChipStato(nota.stato);

    return (
      <div>
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
                  Compilazione e gestione nota spesa
                </div>
              </div>

              <Chip
                label={chipStato.label}
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  backgroundColor: chipStato.bg,
                }}
              />
            </div>
          </DialogTitle>

          <DialogContent dividers sx={{ backgroundColor: "#f8fafc" }}>
            {!isModificabile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Questa nota spesa è stata inviata e non è più modificabile.
              </Alert>
            )}

            <Form onKeyDown={this.checkSubmit}>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={this.state.tabSelezionato}>
                  <Box sx={{ mb: 2 }}>
                    <TabList
                      onChange={this.handleTabsChange}
                      aria-label="Tabs Nota Spesa"
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
                        icon={<ReceiptLongIcon />}
                        iconPosition="start"
                        label="Dati principali"
                        value="1"
                      />
                      <Tab
                        icon={<AttachMoneyIcon />}
                        iconPosition="start"
                        label="Spese"
                        value="3"
                      />
                      <Tab
                        icon={<NotesIcon />}
                        iconPosition="start"
                        label="Note"
                        value="5"
                      />
                    </TabList>
                  </Box>

                  <TabPanel value="1" sx={{ p: 0 }}>
                    {this.renderSezione(
                      "Dati generali",
                      <div className="container-fluid px-0">
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            {this.renderFieldBox(
                              "Utente",
                              this.returnUserInfo(),
                            )}
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Gara assegnata *
                              </Form.Label>
                              <Form.Select
                                value={nota.rif_gara || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "rif_gara",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorRifGara}
                                isInvalid={this.state.errorRifGara}
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
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
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            {this.renderFieldBox(
                              "Disciplina",
                              infoGara.disciplina,
                            )}
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            {this.renderFieldBox(
                              "Manifestazione",
                              infoGara.manifestazione,
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12 col-md-4 mb-3">
                            {this.renderFieldBox("Comune", infoGara.comune)}
                          </div>

                          <div className="col-12 col-md-4 mb-3">
                            {this.renderFieldBox(
                              "Provincia",
                              infoGara.provincia,
                            )}
                          </div>

                          <div className="col-12 col-md-4 mb-3">
                            {this.renderFieldBox("Regione", infoGara.regione)}
                          </div>
                        </div>
                      </div>,
                      <Chip
                        icon={<EventNoteIcon />}
                        label="Obbligatorio"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />,
                    )}

                    {this.renderSezione(
                      "Servizio e gara",
                      <div className="container-fluid px-0">
                        <div className="row">
                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Data servizio *
                              </Form.Label>
                              <Form.Control
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
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Ora inizio servizio *
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={nota.ora_inizio_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_inizio_servizio",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorOraInizioServizio}
                                isInvalid={this.state.errorOraInizioServizio}
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Ora fine servizio *
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={nota.ora_fine_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_fine_servizio",
                                    evt.target.value,
                                  )
                                }
                                isValid={!this.state.errorOraFineServizio}
                                isInvalid={this.state.errorOraFineServizio}
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            {this.renderFieldBox("Stato nota", chipStato.label)}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Ora inizio gara
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={nota.ora_inizio_gara || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_inizio_gara",
                                    evt.target.value,
                                  )
                                }
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Ora fine gara
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={nota.ora_fine_gara || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "ora_fine_gara",
                                    evt.target.value,
                                  )
                                }
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>,
                    )}
                  </TabPanel>

                  <TabPanel value="3" sx={{ p: 0 }}>
                    {this.renderSezione(
                      "Trasporto",
                      <div className="container-fluid px-0">
                        <div className="row">
                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Targa auto
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={nota.targa_auto || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "targa_auto",
                                    evt.target.value,
                                  )
                                }
                                placeholder="AA000AA"
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Km percorsi
                              </Form.Label>
                              <Form.Control
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
                                style={this.getControlStyle(true)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Persone trasportate
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={nota.persone_trasportate || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "persone_trasportate",
                                    evt.target.value,
                                  )
                                }
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-3 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Trasportato da
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={nota.trasportato_da || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "trasportato_da",
                                    evt.target.value,
                                  )
                                }
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>,
                      <Chip
                        icon={<DirectionsCarIcon />}
                        label="Trasporto"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />,
                    )}

                    {this.renderSezione(
                      "Spese",
                      <div className="container-fluid px-0">
                        <div className="row mb-3">
                          <div className="col-12 col-md-8 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Spesa - descrizione
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={nota.spesa1_descrizione || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "spesa1_descrizione",
                                    evt.target.value,
                                  )
                                }
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-4 mb-3">
                            {this.renderInputImporto(
                              "Spesa - importo €",
                              "spesa1_eur",
                              nota.spesa1_eur,
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-12 col-md-8 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Somme ricevute da
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={nota.somme_ricevute_da || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "somme_ricevute_da",
                                    evt.target.value,
                                  )
                                }
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-12 col-md-4 mb-3">
                            {this.renderInputImporto(
                              "Somme ricevute €",
                              "somme_ricevute_eur",
                              nota.somme_ricevute_eur,
                            )}
                          </div>
                        </div>

                        <div className="row mb-3 justify-content-end">
                          <div className="col-12 col-md-4 mb-3">
                            {this.renderInputImporto(
                              "Spese autostrada €",
                              "spese_autostrada_eur",
                              nota.spese_autostrada_eur,
                            )}
                          </div>
                        </div>
                      </div>,
                      <Chip
                        icon={<AttachMoneyIcon />}
                        label="Importi"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />,
                    )}

                    {this.renderSezione(
                      "Riepilogo nota",
                      <div>
                        {this.renderImportoRow(
                          "Spese AUTOSTRADA",
                          nota.spese_autostrada_eur,
                        )}
                        {this.renderImportoRow(
                          nota.spesa1_descrizione || "Spesa",
                          nota.spesa1_eur,
                        )}
                        {/* {this.renderImportoRow(
                          `Somme ricevute${
                            nota.somme_ricevute_da
                              ? " da " + nota.somme_ricevute_da
                              : ""
                          }`,
                          -this.parseNumero(nota.somme_ricevute_eur),
                        )} */}
                        {this.renderImportoRow("Totale nota", totaleNota, true)}
                      </div>,
                    )}

                    {this.renderSezione(
                      "Allegato",
                      <div className="container-fluid px-0">
                        <div className="row">
                          <div className="col-12 mb-3">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Allegato 1 (max 5MB)
                              </Form.Label>
                              <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                  onChange={this.handleCambioAllegato}
                                  style={this.getControlStyle(false)}
                                  disabled={!isModificabile}
                                />
                                {(nota.allegato1_nome_file ||
                                  this.state.fileAllegato1) &&
                                  isModificabile && (
                                    <IconButton
                                      size="small"
                                      title="Rimuovi allegato"
                                      onClick={this.rimuoviAllegato}
                                    >
                                      <ClearIcon fontSize="small" />
                                    </IconButton>
                                  )}
                              </div>

                              {nota.allegato1_nome_file && (
                                <div
                                  style={{
                                    marginTop: 6,
                                    fontSize: 12,
                                    color: "#475569",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <AttachFileIcon fontSize="inherit" />
                                  {nota.allegato1_nome_file}
                                </div>
                              )}
                            </Form.Group>
                          </div>
                        </div>
                      </div>,
                      <Chip
                        icon={<AttachFileIcon />}
                        label="PDF / immagini"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />,
                    )}
                  </TabPanel>

                  <TabPanel value="5" sx={{ p: 0 }}>
                    {this.renderSezione(
                      "Note servizio",
                      <div className="container-fluid px-0">
                        <div className="row">
                          <div className="col-12">
                            <Form.Group>
                              <Form.Label style={{ fontWeight: 600 }}>
                                Annotazioni
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={7}
                                value={nota.note_servizio || ""}
                                onChange={(evt) =>
                                  this.cambioProprietaNotaSpesa(
                                    "note_servizio",
                                    evt.target.value,
                                  )
                                }
                                placeholder="Note sulla nota spesa"
                                style={this.getControlStyle(false)}
                                disabled={!isModificabile}
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>,
                      <Chip
                        icon={<NotesIcon />}
                        label="Facoltativo"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />,
                    )}
                  </TabPanel>
                </TabContext>
              </Box>
            </Form>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
            <div>
              {this.props.idNotaSpesa !== null && isModificabile && (
                <Button
                  onClick={this.eliminaNotaSpesa}
                  variant="outlined"
                  color="error"
                >
                  <DeleteOutlineIcon />
                  &nbsp;Elimina
                </Button>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button onClick={this.handleClose}>
                <ClearIcon />
                &nbsp;Chiudi
              </Button>

              {isModificabile && (
                <>
                  <Button
                    onClick={() => this.salvaNotaSpesa("BOZZA")}
                    variant="outlined"
                  >
                    <CheckIcon />
                    &nbsp;Salva bozza
                  </Button>

                  <Button onClick={this.apriConfermaInvio} variant="contained">
                    <SendIcon />
                    &nbsp;Invia
                  </Button>
                </>
              )}
            </div>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.openConfirmInvio}
          onClose={this.chiudiConfermaInvio}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Conferma invio nota spesa</DialogTitle>

          <DialogContent>
            <Typography sx={{ whiteSpace: "pre-line", fontWeight: 500 }}>
              Stai per inviare la nota spesa.
              {"\n\n"}Dopo l'invio non sarà più possibile modificarla.
              {"\n\n"}Confermi?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.chiudiConfermaInvio}>Annulla</Button>
            <Button variant="contained" onClick={this.confermaInvio}>
              Conferma invio
            </Button>
          </DialogActions>
        </Dialog>

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
