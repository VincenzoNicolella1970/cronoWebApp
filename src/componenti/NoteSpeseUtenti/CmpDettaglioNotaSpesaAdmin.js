import React, { Component } from "react";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import Form from "react-bootstrap/Form";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import CalculateIcon from "@mui/icons-material/Calculate";
import EuroIcon from "@mui/icons-material/Euro";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import CmpAllegatoViewer from "./CmpAllegatoViewer";

export default class CmpDettaglioNotaSpesaAdmin extends Component {
  state = {
    nota: null,
    nuovoStato: "",

    avvisaOperazione: false,
    messaggio: "",
    severity: "success",

    openConfirm: false,
    statoDaConfermare: "",

    coeffOreExtra: "6.00",
    coeffKm: "0.33",

    oreExtraRiconosciute: "",

    totImportoOreExtra: "",
    importoKmPercorsi: "",
    importoForfettario: "",
    totaleRicalcolatoAdmin: "",
  };

  inputStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "10px",
    boxShadow: "none",
    minHeight: "42px",
  };

  componentDidUpdate(prevProps) {
    const openChanged = this.props.openDialog && !prevProps.openDialog;
    const idChanged = this.props.idNotaSpesa !== prevProps.idNotaSpesa;

    if (
      (openChanged || idChanged) &&
      this.props.openDialog &&
      this.props.idNotaSpesa
    ) {
      this.caricaDettaglio();
    }

    if (!this.props.openDialog && prevProps.openDialog) {
      this.setState({
        nota: null,
        nuovoStato: "",
        openConfirm: false,
        statoDaConfermare: "",
        coeffOreExtra: "6.00",
        coeffKm: "0.33",
        oreExtraRiconosciute: "",
        totImportoOreExtra: "",
        importoKmPercorsi: "",
        importoForfettario: "",
        totaleRicalcolatoAdmin: "",
      });
    }
  }

  caricaDettaglio = () => {
    const urlApi = process.env.REACT_APP_API_URL;

    axios
      .get(urlApi + "/nota_spesa/detail.php?id=" + this.props.idNotaSpesa, {
        withCredentials: true,
      })
      .then((res) => {
        const nota = res.data.item || res.data.data || res.data;

        const coeffOreExtra = "6.00";
        const coeffKm = "0.33";

        const oreExtraCalcolate = this.calcolaOreExtra(nota);
        const totaleBase = this.calcolaTotaleBase(nota);

        const oreExtraRiconosciute = this.toFixedString(oreExtraCalcolate);

        const totImportoOreExtra =
          nota.tot_importo_ore_extra_eur !== null &&
          nota.tot_importo_ore_extra_eur !== undefined
            ? this.toFixedString(nota.tot_importo_ore_extra_eur)
            : this.toFixedString(
                this.parseNumero(oreExtraRiconosciute) *
                  this.parseNumero(coeffOreExtra),
              );

        const importoKmPercorsi =
          nota.importo_km_percorsi_eur !== null &&
          nota.importo_km_percorsi_eur !== undefined
            ? this.toFixedString(nota.importo_km_percorsi_eur)
            : this.toFixedString(
                this.parseNumero(nota.km_percorsi) * this.parseNumero(coeffKm),
              );

        const importoForfettario =
          nota.importo_forfettario_eur !== null &&
          nota.importo_forfettario_eur !== undefined
            ? this.toFixedString(nota.importo_forfettario_eur)
            : "0.00";

        const totaleRicalcolatoAdmin =
          nota.totale_ricalcolato_admin_eur !== null &&
          nota.totale_ricalcolato_admin_eur !== undefined &&
          this.parseNumero(nota.totale_ricalcolato_admin_eur) > 0
            ? this.toFixedString(nota.totale_ricalcolato_admin_eur)
            : this.toFixedString(
                totaleBase +
                  this.parseNumero(totImportoOreExtra) +
                  this.parseNumero(importoKmPercorsi) +
                  this.parseNumero(importoForfettario),
              );

        this.setState({
          nota,
          nuovoStato: nota.stato || "",
          coeffOreExtra,
          coeffKm,
          oreExtraRiconosciute,
          totImportoOreExtra,
          importoKmPercorsi,
          importoForfettario,
          totaleRicalcolatoAdmin,
        });
      })
      .catch((error) => {
        console.log("Errore caricamento dettaglio nota spesa:", error);
        this.setState({
          severity: "error",
          messaggio: "Errore caricamento nota spesa.",
          avvisaOperazione: true,
        });
      });
  };

  handleClose = () => {
    this.props.chiudiDettaglio(false);
  };

  chiudiAvviso = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({ avvisaOperazione: false });
  };

  parseNumero = (valore) => {
    if (valore === null || valore === undefined || valore === "") return 0;
    if (typeof valore === "number") return Number.isNaN(valore) ? 0 : valore;

    const cleaned = String(valore).replace(",", ".").trim();
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? 0 : num;
  };

  toFixedString = (valore, decimali = 2) => {
    const num = this.parseNumero(valore);
    return num.toFixed(decimali);
  };

  formattaData = (valore) => {
    if (!valore) return "";
    try {
      return new Date(valore).toLocaleDateString("it-IT");
    } catch {
      return valore;
    }
  };

  formattaImporto = (valore) => {
    const num = this.parseNumero(valore);
    return new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  formattaOre = (valore) => {
    const num = this.parseNumero(valore);
    return new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  minutiDaOra = (ora) => {
    if (!ora) return null;

    const parts = String(ora).split(":");
    if (parts.length < 2) return null;

    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);

    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;

    return hh * 60 + mm;
  };

  calcolaOreTotaliServizio = (nota) => {
    const inizio = this.minutiDaOra(nota?.ora_inizio_servizio);
    const fine = this.minutiDaOra(nota?.ora_fine_servizio);

    if (inizio === null || fine === null) return 0;
    if (fine <= inizio) return 0;

    return (fine - inizio) / 60;
  };

  calcolaOreExtra = (nota) => {
    const oreTotali = this.calcolaOreTotaliServizio(nota);
    return Math.max(oreTotali - 4, 0);
  };

  calcolaTotaleBase = (nota) => {
    const autostrada = this.parseNumero(nota?.spese_autostrada_eur);
    const sp1 = this.parseNumero(nota?.spesa1_eur);
    const sp2 = this.parseNumero(nota?.spesa2_eur);
    const ricevute = this.parseNumero(nota?.somme_ricevute_eur);

    //return autostrada + sp1 + sp2 - ricevute;
    return autostrada + sp1 + sp2;
  };

  aggiornaTotaleFinale = (override = {}) => {
    const { nota } = this.state;
    if (!nota) return;

    const totaleBase = this.calcolaTotaleBase(nota);

    const totImportoOreExtra = this.parseNumero(
      override.totImportoOreExtra ?? this.state.totImportoOreExtra,
    );
    const importoKmPercorsi = this.parseNumero(
      override.importoKmPercorsi ?? this.state.importoKmPercorsi,
    );
    const importoForfettario = this.parseNumero(
      override.importoForfettario ?? this.state.importoForfettario,
    );

    const totaleRicalcolatoAdmin =
      totaleBase + totImportoOreExtra + importoKmPercorsi + importoForfettario;

    this.setState({
      totaleRicalcolatoAdmin: this.toFixedString(totaleRicalcolatoAdmin),
    });
  };

  ricalcolaDaCoefficienti = () => {
    const {
      nota,
      coeffOreExtra,
      coeffKm,
      oreExtraRiconosciute,
      importoForfettario,
    } = this.state;
    if (!nota) return;

    const totaleOre =
      this.parseNumero(oreExtraRiconosciute) * this.parseNumero(coeffOreExtra);

    const totaleKm =
      this.parseNumero(nota.km_percorsi) * this.parseNumero(coeffKm);

    const totaleBase = this.calcolaTotaleBase(nota);

    const totaleFinale =
      totaleBase + totaleOre + totaleKm + this.parseNumero(importoForfettario);

    this.setState({
      totImportoOreExtra: this.toFixedString(totaleOre),
      importoKmPercorsi: this.toFixedString(totaleKm),
      totaleRicalcolatoAdmin: this.toFixedString(totaleFinale),
    });
  };

  handleOreExtraRiconosciuteChange = (value) => {
    const coeffOre = this.parseNumero(this.state.coeffOreExtra);
    const totaleOre = this.parseNumero(value) * coeffOre;

    this.setState(
      {
        oreExtraRiconosciute: value,
        totImportoOreExtra: this.toFixedString(totaleOre),
      },
      () =>
        this.aggiornaTotaleFinale({
          totImportoOreExtra: this.toFixedString(totaleOre),
        }),
    );
  };

  handleChangeMonetario = (field, value) => {
    this.setState(
      {
        [field]: value,
      },
      () => {
        if (field === "totImportoOreExtra") {
          this.aggiornaTotaleFinale({ totImportoOreExtra: value });
        } else if (field === "importoKmPercorsi") {
          this.aggiornaTotaleFinale({ importoKmPercorsi: value });
        } else if (field === "importoForfettario") {
          this.aggiornaTotaleFinale({ importoForfettario: value });
        }
      },
    );
  };

  salvaRicalcoloAdmin = () => {
    const {
      nota,
      totImportoOreExtra,
      importoKmPercorsi,
      importoForfettario,
      totaleRicalcolatoAdmin,
    } = this.state;

    if (!nota) return;

    const urlApi = process.env.REACT_APP_API_URL;

    axios
      .post(
        urlApi + "/nota_spesa/update_calcolo_admin.php",
        {
          id: nota.id,
          tot_importo_ore_extra_eur: this.parseNumero(totImportoOreExtra),
          importo_km_percorsi_eur: this.parseNumero(importoKmPercorsi),
          importo_forfettario_eur: this.parseNumero(importoForfettario),
          totale_ricalcolato_admin_eur: this.parseNumero(
            totaleRicalcolatoAdmin,
          ),
        },
        { withCredentials: true },
      )
      .then(() => {
        this.setState({
          severity: "success",
          messaggio: "Ricalcolo amministrativo salvato correttamente.",
          avvisaOperazione: true,
          nota: {
            ...nota,
            tot_importo_ore_extra_eur: this.parseNumero(totImportoOreExtra),
            importo_km_percorsi_eur: this.parseNumero(importoKmPercorsi),
            importo_forfettario_eur: this.parseNumero(importoForfettario),
            totale_ricalcolato_admin_eur: this.parseNumero(
              totaleRicalcolatoAdmin,
            ),
          },
        });
        this.props.aggiornaListaNoteSpese();
      })
      .catch((error) => {
        console.log("Errore salvataggio ricalcolo amministrativo:", error);

        let messaggio = "Errore salvataggio ricalcolo amministrativo.";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            messaggio = error.response.data.message;
          } else if (error.response.data.error) {
            messaggio = error.response.data.error;
          }
        }

        this.setState({
          severity: "error",
          messaggio,
          avvisaOperazione: true,
        });
      });
  };

  statiDisponibili = () => {
    const stato = (this.state.nota?.stato || "").toUpperCase();

    if (stato === "RESPINTA") return [];
    if (stato === "LIQUIDATA") return [];

    if (stato === "BOZZA" || stato === "INVIATA") {
      return ["APPROVATA", "RESPINTA"];
    }

    if (stato === "APPROVATA") {
      return ["LIQUIDATA"];
    }

    return [];
  };

  apriConfermaCambioStato = () => {
    const { nota, nuovoStato } = this.state;
    if (!nota || !nuovoStato || nuovoStato === nota.stato) return;

    this.setState({
      openConfirm: true,
      statoDaConfermare: nuovoStato,
    });
  };

  confermaCambioStato = () => {
    const { nota, statoDaConfermare } = this.state;
    const urlApi = process.env.REACT_APP_API_URL;

    axios
      .post(
        urlApi + "/nota_spesa/update_stato.php",
        {
          id: nota.id,
          stato: statoDaConfermare,
        },
        { withCredentials: true },
      )
      .then(() => {
        this.setState({
          openConfirm: false,
          severity: "success",
          messaggio: "Stato aggiornato correttamente.",
          avvisaOperazione: true,
        });

        this.props.chiudiDettaglio(true);
      })
      .catch((error) => {
        console.log("Errore aggiornamento stato nota spesa:", error);

        let messaggio = "Errore aggiornamento stato.";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            messaggio = error.response.data.message;
          } else if (error.response.data.error) {
            messaggio = error.response.data.error;
          }
        }

        this.setState({
          openConfirm: false,
          severity: "error",
          messaggio,
          avvisaOperazione: true,
        });
      });
  };

  chiudiConferma = () => {
    this.setState({
      openConfirm: false,
      statoDaConfermare: "",
    });
  };

  getColoreStato = (stato) => {
    switch ((stato || "").toUpperCase()) {
      case "APPROVATA":
        return "#2e7d32";
      case "RESPINTA":
        return "#c62828";
      case "LIQUIDATA":
        return "#6a1b9a";
      default:
        return "#1976d2";
    }
  };

  getMessaggioConferma = (stato) => {
    switch ((stato || "").toUpperCase()) {
      case "RESPINTA":
        return "Stai per RIFIUTARE la nota spesa.\n\nQuesta operazione non sarà più modificabile.\n\nConfermi?";
      case "APPROVATA":
        return "Confermi l'approvazione della nota spesa?";
      case "LIQUIDATA":
        return "Confermi la liquidazione della nota spesa?";
      default:
        return "";
    }
  };

  renderFieldInline = (classStr, label, value, alignRight = false) => (
    <div className={classStr}>
      {" "}
      {/*"col-12 col-md-6 col-lg-3 mb-3"*/}
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
          textAlign: alignRight ? "right" : "left",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );

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
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700 }}>{titolo}</div>
        {extra}
      </div>
      {children}
    </Paper>
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

  renderFormulaRow = ({
    label,
    coeffLabel,
    coeffValue,
    quantitaLabel,
    quantitaValue,
    totalLabel,
    totalValue,
    onCoeffChange,
    onQuantitaChange,
    onTotalChange,
    totalEditable = true,
  }) => (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#fff",
        padding: 14,
        marginBottom: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>
        {label}
      </div>

      <div className="row align-items-end">
        <div className="col-12 col-lg-3 mb-3">
          <Form.Group>
            <Form.Label style={{ fontWeight: 600 }}>{coeffLabel}</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={coeffValue}
              onChange={(e) => onCoeffChange(e.target.value)}
              style={{ ...this.inputStyle, textAlign: "right" }}
            />
          </Form.Group>
        </div>

        <div className="col-12 col-lg-1 mb-3">
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>
            ×
          </div>
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <Form.Group>
            <Form.Label style={{ fontWeight: 600 }}>{quantitaLabel}</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={quantitaValue}
              onChange={(e) => onQuantitaChange(e.target.value)}
              style={{ ...this.inputStyle, textAlign: "right" }}
            />
          </Form.Group>
        </div>

        <div className="col-12 col-lg-1 mb-3">
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>
            =
          </div>
        </div>

        <div className="col-12 col-lg-4 mb-3">
          <Form.Group>
            <Form.Label style={{ fontWeight: 600 }}>{totalLabel}</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={totalValue}
              onChange={(e) => totalEditable && onTotalChange(e.target.value)}
              readOnly={!totalEditable}
              style={{ ...this.inputStyle, textAlign: "right" }}
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );

  render() {
    const { nota } = this.state;
    const statiDisponibili = this.statiDisponibili();

    const oreTotaliServizio = this.calcolaOreTotaliServizio(nota);
    const oreExtraCalcolate = this.calcolaOreExtra(nota);
    const totaleBase = this.calcolaTotaleBase(nota);

    return (
      <>
        <Dialog
          open={this.props.openDialog}
          onClose={this.handleClose}
          fullWidth
          maxWidth="lg"
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
                  Dettaglio Nota Spesa
                </div>
                {nota && (
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    Data servizio: {this.formattaData(nota.data_servizio)}
                  </div>
                )}
              </div>

              {nota && (
                <Chip
                  label={nota.stato}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    backgroundColor: this.getColoreStato(nota.stato),
                  }}
                />
              )}
            </div>
          </DialogTitle>

          <DialogContent dividers sx={{ backgroundColor: "#f8fafc" }}>
            {!nota ? (
              <div>Caricamento...</div>
            ) : (
              <Box>
                {this.renderSezione(
                  "Dati generali",
                  <div className="container-fluid px-0">
                    <div className="row">
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-4 mb-2",
                        "Utente",
                        nota.utente,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-8 mb-3",
                        "Gara",
                        nota.nome_gara,
                      )}
                    </div>

                    <div className="row">
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-4 mb-3",
                        "Disciplina",
                        nota.disciplina,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-8 mb-3",
                        "Manifestazione",
                        nota.manifestazione,
                      )}
                    </div>

                    <div className="row">
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-4 mb-3",
                        "Comune",
                        nota.comune || nota.nome_comune,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-4 mb-3",
                        "Provincia",
                        nota.provincia || nota.nome_provincia,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-4 mb-3",
                        "Regione",
                        nota.regione || nota.nome_regione,
                      )}
                    </div>
                  </div>,
                )}

                {this.renderSezione(
                  "Servizio e gara",
                  <div className="container-fluid px-0">
                    <div className="row">
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Ora inizio servizio",
                        nota.ora_inizio_servizio,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Ora fine servizio",
                        nota.ora_fine_servizio,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Ore totali",
                        this.formattaOre(oreTotaliServizio),
                        true,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Ore extra oltre 4h",
                        this.formattaOre(this.formattaOre(oreExtraCalcolate)),
                        true,
                      )}
                      {/* <div className="col-12 col-md-6 col-lg-3 mb-3">
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 600 }}>
                            Ore extra oltre 4h
                          </Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={this.state.oreExtraRiconosciute}
                            onChange={(e) =>
                              this.handleOreExtraRiconosciuteChange(
                                e.target.value,
                              )
                            }
                            style={{ ...this.inputStyle, textAlign: "right" }}
                          />
                          <div
                            style={{
                              fontSize: 11,
                              color: "#64748b",
                              marginTop: 4,
                            }}
                          >
                            Calcolate: {this.formattaOre(oreExtraCalcolate)}
                          </div>
                        </Form.Group>
                      </div> */}
                    </div>

                    <div className="row">
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Ora inizio gara",
                        nota.ora_inizio_gara,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Ora fine gara",
                        nota.ora_fine_gara,
                      )}
                    </div>
                  </div>,
                )}

                {this.renderSezione(
                  "Trasporto",
                  <div className="container-fluid px-0">
                    <div className="row">
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Targa auto",
                        nota.targa_auto,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Km percorsi",
                        this.formattaImporto(nota.km_percorsi),
                        true,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Persone trasportate",
                        nota.persone_trasportate,
                      )}
                      {this.renderFieldInline(
                        "col-12 col-md-6 col-lg-3 mb-3",
                        "Trasportato da",
                        nota.trasportato_da,
                      )}
                    </div>
                  </div>,
                )}

                {this.renderSezione(
                  "Spese e totale base",
                  <div>
                    {this.renderImportoRow(
                      "Spese AUTOSTRADA",
                      nota.spese_autostrada_eur,
                    )}
                    {this.renderImportoRow(
                      nota.spesa1_descrizione || "Spese GENERALI",
                      nota.spesa1_eur,
                    )}
                    {this.parseNumero(nota.spesa2_eur) !== 0 ||
                    (nota.spesa2_descrizione &&
                      String(nota.spesa2_descrizione).trim() !== "")
                      ? this.renderImportoRow(
                          nota.spesa2_descrizione || "Spesa aggiuntiva",
                          nota.spesa2_eur,
                        )
                      : null}
                    {/* {this.renderImportoRow(
                      `Somme ricevute${
                        nota.somme_ricevute_da
                          ? " da " + nota.somme_ricevute_da
                          : ""
                      }`,
                      -this.parseNumero(nota.somme_ricevute_eur),
                    )} */}
                    {this.renderImportoRow(
                      "Totale base nota",
                      totaleBase,
                      true,
                    )}
                  </div>,
                )}

                {this.renderSezione(
                  "Ricalcolo amministrativo",
                  <div>
                    {this.renderFormulaRow({
                      label: "Ore extra riconosciute",
                      coeffLabel: "Coeff. €/h",
                      coeffValue: this.state.coeffOreExtra,
                      quantitaLabel: "N. ore extra",
                      quantitaValue: this.state.oreExtraRiconosciute,
                      totalLabel: "Totale ore extra €",
                      totalValue: this.state.totImportoOreExtra,
                      onCoeffChange: (value) =>
                        this.setState({ coeffOreExtra: value }),
                      onQuantitaChange: (value) =>
                        this.handleOreExtraRiconosciuteChange(value),
                      onTotalChange: (value) =>
                        this.handleChangeMonetario("totImportoOreExtra", value),
                    })}

                    {this.renderFormulaRow({
                      label: "Km riconosciuti",
                      coeffLabel: "Coeff. €/km",
                      coeffValue: this.state.coeffKm,
                      quantitaLabel: "Km percorsi",
                      quantitaValue: this.toFixedString(nota.km_percorsi),
                      totalLabel: "Totale km €",
                      totalValue: this.state.importoKmPercorsi,
                      onCoeffChange: (value) =>
                        this.setState({ coeffKm: value }),
                      onQuantitaChange: () => {},
                      onTotalChange: (value) =>
                        this.handleChangeMonetario("importoKmPercorsi", value),
                      totalEditable: true,
                    })}

                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 14,
                        background: "#fff",
                        padding: 14,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 12,
                          color: "#0f172a",
                        }}
                      >
                        Importo forfettario
                      </div>

                      <div className="row align-items-end">
                        <div className="col-12 col-lg-8 mb-3">
                          <Form.Group>
                            <Form.Label style={{ fontWeight: 600 }}>
                              Descrizione
                            </Form.Label>
                            <Form.Control
                              value="Importo forfettario riconosciuto"
                              readOnly
                              style={this.inputStyle}
                            />
                          </Form.Group>
                        </div>

                        <div className="col-12 col-lg-4 mb-3">
                          <Form.Group>
                            <Form.Label style={{ fontWeight: 600 }}>
                              Totale €
                            </Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              value={this.state.importoForfettario}
                              onChange={(e) =>
                                this.handleChangeMonetario(
                                  "importoForfettario",
                                  e.target.value,
                                )
                              }
                              style={{
                                ...this.inputStyle,
                                textAlign: "right",
                              }}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        variant="outlined"
                        onClick={this.ricalcolaDaCoefficienti}
                      >
                        <CalculateIcon fontSize="small" />
                        &nbsp;Proponi importi
                      </Button>
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        background:
                          "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
                        border: "1px solid #c7d2fe",
                        borderRadius: 16,
                        padding: 18,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "#475569",
                          marginBottom: 6,
                        }}
                      >
                        Totale finale amministrativo
                      </div>
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 800,
                          color: "#1e3a8a",
                          lineHeight: 1.1,
                          textAlign: "right",
                        }}
                      >
                        €{" "}
                        {this.formattaImporto(
                          this.state.totaleRicalcolatoAdmin,
                        )}
                      </div>
                    </div>
                  </div>,
                  <Chip
                    icon={<EuroIcon />}
                    label="Modificabile"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />,
                )}

                {this.renderSezione(
                  "Note servizio",
                  <div
                    style={{
                      minHeight: 70,
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      padding: 12,
                      backgroundColor: "#fff",
                    }}
                  >
                    {nota.note_servizio || "-"}
                  </div>,
                )}

                {this.renderSezione(
                  "Allegati",
                  <div>
                    {nota.allegato1_path ? (
                      <CmpAllegatoViewer
                        idNotaSpesa={nota.id}
                        numeroAllegato={1}
                        nomeFile={nota.allegato1_nome_file}
                      />
                    ) : (
                      <div>Nessun allegato</div>
                    )}
                  </div>,
                  <Chip
                    icon={<ReceiptLongIcon />}
                    label="Documenti"
                    variant="outlined"
                  />,
                )}

                {this.renderSezione(
                  "Cambio stato",
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 600 }}>
                          Nuovo stato
                        </Form.Label>
                        {statiDisponibili.length === 0 ? (
                          <div style={{ padding: "8px 0", fontWeight: 600 }}>
                            Stato non più modificabile
                          </div>
                        ) : (
                          <Form.Select
                            value={this.state.nuovoStato}
                            onChange={(e) =>
                              this.setState({ nuovoStato: e.target.value })
                            }
                            style={this.inputStyle}
                          >
                            <option value={nota.stato}>{nota.stato}</option>
                            {statiDisponibili.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </Form.Select>
                        )}
                      </Form.Group>
                    </div>
                  </div>,
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
            <Button onClick={this.handleClose}>
              <ClearIcon />
              &nbsp;Chiudi
            </Button>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {nota && statiDisponibili.length > 0 && (
                <Button
                  onClick={this.salvaRicalcoloAdmin}
                  variant="contained"
                  color="inherit"
                >
                  <SaveIcon />
                  &nbsp;Salva ricalcolo
                </Button>
              )}

              {nota && statiDisponibili.length > 0 && (
                <Button
                  onClick={this.apriConfermaCambioStato}
                  variant="contained"
                  disabled={this.state.nuovoStato === nota.stato}
                >
                  <CheckIcon />
                  &nbsp;Conferma Stato
                </Button>
              )}
            </div>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.openConfirm}
          onClose={this.chiudiConferma}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Conferma operazione</DialogTitle>

          <DialogContent>
            <Typography
              sx={{
                whiteSpace: "pre-line",
                fontWeight: 500,
                color: this.getColoreStato(this.state.statoDaConfermare),
              }}
            >
              {this.getMessaggioConferma(this.state.statoDaConfermare)}
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.chiudiConferma}>Annulla</Button>

            <Button
              variant="contained"
              onClick={this.confermaCambioStato}
              sx={{
                backgroundColor: this.getColoreStato(
                  this.state.statoDaConfermare,
                ),
              }}
            >
              Conferma
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={this.state.avvisaOperazione}
          autoHideDuration={5000}
          onClose={this.chiudiAvviso}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={this.chiudiAvviso}
            severity={this.state.severity}
            variant="filled"
          >
            {this.state.messaggio}
          </Alert>
        </Snackbar>
      </>
    );
  }
}
