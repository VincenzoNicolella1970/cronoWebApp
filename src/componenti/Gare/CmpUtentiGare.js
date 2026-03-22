import React, { Component } from "react";
import axios from "axios";

import { DataGridPro } from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Form from "react-bootstrap/Form";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

import utilityCrono from "../utility/utilityCrono";

export default class CmpUtentiGare extends Component {
  utilityCrono = new utilityCrono();
  state = {
    elencoUtentiGara: [],
    elencoUtenti: [],
    caricamento: false,

    openDialogAdd: false,
    rif_utente: "",
    ruolo: "",

    avvisaOperazione: false,
    checkMessaggio: "",
    severity: "success",

    errorUtente: false,
  };

  colonne = [
    {
      field: "display_name",
      headerName: "UTENTE",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "ruolo",
      headerName: "RUOLO",
      flex: 1,
      minWidth: 180,
      valueGetter: (value, row) => row.ruolo || "",
    },
    {
      field: "azioni",
      headerName: "",
      width: 90,
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (param) => {
        return (
          this.utilityCrono.defineIfIsAdministrator() && (
            <Button
              title="Rimuovi utente"
              className="styleButton"
              style={{ height: "35px", minWidth: "35px" }}
              onClick={() => this.rimuoviUtente(param.row.id_gara_utente)}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          )
        );
      },
    },
  ];

  componentDidMount() {
    this.caricaUtenti();
    this.caricaUtentiGara();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.idGara !== this.props.idGara) {
      this.caricaUtentiGara();
    }
  }

  caricaUtentiGara = () => {
    if (!this.props.idGara) return;

    let urlApi = process.env.REACT_APP_API_URL;

    this.setState({ caricamento: true });

    axios
      .get(urlApi + "/gare/utenti/list.php?id_gara=" + this.props.idGara, {
        withCredentials: true,
      })
      .then((response) => {
        this.setState({
          elencoUtentiGara: response.data.items || [],
          caricamento: false,
        });
      })
      .catch((err) => {
        console.log("Errore caricamento utenti gara", err);
        this.setState({
          caricamento: false,
          severity: "error",
          checkMessaggio: "Errore nel caricamento utenti assegnati.",
          avvisaOperazione: true,
        });
      });
  };

  caricaUtenti = () => {
    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .get(urlApi + "/utenti/list.php", { withCredentials: true })
      .then((response) => {
        this.setState({
          elencoUtenti: response.data.items || [],
        });
        this.utilityCrono.togliMUIXLicense();
      })
      .catch((err) => {
        console.log("Errore caricamento utenti", err);
      });
  };

  openDialog = () => {
    this.setState({
      openDialogAdd: true,
      rif_utente: "",
      ruolo: "",
      errorUtente: false,
    });
  };

  closeDialog = () => {
    this.setState({
      openDialogAdd: false,
      rif_utente: "",
      ruolo: "",
      errorUtente: false,
    });
  };

  aggiungiUtente = () => {
    if (!this.state.rif_utente) {
      this.setState({
        errorUtente: true,
        severity: "error",
        checkMessaggio: "Seleziona un utente.",
        avvisaOperazione: true,
      });
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .post(
        urlApi + "/gare/utenti/create.php",
        {
          rif_gara: this.props.idGara,
          rif_utente: this.state.rif_utente,
          ruolo: this.state.ruolo,
        },
        { withCredentials: true },
      )
      .then(() => {
        this.closeDialog();
        this.caricaUtentiGara();

        this.setState({
          severity: "success",
          checkMessaggio: "Utente assegnato correttamente.",
          avvisaOperazione: true,
        });
      })
      .catch((err) => {
        console.log("Errore inserimento utente gara", err);

        let messaggio = "Errore durante l'assegnazione dell'utente.";
        if (err.response && err.response.status === 409) {
          messaggio = "Utente già assegnato a questa gara.";
        }

        this.setState({
          severity: "error",
          checkMessaggio: messaggio,
          avvisaOperazione: true,
        });
      });
  };

  rimuoviUtente = (id) => {
    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .get(urlApi + "/gare/utenti/delete.php?id=" + id, {
        withCredentials: true,
      })
      .then(() => {
        this.caricaUtentiGara();

        this.setState({
          severity: "success",
          checkMessaggio: "Assegnazione rimossa correttamente.",
          avvisaOperazione: true,
        });
      })
      .catch((err) => {
        console.log("Errore cancellazione utente", err);

        this.setState({
          severity: "error",
          checkMessaggio: "Errore durante la rimozione dell'utente.",
          avvisaOperazione: true,
        });
      });
  };

  chiudiAvvisa = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({ avvisaOperazione: false });
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12">
              {this.utilityCrono.defineIfIsAdministrator() && (
                <div
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button className="styleButton" onClick={this.openDialog}>
                    <PersonAddIcon />
                    &nbsp;Aggiungi Utente
                  </Button>
                </div>
              )}

              <Box sx={{ height: 320, width: "100%" }}>
                <DataGridPro
                  sx={this.utilityCrono.returnSXDtaDrig()}
                  rows={this.state.elencoUtentiGara}
                  columns={this.colonne}
                  getRowId={(row) => row.id_gara_utente}
                  loading={this.state.caricamento}
                  rowHeight={40}
                  disableRowSelectionOnClick
                  hideFooterSelectedRowCount
                  pageSizeOptions={[10]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                />
              </Box>
            </div>
          </div>
        </div>

        <Dialog
          open={this.state.openDialogAdd}
          onClose={this.closeDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <Form>
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <Form.Group className="mb-3">
                      <Form.Label className="labelFieldnk">Utente*</Form.Label>
                      <Form.Select
                        className="textFieldnk"
                        size="sm"
                        value={this.state.rif_utente}
                        onChange={(e) =>
                          this.setState({
                            rif_utente: e.target.value,
                            errorUtente: false,
                          })
                        }
                        isValid={!this.state.errorUtente}
                        isInvalid={this.state.errorUtente}
                      >
                        <option value="">Seleziona utente...</option>

                        {this.state.elencoUtenti.map((item) => (
                          <option key={item.wp_user_id} value={item.wp_user_id}>
                            {item.display_name || item.username}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Group className="mb-3">
                      <Form.Label className="labelFieldnk">Ruolo</Form.Label>
                      {/* <Form.Control
                        className="textFieldnk"
                        size="sm"
                        type="text"
                        value={this.state.ruolo}
                        onChange={(e) =>
                          this.setState({ ruolo: e.target.value })
                        }
                        placeholder="Es. Cronometrista"
                      /> */}

                      <Form.Select
                        className="textFieldnk"
                        size="sm"
                        value={this.state.ruolo}
                        onChange={(e) =>
                          this.setState({
                            ruolo: e.target.value,
                            errorUtente: false,
                          })
                        }
                      >
                        <option value="">Seleziona utente...</option>
                        <option key={"SERVIZIO BASE"} value={"SERVIZIO BASE"}>
                          SERVIZIO BASE
                        </option>
                        <option
                          key={"SERVIZIO SPECIALISTICO"}
                          value="SERVIZIO SPECIALISTICO"
                        >
                          SERVIZIO SPECIALISTICO
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Form>
          </DialogContent>

          <DialogActions>
            <Button className="styleButton" onClick={this.closeDialog}>
              <ClearIcon />
              &nbsp;Annulla
            </Button>

            <Button className="styleButton" onClick={this.aggiungiUtente}>
              <CheckIcon />
              &nbsp;Salva
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={this.state.avvisaOperazione}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={5000}
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
      </>
    );
  }
}
