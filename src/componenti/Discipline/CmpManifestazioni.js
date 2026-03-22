import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import FestivalIcon from "@mui/icons-material/Festival";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import Form from "react-bootstrap/Form";

import utilityCrono from "../utility/utilityCrono";

export default class CmpManifestazioni extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoManifestazioni: [],
    elencoDiscipline: [],
    caricamentoDati: false,

    apriDettaglio: false,
    manifestazioneSelezionata: null,

    avvisaOperazione: false,
    checkMessaggio: "",
    severity: "success",

    errorNome: false,
    errorDisciplina: false,
  };

  manifestazioneVuota = {
    id: null,
    nome: "",
    rif_disciplina: "",
    attivo: 1,
  };

  componentDidMount = async () => {
    await this.caricaDatiSupporto();
    this.getElencoManifestazioni();
  };

  caricaDatiSupporto = async () => {
    let urlApi = process.env.REACT_APP_API_URL;

    try {
      const responseDiscipline = await axios.get(
        urlApi + "/discipline/list.php",
        { withCredentials: true },
      );

      this.setState({
        elencoDiscipline:
          responseDiscipline.data.items || responseDiscipline.data.data || [],
      });
    } catch (error) {
      console.log("Errore caricamento discipline:", error);
    }
  };

  getElencoManifestazioni = () => {
    this.setState({ caricamentoDati: true });

    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .get(urlApi + "/manifestazioni/list.php", { withCredentials: true })
      .then((response) => {
        this.setState({
          caricamentoDati: false,
          elencoManifestazioni: response.data.items || response.data.data || [],
        });

        setTimeout(() => {
          this.utilityCrono.togliMUIXLicense();
        }, 500);
      })
      .catch((error) => {
        this.setState({ caricamentoDati: false });
        console.log("Errore caricamento manifestazioni:", error);
      });
  };

  Colonne = [
    {
      field: "azioni",
      headerName: "",
      width: 80,
      align: "center",
      renderCell: (param) => {
        return (
          <Button
            className="styleButton"
            style={{ height: "35px", minWidth: "35px" }}
            onClick={() => this.apriDettaglio(param.row)}
          >
            <EditIcon fontSize="small" />
          </Button>
        );
      },
    },
    { field: "id", headerName: "ID", width: 80, align: "center" },
    { field: "nome", headerName: "NOME", width: 260 },
    {
      field: "desc_disciplina",
      headerName: "DISCIPLINA",
      width: 180,
    },
    {
      field: "attivo",
      headerName: "ATTIVO",
      width: 120,
      align: "center",
      renderCell: (param) => {
        return param.row.attivo == 1 ? "SI" : "NO";
      },
    },
    {
      field: "toggle",
      headerName: "",
      width: 80,
      align: "center",
      renderCell: (param) => {
        return (
          <Button
            className="styleButton"
            style={{ height: "35px", minWidth: "35px" }}
            onClick={() => this.toggleAttivo(param.row)}
          >
            {param.row.attivo == 1 ? <ToggleOffIcon /> : <ToggleOnIcon />}
          </Button>
        );
      },
    },
  ];

  apriDettaglio = (row) => {
    this.setState({
      manifestazioneSelezionata: {
        ...row,
        rif_disciplina: row.rif_disciplina || "",
      },
      apriDettaglio: true,
      errorNome: false,
      errorDisciplina: false,
    });
  };

  aggiungiNuovaManifestazione = () => {
    this.setState({
      manifestazioneSelezionata: { ...this.manifestazioneVuota },
      apriDettaglio: true,
      errorNome: false,
      errorDisciplina: false,
    });
  };

  chiudiDettaglio = () => {
    this.setState({
      manifestazioneSelezionata: null,
      apriDettaglio: false,
    });
  };

  cambioProprieta = (prop, value) => {
    this.setState(
      (prevState) => ({
        manifestazioneSelezionata: {
          ...prevState.manifestazioneSelezionata,
          [prop]: value,
        },
      }),
      () => {
        if (prop === "nome") {
          this.setState({ errorNome: !value || value.trim().length < 2 });
        }

        if (prop === "rif_disciplina") {
          this.setState({
            errorDisciplina: !value || String(value).trim() === "",
          });
        }
      },
    );
  };

  validaForm = () => {
    const m = this.state.manifestazioneSelezionata;

    const errorNome = !m.nome || m.nome.trim().length < 2;
    const errorDisciplina =
      !m.rif_disciplina || String(m.rif_disciplina).trim() === "";

    this.setState({
      errorNome,
      errorDisciplina,
    });

    return !errorNome && !errorDisciplina;
  };

  salvaManifestazione = () => {
    if (!this.validaForm()) {
      this.setState({
        severity: "error",
        checkMessaggio: "Dati manifestazione incompleti o non validi",
        avvisaOperazione: true,
      });
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;
    let endpoint =
      this.state.manifestazioneSelezionata.id == null
        ? "/manifestazioni/create.php"
        : "/manifestazioni/update.php";

    axios
      .post(urlApi + endpoint, this.state.manifestazioneSelezionata, {
        withCredentials: true,
      })
      .then((response) => {
        this.setState({
          severity: "success",
          checkMessaggio: "Salvataggio eseguito correttamente",
          avvisaOperazione: true,
        });

        this.chiudiDettaglio();
        this.getElencoManifestazioni();
      })
      .catch((error) => {
        console.log("Errore salvataggio manifestazione:", error);

        let messaggio = "Errore durante il salvataggio";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            messaggio = error.response.data.message;
          }
          if (error.response.data.fields) {
            let errori = error.response.data.fields;
            let testoErrori = "";
            let key;
            for (key in errori) {
              testoErrori += key + ": " + errori[key] + " ";
            }
            if (testoErrori !== "") {
              messaggio = testoErrori;
            }
          }
        }

        this.setState({
          severity: "error",
          checkMessaggio: messaggio,
          avvisaOperazione: true,
        });
      });
  };

  toggleAttivo = (row) => {
    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .post(
        urlApi + "/manifestazioni/toggle.php",
        {
          id: row.id,
          attivo: row.attivo == 1 ? 0 : 1,
        },
        { withCredentials: true },
      )
      .then(() => {
        this.getElencoManifestazioni();
      })
      .catch((error) => {
        console.log("Errore toggle manifestazione:", error);
        this.setState({
          severity: "error",
          checkMessaggio: "Errore aggiornamento stato manifestazione",
          avvisaOperazione: true,
        });
      });
  };

  chiudiAvvisa = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({ avvisaOperazione: false });
  };

  getIntestazione = () => {
    return (
      <div className="container boxStyle">
        <div className="row">
          <div className="col-6 headerGrid">
            <FestivalIcon />
            &nbsp; Gestione Manifestazioni
          </div>

          <div className="col-6 text-end">
            <Button
              className="styleButton"
              onClick={this.aggiungiNuovaManifestazione}
            >
              <AddCircleOutlineIcon />
              &nbsp;Nuova Manifestazione
            </Button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const m = this.state.manifestazioneSelezionata;
    const elencoDiscipline = this.state.elencoDiscipline || [];

    return (
      <>
        <div className="container">
          <div className="row rowNiko">
            <div className="col-12">
              <Box sx={{ margin: "15px", height: "50px" }}>
                {this.getIntestazione()}
              </Box>
            </div>
          </div>

          <div className="row rowNiko">
            <div className="col-12">
              <Box sx={{ margin: "15px", height: "600px" }}>
                <DataGridPro
                  sx={this.utilityCrono.returnSXDtaDrig()}
                  getRowId={(row) => row.id}
                  rowHeight={40}
                  rows={this.state.elencoManifestazioni}
                  columns={this.Colonne}
                  pagination
                  pageSizeOptions={[20, 50]}
                  disableRowSelectionOnClick
                  showToolbar
                  loading={this.state.caricamentoDati}
                  slotProps={{
                    loadingOverlay: {
                      variant: "circular-progress",
                      noRowsVariant: "circular-progress",
                    },
                    toolbar: {
                      csvOptions: {
                        fileName: "ExportDataManifestazioni",
                        delimiter: ";",
                        utf8WithBom: true,
                      },
                    },
                  }}
                />
              </Box>
            </div>
          </div>
        </div>

        {m && (
          <Dialog
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown
            open={this.state.apriDettaglio}
            onClose={this.chiudiDettaglio}
          >
            <DialogContent>
              <Form>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <Form.Group className="mb-3">
                        <Form.Label className="labelFieldnk">
                          Disciplina*
                        </Form.Label>
                        <Form.Select
                          className="textFieldnk"
                          size="sm"
                          value={m.rif_disciplina || ""}
                          onChange={(e) =>
                            this.cambioProprieta(
                              "rif_disciplina",
                              e.target.value,
                            )
                          }
                          isValid={!this.state.errorDisciplina}
                          isInvalid={this.state.errorDisciplina}
                        >
                          <option value="">Seleziona disciplina...</option>
                          {elencoDiscipline.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.nome}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <Form.Group className="mb-3">
                        <Form.Label className="labelFieldnk">
                          Nome Manifestazione*
                        </Form.Label>
                        <Form.Control
                          className="textFieldnk"
                          size="sm"
                          type="text"
                          value={m.nome || ""}
                          onChange={(e) =>
                            this.cambioProprieta("nome", e.target.value)
                          }
                          isValid={!this.state.errorNome}
                          isInvalid={this.state.errorNome}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </Form>
            </DialogContent>

            <DialogActions>
              <Button className="styleButton" onClick={this.chiudiDettaglio}>
                <ClearIcon /> Annulla
              </Button>

              <Button
                className="styleButton"
                onClick={this.salvaManifestazione}
              >
                <CheckIcon /> Conferma
              </Button>
            </DialogActions>
          </Dialog>
        )}

        <Snackbar
          open={this.state.avvisaOperazione}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={4000}
          onClose={this.chiudiAvvisa}
        >
          <Alert
            onClose={this.chiudiAvvisa}
            severity={this.state.severity}
            variant="filled"
          >
            {this.state.checkMessaggio}
          </Alert>
        </Snackbar>
      </>
    );
  }
}
