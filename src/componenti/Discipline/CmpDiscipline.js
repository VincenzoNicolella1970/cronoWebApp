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
import CategoryIcon from "@mui/icons-material/Category";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import Form from "react-bootstrap/Form";

import utilityCrono from "../utility/utilityCrono";

export default class CmpDiscipline extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoDiscipline: [],
    caricamentoDati: false,

    apriDettaglio: false,
    disciplinaSelezionata: null,

    avvisaOperazione: false,
    checkMessaggio: "",
    severity: "success",

    errorNome: false,
  };

  disciplinaVuota = {
    id: null,
    nome: "",
    attivo: 1,
  };

  componentDidMount = () => {
    this.getElencoDiscipline();
  };

  getElencoDiscipline = () => {
    this.setState({ caricamentoDati: true });

    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .get(urlApi + "/discipline/list.php", { withCredentials: true })
      .then((response) => {
        this.setState({
          caricamentoDati: false,
          elencoDiscipline: response.data.items || response.data.data || [],
        });

        setTimeout(() => {
          this.utilityCrono.togliMUIXLicense();
        }, 500);
      })
      .catch((error) => {
        this.setState({ caricamentoDati: false });
        console.log("Errore caricamento discipline:", error);
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
    { field: "nome", headerName: "NOME", width: 250 },
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
      disciplinaSelezionata: { ...row },
      apriDettaglio: true,
      errorNome: false,
    });
  };

  aggiungiNuovaDisciplina = () => {
    this.setState({
      disciplinaSelezionata: { ...this.disciplinaVuota },
      apriDettaglio: true,
      errorNome: false,
    });
  };

  chiudiDettaglio = () => {
    this.setState({
      disciplinaSelezionata: null,
      apriDettaglio: false,
    });
  };

  cambioProprieta = (prop, value) => {
    this.setState((prevState) => ({
      disciplinaSelezionata: {
        ...prevState.disciplinaSelezionata,
        [prop]: value,
      },
    }));

    if (prop === "nome") {
      this.setState({ errorNome: !value || value.trim().length < 2 });
    }
  };

  validaForm = () => {
    const d = this.state.disciplinaSelezionata;

    const errore = !d.nome || d.nome.trim().length < 2;

    this.setState({ errorNome: errore });

    return !errore;
  };

  salvaDisciplina = () => {
    if (!this.validaForm()) {
      this.setState({
        severity: "error",
        checkMessaggio: "Nome disciplina non valido",
        avvisaOperazione: true,
      });
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;
    let endpoint =
      this.state.disciplinaSelezionata.id == null
        ? "/discipline/create.php"
        : "/discipline/update.php";

    axios
      .post(urlApi + endpoint, this.state.disciplinaSelezionata, {
        withCredentials: true,
      })
      .then((response) => {
        this.setState({
          severity: "success",
          checkMessaggio: "Salvataggio eseguito correttamente",
          avvisaOperazione: true,
        });

        this.chiudiDettaglio();
        this.getElencoDiscipline();
      })
      .catch((error) => {
        console.log("Errore salvataggio disciplina:", error);
        this.setState({
          severity: "error",
          checkMessaggio: "Errore durante il salvataggio",
          avvisaOperazione: true,
        });
      });
  };

  toggleAttivo = (row) => {
    let urlApi = process.env.REACT_APP_API_URL;

    axios
      .post(
        urlApi + "/discipline/toggle.php",
        {
          id: row.id,
          attivo: row.attivo == 1 ? 0 : 1,
        },
        { withCredentials: true },
      )
      .then(() => {
        this.getElencoDiscipline();
      })
      .catch((error) => {
        console.log("Errore toggle disciplina:", error);
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
            <CategoryIcon />
            &nbsp; Gestione Discipline
          </div>

          <div className="col-6 text-end">
            <Button
              className="styleButton"
              onClick={this.aggiungiNuovaDisciplina}
            >
              <AddCircleOutlineIcon />
              &nbsp;Nuova Disciplina
            </Button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const d = this.state.disciplinaSelezionata;

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
                  rows={this.state.elencoDiscipline}
                  columns={this.Colonne}
                  pagination
                  pageSizeOptions={[20, 50]}
                  disableRowSelectionOnClick
                  showToolbar
                  loading={this.state.caricamentoDati}
                />
              </Box>
            </div>
          </div>
        </div>

        {d && (
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
                          Nome Disciplina*
                        </Form.Label>
                        <Form.Control
                          className="textFieldnk"
                          size="sm"
                          type="text"
                          value={d.nome || ""}
                          onChange={(e) =>
                            this.cambioProprieta("nome", e.target.value)
                          }
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

              <Button className="styleButton" onClick={this.salvaDisciplina}>
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
