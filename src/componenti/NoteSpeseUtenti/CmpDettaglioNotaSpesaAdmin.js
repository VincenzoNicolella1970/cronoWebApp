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
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import Form from "react-bootstrap/Form";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";

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
      });
    }
  }

  caricaDettaglio = () => {
    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .get(urlApi + "/nota_spesa/detail.php?id=" + this.props.idNotaSpesa, {
        withCredentials: true,
      })
      .then((res) => {
        const nota = res.data.item || res.data.data || res.data;

        this.setState({
          nota: nota,
          nuovoStato: nota.stato || "",
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
    let urlApi = process.env.REACT_APP_API_URL;

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
          messaggio: messaggio,
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

  formattaData = (valore) => {
    if (!valore) return "";
    try {
      return new Date(valore).toLocaleDateString("it-IT");
    } catch {
      return valore;
    }
  };

  formattaImporto = (valore) => {
    if (valore === null || valore === undefined || valore === "") return "";
    const num = parseFloat(valore);
    if (Number.isNaN(num)) return valore;

    return new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  calcolaTotale = (nota) => {
    const autostrada = parseFloat(nota.spese_autostrada_eur || 0);
    const sp1 = parseFloat(nota.spesa1_eur || 0);
    const sp2 = parseFloat(nota.spesa2_eur || 0);
    const ricevute = parseFloat(nota.somme_ricevute_eur || 0);

    return autostrada + sp1 + sp2 - ricevute;
  };

  renderAllegato = (path, nomeFile, label) => {
    if (!path) {
      return (
        <div className="mb-3">
          <div>
            <b>{label}</b>
          </div>
          <div>Nessun allegato</div>
        </div>
      );
    }

    const cleanPath = path;
    const nome = nomeFile || path.split("/").pop() || "allegato";
    const ext = nome.toLowerCase().split(".").pop();

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <b>{label}</b>
            <div style={{ fontSize: "12px", color: "#666" }}>{nome}</div>
          </div>

          <a
            href={cleanPath}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button size="small" variant="outlined">
              <VisibilityIcon fontSize="small" />
              &nbsp;Apri
            </Button>
          </a>
        </div>

        {["png", "jpg", "jpeg", "webp"].includes(ext) && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            <img
              src={cleanPath}
              alt={nome}
              style={{
                maxWidth: "100%",
                maxHeight: "350px",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        {ext === "pdf" && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={cleanPath}
              title={nome}
              width="100%"
              height="420px"
              style={{ border: "none" }}
            />
          </div>
        )}

        {!["png", "jpg", "jpeg", "webp", "pdf"].includes(ext) && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <DescriptionIcon />
            <div>Anteprima non disponibile per questo file.</div>
          </div>
        )}
      </div>
    );
  };

  renderCampo = (label, valore) => {
    return (
      <div className="col-6 mb-2">
        <div style={{ fontSize: "14px", color: "#5a5a5a" }}>{label}</div>
        <div style={{ fontWeight: "500" }}>{valore || "-"}</div>
      </div>
    );
  };

  render() {
    const { nota } = this.state;
    const statiDisponibili = this.statiDisponibili();

    return (
      <>
        <Dialog
          open={this.props.openDialog}
          onClose={this.handleClose}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            Dettaglio Nota Spesa
            {nota && (
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  marginTop: "4px",
                }}
              >
                {/* ID #{nota.id} */}
              </div>
            )}
          </DialogTitle>

          <DialogContent dividers>
            {!nota ? (
              <div>Caricamento...</div>
            ) : (
              <Box>
                <div className="container-fluid">
                  <div className="row">
                    {this.renderCampo("Utente", nota.utente)}
                    {this.renderCampo("Gara", nota.nome_gara)}
                    {this.renderCampo("Disciplina", nota.disciplina)}
                    {this.renderCampo("Manifestazione", nota.manifestazione)}
                    {this.renderCampo(
                      "Data servizio",
                      this.formattaData(nota.data_servizio),
                    )}
                    {this.renderCampo("Stato attuale", nota.stato)}
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div className="row">
                    {this.renderCampo(
                      "Ora inizio servizio",
                      nota.ora_inizio_servizio,
                    )}
                    {this.renderCampo(
                      "Ora fine servizio",
                      nota.ora_fine_servizio,
                    )}
                    {this.renderCampo("Ora inizio gara", nota.ora_inizio_gara)}
                    {this.renderCampo("Ora fine gara", nota.ora_fine_gara)}
                  </div>

                  <Divider sx={{ my: 2 }} />
                  <div className="row">
                    {this.renderCampo("Targa auto", nota.targa_auto)}
                    {this.renderCampo(
                      "Km percorsi",
                      this.formattaImporto(nota.km_percorsi),
                    )}
                    {this.renderCampo(
                      "Persone trasportate",
                      nota.persone_trasportate,
                    )}
                    {this.renderCampo("Trasportato da", nota.trasportato_da)}
                  </div>

                  <Divider sx={{ my: 2 }} />
                  <div className="row">
                    {this.renderCampo("Trasporto", "Spese AUTOSTRADA")}
                    {this.renderCampo(
                      "Importo €",
                      this.formattaImporto(nota.spese_autostrada_eur),
                    )}
                    {this.renderCampo(
                      "Descrizione Spese GENERALI",
                      nota.spesa1_descrizione,
                    )}
                    {this.renderCampo(
                      "Importo €",
                      this.formattaImporto(nota.spesa1_eur),
                    )}
                    {/* {this.renderCampo(
                      "Spesa 2 descrizione",
                      nota.spesa2_descrizione,
                    )}
                    {this.renderCampo(
                      "Spesa 2 importo",
                      this.formattaImporto(nota.spesa2_eur),
                    )} */}
                    {this.renderCampo(
                      "Somme ricevute da",
                      nota.somme_ricevute_da,
                    )}
                    {this.renderCampo(
                      "Importo €",
                      this.formattaImporto(nota.somme_ricevute_eur),
                    )}
                    {this.renderCampo("", "")}
                    {this.renderCampo(
                      "Totale nota € (= spesa autostrada + spese generali - somme ricevute)",
                      this.formattaImporto(this.calcolaTotale(nota)),
                    )}
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div className="row">
                    <div className="col-12">
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Note servizio
                      </div>
                      <div
                        style={{
                          minHeight: "70px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          padding: "10px",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        {nota.note_servizio || "-"}
                      </div>
                    </div>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div className="row">
                    <div className="col-12">
                      <h6>Allegati</h6>
                    </div>

                    <div className="col-12">
                      {nota.allegato1_path ? (
                        <CmpAllegatoViewer
                          idNotaSpesa={nota.id}
                          numeroAllegato={1}
                          nomeFile={nota.allegato1_nome_file}
                        />
                      ) : (
                        <div>Nessun allegato</div>
                      )}
                    </div>

                    {/* <div className="col-6">
                      {nota.allegato2_path ? (
                        <CmpAllegatoViewer
                          idNotaSpesa={nota.id}
                          numeroAllegato={2}
                          nomeFile={nota.allegato2_nome_file}
                        />
                      ) : (
                        <div>Nessun allegato</div>
                      )}
                    </div> */}
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <Form.Group>
                        <Form.Label>Cambio stato</Form.Label>
                        {statiDisponibili.length === 0 ? (
                          <div style={{ padding: "8px 0", fontWeight: "500" }}>
                            Stato non più modificabile
                          </div>
                        ) : (
                          <Form.Select
                            value={this.state.nuovoStato}
                            onChange={(e) =>
                              this.setState({ nuovoStato: e.target.value })
                            }
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
                  </div>
                </div>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose}>
              <ClearIcon />
              &nbsp;Chiudi
            </Button>

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
                fontWeight: "500",
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
