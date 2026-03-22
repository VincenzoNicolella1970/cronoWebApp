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
import FestivalIcon from "@mui/icons-material/Festival";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import Form from "react-bootstrap/Form";

import utilityCrono from "../utility/utilityCrono";

export default class CmpDisciplineManifestazioni extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoDiscipline: [],
    elencoManifestazioni: [],

    caricamentoDiscipline: false,
    caricamentoManifestazioni: false,

    disciplinaSelezionata: null,

    apriDettaglioDisciplina: false,
    apriDettaglioManifestazione: false,

    disciplinaInEdit: null,
    manifestazioneInEdit: null,

    avvisaOperazione: false,
    checkMessaggio: "",
    severity: "success",

    errorNomeDisciplina: false,
    errorNomeManifestazione: false,
    errorDisciplinaManifestazione: false,
  };

  disciplinaVuota = {
    id: null,
    nome: "",
    attivo: 1,
  };

  manifestazioneVuota = {
    id: null,
    nome: "",
    rif_disciplina: "",
    attivo: 1,
  };

  componentDidMount = async () => {
    await this.getElencoDiscipline();
  };

  getElencoDiscipline = async () => {
    this.setState({ caricamentoDiscipline: true });

    let urlApi = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(urlApi + "/discipline/list.php", {
        withCredentials: true,
      });

      const elencoDiscipline = response.data.items || response.data.data || [];

      this.setState(
        {
          caricamentoDiscipline: false,
          elencoDiscipline,
        },
        () => {
          if (this.state.disciplinaSelezionata) {
            const disciplinaAggiornata = elencoDiscipline.find(
              (d) =>
                String(d.id) === String(this.state.disciplinaSelezionata.id),
            );

            if (disciplinaAggiornata) {
              this.setState({ disciplinaSelezionata: disciplinaAggiornata });
              this.getElencoManifestazioni(disciplinaAggiornata.id);
            } else {
              this.setState({
                disciplinaSelezionata: null,
                elencoManifestazioni: [],
              });
            }
          }
        },
      );

      setTimeout(() => {
        this.utilityCrono.togliMUIXLicense();
      }, 500);
    } catch (error) {
      this.setState({ caricamentoDiscipline: false });
      console.log("Errore caricamento discipline:", error);
    }
  };

  getElencoManifestazioni = async (idDisciplina) => {
    if (!idDisciplina) {
      this.setState({ elencoManifestazioni: [] });
      return;
    }

    this.setState({ caricamentoManifestazioni: true });

    let urlApi = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(urlApi + "/manifestazioni/list.php", {
        withCredentials: true,
      });

      let elencoManifestazioni =
        response.data.items || response.data.data || [];

      elencoManifestazioni = elencoManifestazioni.filter(
        (m) => String(m.rif_disciplina) === String(idDisciplina),
      );

      this.setState({
        caricamentoManifestazioni: false,
        elencoManifestazioni,
      });

      setTimeout(() => {
        this.utilityCrono.togliMUIXLicense();
      }, 500);
    } catch (error) {
      this.setState({ caricamentoManifestazioni: false });
      console.log("Errore caricamento manifestazioni:", error);
    }
  };

  selezionaDisciplina = (row) => {
    this.setState(
      {
        disciplinaSelezionata: row,
      },
      () => {
        this.getElencoManifestazioni(row.id);
      },
    );
  };

  ColonneDiscipline = [
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
            onClick={() => this.apriDettaglioDisciplina(param.row)}
          >
            <EditIcon fontSize="small" />
          </Button>
        );
      },
    },
    // { field: "id", headerName: "ID", width: 80, align: "center" },
    { field: "nome", headerName: "NOME", width: 250 },
    //{
    //   field: "attivo",
    //   headerName: "ATTIVO",
    //   width: 120,
    //   align: "center",
    //   renderCell: (param) => {
    //     return param.row.attivo == 1 ? "SI" : "NO";
    //   },
    // },
    // {
    //   field: "toggle",
    //   headerName: "",
    //   width: 80,
    //   align: "center",
    //   renderCell: (param) => {
    //     return (
    //       <Button
    //         className="styleButton"
    //         style={{ height: "35px", minWidth: "35px" }}
    //         onClick={() => this.toggleAttivoDisciplina(param.row)}
    //       >
    //         {param.row.attivo == 1 ? <ToggleOffIcon /> : <ToggleOnIcon />}
    //       </Button>
    //     );
    //   },
    //},
  ];

  ColonneManifestazioni = [
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
            onClick={() => this.apriDettaglioManifestazione(param.row)}
          >
            <EditIcon fontSize="small" />
          </Button>
        );
      },
    },
    // { field: "id", headerName: "ID", width: 80, align: "center" },
    { field: "nome", headerName: "NOME", width: 260 },
    // {
    //   field: "desc_disciplina",
    //   headerName: "DISCIPLINA",
    //   width: 180,
    // },
    // {
    //   field: "attivo",
    //   headerName: "ATTIVO",
    //   width: 120,
    //   align: "center",
    //   renderCell: (param) => {
    //     return param.row.attivo == 1 ? "SI" : "NO";
    //   },
    // },
    // {
    //   field: "toggle",
    //   headerName: "",
    //   width: 80,
    //   align: "center",
    //   renderCell: (param) => {
    //     return (
    //       <Button
    //         className="styleButton"
    //         style={{ height: "35px", minWidth: "35px" }}
    //         onClick={() => this.toggleAttivoManifestazione(param.row)}
    //       >
    //         {param.row.attivo == 1 ? <ToggleOffIcon /> : <ToggleOnIcon />}
    //       </Button>
    //     );
    //   },
    // },
  ];

  apriDettaglioDisciplina = (row) => {
    this.setState({
      disciplinaInEdit: { ...row },
      apriDettaglioDisciplina: true,
      errorNomeDisciplina: false,
    });
  };

  aggiungiNuovaDisciplina = () => {
    this.setState({
      disciplinaInEdit: { ...this.disciplinaVuota },
      apriDettaglioDisciplina: true,
      errorNomeDisciplina: false,
    });
  };

  chiudiDettaglioDisciplina = () => {
    this.setState({
      disciplinaInEdit: null,
      apriDettaglioDisciplina: false,
    });
  };

  cambioProprietaDisciplina = (prop, value) => {
    this.setState({
      disciplinaInEdit: {
        ...this.state.disciplinaInEdit,
        [prop]: value,
      },
      errorNomeDisciplina:
        prop === "nome"
          ? !value || value.trim().length < 2
          : this.state.errorNomeDisciplina,
    });
  };

  validaDisciplina = () => {
    const d = this.state.disciplinaInEdit;
    const errorNomeDisciplina = !d.nome || d.nome.trim().length < 2;

    this.setState({ errorNomeDisciplina });

    return !errorNomeDisciplina;
  };

  salvaDisciplina = async () => {
    if (!this.validaDisciplina()) {
      this.setState({
        severity: "error",
        checkMessaggio: "Nome disciplina non valido",
        avvisaOperazione: true,
      });
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;
    let endpoint =
      this.state.disciplinaInEdit.id == null
        ? "/discipline/create.php"
        : "/discipline/update.php";

    try {
      await axios.post(urlApi + endpoint, this.state.disciplinaInEdit, {
        withCredentials: true,
      });

      this.setState({
        severity: "success",
        checkMessaggio: "Salvataggio disciplina eseguito correttamente",
        avvisaOperazione: true,
      });

      this.chiudiDettaglioDisciplina();
      await this.getElencoDiscipline();
    } catch (error) {
      console.log("Errore salvataggio disciplina:", error);
      this.setState({
        severity: "error",
        checkMessaggio: "Errore durante il salvataggio disciplina",
        avvisaOperazione: true,
      });
    }
  };

  toggleAttivoDisciplina = async (row) => {
    let urlApi = process.env.REACT_APP_API_URL;

    try {
      await axios.post(
        urlApi + "/discipline/toggle.php",
        {
          id: row.id,
          attivo: row.attivo == 1 ? 0 : 1,
        },
        { withCredentials: true },
      );

      await this.getElencoDiscipline();
    } catch (error) {
      console.log("Errore toggle disciplina:", error);
      this.setState({
        severity: "error",
        checkMessaggio: "Errore aggiornamento stato disciplina",
        avvisaOperazione: true,
      });
    }
  };

  apriDettaglioManifestazione = (row) => {
    this.setState({
      manifestazioneInEdit: {
        ...row,
        rif_disciplina:
          row.rif_disciplina || this.state.disciplinaSelezionata?.id || "",
      },
      apriDettaglioManifestazione: true,
      errorNomeManifestazione: false,
      errorDisciplinaManifestazione: false,
    });
  };

  aggiungiNuovaManifestazione = () => {
    if (!this.state.disciplinaSelezionata) {
      this.setState({
        severity: "warning",
        checkMessaggio: "Seleziona prima una disciplina",
        avvisaOperazione: true,
      });
      return;
    }

    this.setState({
      manifestazioneInEdit: {
        ...this.manifestazioneVuota,
        rif_disciplina: this.state.disciplinaSelezionata.id,
      },
      apriDettaglioManifestazione: true,
      errorNomeManifestazione: false,
      errorDisciplinaManifestazione: false,
    });
  };

  chiudiDettaglioManifestazione = () => {
    this.setState({
      manifestazioneInEdit: null,
      apriDettaglioManifestazione: false,
    });
  };

  cambioProprietaManifestazione = (prop, value) => {
    this.setState(
      {
        manifestazioneInEdit: {
          ...this.state.manifestazioneInEdit,
          [prop]: value,
        },
      },
      () => {
        if (prop === "nome") {
          this.setState({
            errorNomeManifestazione: !value || value.trim().length < 2,
          });
        }

        if (prop === "rif_disciplina") {
          this.setState({
            errorDisciplinaManifestazione:
              !value || String(value).trim() === "",
          });
        }
      },
    );
  };

  validaManifestazione = () => {
    const m = this.state.manifestazioneInEdit;

    const errorNomeManifestazione = !m.nome || m.nome.trim().length < 2;
    const errorDisciplinaManifestazione =
      !m.rif_disciplina || String(m.rif_disciplina).trim() === "";

    this.setState({
      errorNomeManifestazione,
      errorDisciplinaManifestazione,
    });

    return !errorNomeManifestazione && !errorDisciplinaManifestazione;
  };

  salvaManifestazione = async () => {
    if (!this.validaManifestazione()) {
      this.setState({
        severity: "error",
        checkMessaggio: "Dati manifestazione incompleti o non validi",
        avvisaOperazione: true,
      });
      return;
    }

    let urlApi = process.env.REACT_APP_API_URL;
    let endpoint =
      this.state.manifestazioneInEdit.id == null
        ? "/manifestazioni/create.php"
        : "/manifestazioni/update.php";

    try {
      await axios.post(urlApi + endpoint, this.state.manifestazioneInEdit, {
        withCredentials: true,
      });

      this.setState({
        severity: "success",
        checkMessaggio: "Salvataggio manifestazione eseguito correttamente",
        avvisaOperazione: true,
      });

      this.chiudiDettaglioManifestazione();
      await this.getElencoManifestazioni(this.state.disciplinaSelezionata?.id);
    } catch (error) {
      console.log("Errore salvataggio manifestazione:", error);

      let messaggio = "Errore durante il salvataggio manifestazione";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messaggio = error.response.data.message;
      }

      this.setState({
        severity: "error",
        checkMessaggio: messaggio,
        avvisaOperazione: true,
      });
    }
  };

  toggleAttivoManifestazione = async (row) => {
    let urlApi = process.env.REACT_APP_API_URL;

    try {
      await axios.post(
        urlApi + "/manifestazioni/toggle.php",
        {
          id: row.id,
          attivo: row.attivo == 1 ? 0 : 1,
        },
        { withCredentials: true },
      );

      await this.getElencoManifestazioni(this.state.disciplinaSelezionata?.id);
    } catch (error) {
      console.log("Errore toggle manifestazione:", error);
      this.setState({
        severity: "error",
        checkMessaggio: "Errore aggiornamento stato manifestazione",
        avvisaOperazione: true,
      });
    }
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
            &nbsp; Elenco Discipline
          </div>

          <div className="col-6 text-end">
            <Button
              className="styleButton"
              onClick={this.aggiungiNuovaDisciplina}
            >
              <AddCircleOutlineIcon />
              &nbsp; Disciplina
            </Button>
          </div>
        </div>
      </div>
    );
  };

  getIntestazioneManifestazioni = () => {
    return (
      <div className="container boxStyle">
        <div className="row">
          <div className="col-7 headerGrid">
            <FestivalIcon />
            &nbsp;
            {this.state.disciplinaSelezionata
              ? " " + this.state.disciplinaSelezionata.nome
              : "Manifestazioni"}
          </div>

          <div className="col-5 text-end">
            <Button
              className="styleButton"
              onClick={this.aggiungiNuovaManifestazione}
              disabled={!this.state.disciplinaSelezionata}
            >
              <AddCircleOutlineIcon />
              &nbsp; Manifestazione
            </Button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      elencoDiscipline,
      elencoManifestazioni,
      disciplinaSelezionata,
      disciplinaInEdit,
      manifestazioneInEdit,
    } = this.state;

    return (
      <>
        <div className="container">
          <div className="row rowNiko">
            <div className="col-5">
              <div className="row rowNiko">
                <div className="col-12">
                  <Box sx={{ margin: "5px", height: "50px" }}>
                    {this.getIntestazione()}
                  </Box>
                </div>
              </div>

              <div className="row rowNiko">
                <div className="col-12">
                  <Box sx={{ margin: "5px", height: "620px" }}>
                    <DataGridPro
                      sx={this.utilityCrono.returnSXDtaDrig()}
                      getRowId={(row) => row.id}
                      rowHeight={40}
                      rows={elencoDiscipline}
                      columns={this.ColonneDiscipline}
                      pagination
                      pageSizeOptions={[10, 20, 50]}
                      disableRowSelectionOnClick
                      showToolbar
                      loading={this.state.caricamentoDiscipline}
                      onRowClick={(param) =>
                        this.selezionaDisciplina(param.row)
                      }
                      slotProps={{
                        loadingOverlay: {
                          variant: "circular-progress",
                          noRowsVariant: "circular-progress",
                        },
                        toolbar: {
                          csvOptions: {
                            fileName: "ExportDataDiscipline",
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

            <div className="col-7">
              <div className="container">
                <div className="row rowNiko">
                  <div className="col-12">
                    <Box sx={{ margin: "5px", height: "50px", width: "100%" }}>
                      {this.getIntestazioneManifestazioni()}
                    </Box>
                  </div>
                </div>

                <div className="row rowNiko">
                  <div className="col-12">
                    <Box sx={{ margin: "5px", height: "620px" }}>
                      <DataGridPro
                        sx={this.utilityCrono.returnSXDtaDrig()}
                        getRowId={(row) => row.id}
                        rowHeight={40}
                        rows={disciplinaSelezionata ? elencoManifestazioni : []}
                        columns={this.ColonneManifestazioni}
                        pagination
                        pageSizeOptions={[10, 20, 50]}
                        disableRowSelectionOnClick
                        showToolbar
                        loading={this.state.caricamentoManifestazioni}
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
            </div>
          </div>
        </div>

        {disciplinaInEdit && (
          <Dialog
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown
            open={this.state.apriDettaglioDisciplina}
            onClose={this.chiudiDettaglioDisciplina}
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
                          value={disciplinaInEdit.nome || ""}
                          onChange={(e) =>
                            this.cambioProprietaDisciplina(
                              "nome",
                              e.target.value,
                            )
                          }
                          isInvalid={this.state.errorNomeDisciplina}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </Form>
            </DialogContent>

            <DialogActions>
              <Button
                className="styleButton"
                onClick={this.chiudiDettaglioDisciplina}
              >
                <ClearIcon /> Annulla
              </Button>

              <Button className="styleButton" onClick={this.salvaDisciplina}>
                <CheckIcon /> Conferma
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {manifestazioneInEdit && (
          <Dialog
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown
            open={this.state.apriDettaglioManifestazione}
            onClose={this.chiudiDettaglioManifestazione}
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
                          value={manifestazioneInEdit.rif_disciplina || ""}
                          onChange={(e) =>
                            this.cambioProprietaManifestazione(
                              "rif_disciplina",
                              e.target.value,
                            )
                          }
                          isValid={!this.state.errorDisciplinaManifestazione}
                          isInvalid={this.state.errorDisciplinaManifestazione}
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
                          value={manifestazioneInEdit.nome || ""}
                          onChange={(e) =>
                            this.cambioProprietaManifestazione(
                              "nome",
                              e.target.value,
                            )
                          }
                          isInvalid={this.state.errorNomeManifestazione}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </Form>
            </DialogContent>

            <DialogActions>
              <Button
                className="styleButton"
                onClick={this.chiudiDettaglioManifestazione}
              >
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
