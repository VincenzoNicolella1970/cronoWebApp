import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

import { DataGridPro } from "@mui/x-data-grid-pro";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import BlockIcon from "@mui/icons-material/Block";
import PendingIcon from "@mui/icons-material/Pending";

import utilityCrono from "../utility/utilityCrono";
import CmpDettaglioGara from "./CmpDettaglioGara";

export default class CmpGare extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoGare: [],
    idGara: null,
    apriDettaglioGara: false,
    caricamentoDati: false,
    openLegenda: false,

    elencoDiscipline: [],
    elencoManifestazioni: [],
    elencoRegioni: [],
    elencoProvince: [],
    elencoComuni: [],
  };

  caricaDatiSupporto = async () => {
    let urlApi = process.env.REACT_APP_API_URL;

    try {
      const [
        responseDiscipline,
        responseManifestazioni,
        responseRegioni,
        responseProvince,
        responseComuni,
      ] = await Promise.all([
        axios.get(urlApi + "/discipline/list.php", { withCredentials: true }),
        axios.get(urlApi + "/manifestazioni/list.php", {
          withCredentials: true,
        }),
        axios.get(urlApi + "/regioni/list.php", { withCredentials: true }),
        axios.get(urlApi + "/province/list.php", { withCredentials: true }),
        axios.get(urlApi + "/comuni/list.php", { withCredentials: true }),
      ]);

      this.setState({
        elencoDiscipline:
          responseDiscipline.data.items || responseDiscipline.data.data || [],
        elencoManifestazioni:
          responseManifestazioni.data.items ||
          responseManifestazioni.data.data ||
          [],
        elencoRegioni:
          responseRegioni.data.items || responseRegioni.data.data || [],
        elencoProvince:
          responseProvince.data.items || responseProvince.data.data || [],
        elencoComuni:
          responseComuni.data.items || responseComuni.data.data || [],
      });
    } catch (error) {
      console.log("Errore caricamento dati di supporto:", error);
    }
  };

  getElencoGare = () => {
    this.setState({ caricamentoDati: true });

    let urlApi = process.env.REACT_APP_API_URL;
    let urlQueryApi = "/gare/list.php";

    let myBody = !this.utilityCrono.defineIfIsAdministrator()
      ? JSON.stringify({ id: sessionStorage["ID"] })
      : null;

    axios
      .post(urlApi + urlQueryApi, myBody, { withCredentials: true })
      .then((response) => {
        this.setState({
          caricamentoDati: false,
          elencoGare: response.data.items || response.data.data || [],
        });

        setTimeout(() => {
          this.utilityCrono.togliMUIXLicense();
        }, 500);
      })
      .catch((error) => {
        this.setState({ caricamentoDati: false });
        console.log("Errore caricamento gare:", error);
      });
  };

  componentDidMount = async () => {
    await this.caricaDatiSupporto();
    this.getElencoGare();
  };

  formattaData = (valore) => {
    if (!valore) return "";
    return new Date(valore).toLocaleDateString("it-IT");
  };

  getChipStatoGara = (stato) => {
    switch (stato) {
      case "PUBBLICATA":
        return (
          <Chip
            icon={<PublishedWithChangesIcon />}
            label="Pubblicata"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              backgroundColor: "#e8f7ed",
              color: "#1f7a36",
              "& .MuiChip-icon": { color: "#1f7a36" },
            }}
          />
        );

      case "BOZZA":
        return (
          <Chip
            icon={<PendingIcon />}
            label="Bozza"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              backgroundColor: "#fff4e5",
              color: "#b26a00",
              "& .MuiChip-icon": { color: "#b26a00" },
            }}
          />
        );

      case "CHIUSA":
        return (
          <Chip
            icon={<BlockIcon />}
            label="Chiusa"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              backgroundColor: "#fdecec",
              color: "#b42318",
              "& .MuiChip-icon": { color: "#b42318" },
            }}
          />
        );

      default:
        return <Chip label={stato || "-"} size="small" />;
    }
  };

  getBadgeAssegnazione = (numUtenti) => {
    const valore = parseInt(numUtenti, 10);

    if (!valore) {
      return (
        <Box
          sx={{
            px: 1.2,
            py: 0.5,
            borderRadius: "999px",
            backgroundColor: "#fff4e5",
            color: "#b26a00",
            fontWeight: 600,
            fontSize: "0.78rem",
            display: "inline-block",
          }}
        >
          Gara non assegnata
        </Box>
      );
    }

    return (
      <Box
        sx={{
          px: 1.2,
          py: 0.5,
          borderRadius: "999px",
          backgroundColor: "#e8f7ed",
          color: "#1f7a36",
          fontWeight: 600,
          fontSize: "0.78rem",
          display: "inline-block",
        }}
      >
        Assegnata a {valore}
      </Box>
    );
  };

  Colonne = [
    {
      field: "azioni",
      headerName: "",
      width: 80,
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (param) => {
        return (
          <Tooltip title="Apri dettaglio gara">
            <Button
              className="styleButton"
              onClick={() => this.getDettaglioGara(param)}
              sx={{
                minWidth: "36px",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid #d0d5dd",
                backgroundColor: "#ffffff",
                color: "#344054",
                boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                  borderColor: "#bfc6d4",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Tooltip>
        );
      },
    },
    {
      field: "nome_gara",
      headerName: "NOME GARA",
      flex: 1.3,
      minWidth: 240,
      renderCell: (param) => (
        <Box sx={{ fontWeight: 600, color: "#101828" }}>
          {param.row.nome_gara}
        </Box>
      ),
    },
    {
      field: "desc_disciplina",
      headerName: "DISCIPLINA",
      flex: 0.8,
      minWidth: 130,
    },
    {
      field: "desc_manifestazione",
      headerName: "MANIFEST.",
      flex: 0.9,
      minWidth: 140,
    },
    {
      field: "assegnata_a_num_ut",
      headerName: "ASSEGNAZIONE",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (param) =>
        this.getBadgeAssegnazione(param.row.assegnata_a_num_ut),
    },
    {
      field: "stato",
      headerName: "STATO",
      flex: 0.8,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => this.getChipStatoGara(param.row.stato),
    },
    {
      field: "desc_provincia",
      headerName: "PROVINCIA",
      flex: 0.7,
      minWidth: 110,
    },
    {
      field: "desc_comune",
      headerName: "COMUNE",
      flex: 0.9,
      minWidth: 130,
    },
    {
      field: "data_inizio",
      headerName: "DATA INIZIO",
      flex: 0.75,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => this.formattaData(param.row.data_inizio),
    },
    {
      field: "data_fine",
      headerName: "DATA FINE",
      flex: 0.75,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => this.formattaData(param.row.data_fine),
    },
  ];

  getDettaglioGara = (param) => {
    let idGara = param.row["id_gara"];
    this.setState({
      idGara: idGara,
      apriDettaglioGara: true,
    });
  };

  chiudiDettaglioGara = (aggiornaLista) => {
    this.setState({
      idGara: null,
      apriDettaglioGara: false,
    });

    if (aggiornaLista) {
      this.getElencoGare();
    }
  };

  aggiungiNuovaGara = () => {
    this.setState({
      idGara: null,
      apriDettaglioGara: true,
    });
  };

  openLegenda = () => {
    this.setState({
      openLegenda: true,
    });
  };

  chiudiLegenda = () => {
    this.setState({
      openLegenda: false,
    });
  };

  getIntestazione = () => {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "18px",
          border: "1px solid #eaecf0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-5 col-12 mb-2 mb-md-0">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  backgroundColor: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3949ab",
                }}
              >
                <EmojiEventsIcon />
              </Box>

              <Box>
                <Box
                  sx={{ fontSize: "1rem", fontWeight: 700, color: "#101828" }}
                >
                  {this.utilityCrono.defineIfIsAdministrator()
                    ? "Elenco Gare"
                    : "Elenco delle mie gare"}
                </Box>
                <Box sx={{ fontSize: "0.85rem", color: "#667085" }}>
                  Gestione e consultazione delle gare presenti nel sistema
                </Box>
              </Box>
            </Box>
          </div>

          {this.utilityCrono.defineIfIsAdministrator() && (
            <div className="col-md-7 col-12">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  // className="styleButton"
                  onClick={this.aggiungiNuovaGara}
                  variant="contained"
                  sx={{
                    borderRadius: "12px",
                    px: 2.5,
                    py: 1.1,

                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    letterSpacing: "0.02em",

                    backgroundColor: "#4f46e5",
                    color: "#ffffff",

                    boxShadow: "0 2px 6px rgba(79,70,229,0.25)",

                    "&:hover": {
                      backgroundColor: "#4338ca",
                      boxShadow: "0 4px 10px rgba(79,70,229,0.30)",
                    },

                    "& .MuiSvgIcon-root": {
                      fontSize: "20px",
                    },
                  }}
                >
                  <AddCircleOutlineIcon sx={{ mr: 1 }} />
                  Aggiungi Gara
                </Button>
              </Box>
            </div>
          )}
        </div>
      </Paper>
    );
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="row rowNiko">
            <div className="col-12">
              <Box sx={{ margin: "15px 15px 10px 15px", width: "100%" }}>
                {this.getIntestazione()}
              </Box>
            </div>
          </div>

          <div className="row rowNiko">
            <div className="col-12">
              <Paper
                elevation={0}
                sx={{
                  margin: "0 15px 15px 15px",
                  p: 1.5,
                  height: "640px",
                  borderRadius: "18px",
                  border: "1px solid #eaecf0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
                }}
              >
                <DataGridPro
                  sx={{
                    border: "none",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: "0.84rem",

                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f8fafc",
                      color: "#344054",
                      borderBottom: "1px solid #eaecf0",
                      fontFamily: "Roboto, Arial, sans-serif",
                    },

                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.03em",
                      fontFamily: "Roboto, Arial, sans-serif",
                    },

                    "& .MuiDataGrid-row": {
                      borderBottom: "1px solid #f2f4f7",
                      backgroundColor: "#ffffff",
                    },

                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: "#fcfcfd",
                    },

                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#f5f8ff",
                    },

                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.83rem",
                      fontFamily: "Roboto, Arial, sans-serif",
                      color: "#101828",
                    },

                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "1px solid #eaecf0",
                      backgroundColor: "#fcfcfd",
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: "0.80rem",
                    },

                    "& .MuiTablePagination-root": {
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: "0.80rem",
                    },

                    "& .MuiDataGrid-toolbarContainer": {
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: "0.80rem",
                    },
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 20, page: 0 },
                    },
                  }}
                  getRowId={(row) => row["id_gara"]}
                  rowHeight={52}
                  rows={this.state.elencoGare}
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
                        fileName: "ExportDataGare",
                        delimiter: ";",
                        utf8WithBom: true,
                      },
                    },
                  }}
                />
              </Paper>
            </div>
          </div>
        </div>

        <CmpDettaglioGara
          chiudiDettaglio={this.chiudiDettaglioGara}
          idGara={this.state.idGara}
          openDialog={this.state.apriDettaglioGara}
          elencoDiscipline={this.state.elencoDiscipline}
          elencoManifestazioni={this.state.elencoManifestazioni}
          elencoRegioni={this.state.elencoRegioni}
          elencoProvince={this.state.elencoProvince}
          elencoComuni={this.state.elencoComuni}
        />
      </>
    );
  }
}
