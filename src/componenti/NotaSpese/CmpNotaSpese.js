import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { DataGridPro } from "@mui/x-data-grid-pro";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ModeIcon from "@mui/icons-material/Mode";
import BlockIcon from "@mui/icons-material/Block";
import PendingIcon from "@mui/icons-material/Pending";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import utilityCrono from "../utility/utilityCrono";
import CmpDettaglioNotaSpesa from "./CmpDettaglioNotaSpesa";

export default class CmpNotaSpesa extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoNoteSpesa: [],
    idNotaSpesa: null,
    apriDettaglioNotaSpesa: false,
    caricamentoDati: false,
    openLegenda: false,

    elencoUtenti: [],
    elencoGare: [],
  };

  componentDidMount = async () => {
    await this.caricaDatiSupporto();
    this.getElencoNoteSpesa();
  };

  caricaDatiSupporto = async () => {
    let urlApi = process.env.REACT_APP_API_URL;

    try {
      let myBody = JSON.stringify({ id: sessionStorage["ID"] });
      const [responseUtenti, responseGare] = await Promise.all([
        axios.get(urlApi + "/utenti/list.php", { withCredentials: true }),
        axios.post(urlApi + "/gare/list.php", myBody, {
          withCredentials: true,
        }),
      ]);

      this.setState({
        elencoUtenti:
          responseUtenti.data.items || responseUtenti.data.data || [],
        elencoGare: responseGare.data.items || responseGare.data.data || [],
      });
    } catch (error) {
      console.log("Errore caricamento dati di supporto note spesa:", error);
    }
  };

  getElencoNoteSpesa = () => {
    this.setState({ caricamentoDati: true });

    let urlApi = process.env.REACT_APP_API_URL;
    let urlQueryApi = "/nota_spesa/list.php";
    let myBody = JSON.stringify({ id: sessionStorage["ID"] });

    axios
      .post(urlApi + urlQueryApi, myBody, { withCredentials: true })
      .then((response) => {
        this.setState({
          caricamentoDati: false,
          elencoNoteSpesa: response.data.items || response.data.data || [],
        });

        setTimeout(() => {
          this.utilityCrono.togliMUIXLicense();
        }, 500);
      })
      .catch((error) => {
        this.setState({ caricamentoDati: false });
        console.log("Errore caricamento note spesa:", error);
      });
  };

  calcolaTotale = (row) => {
    const autostrada = parseFloat(row.spese_autostrada_eur || 0);
    const sp1 = parseFloat(row.spesa1_eur || 0);
    const sp2 = parseFloat(row.spesa2_eur || 0);
    const ricevute = parseFloat(row.somme_ricevute_eur || 0);

    // return autostrada + sp1 + sp2 - ricevute;
    return autostrada + sp1 + sp2;
  };

  formattaImporto = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    return new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  formattaData = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("it-IT");
  };

  returnChipStatoNotaSpesa = (stato) => {
    switch ((stato || "").toUpperCase()) {
      case "APPROVATA":
        return (
          <Chip
            icon={<DoneAllIcon />}
            label="Approvata"
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

      case "INVIATA":
        return (
          <Chip
            icon={<PublishedWithChangesIcon />}
            label="Inviata"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              backgroundColor: "#eaf2fd",
              color: "#1e88e5",
              "& .MuiChip-icon": { color: "#1e88e5" },
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

      case "RESPINTA":
        return (
          <Chip
            icon={<BlockIcon />}
            label="Respinta"
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

      case "LIQUIDATA":
        return (
          <Chip
            icon={<ModeIcon />}
            label="Liquidata"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              backgroundColor: "#f3e8ff",
              color: "#7b1fa2",
              "& .MuiChip-icon": { color: "#7b1fa2" },
            }}
          />
        );

      default:
        return <Chip label={stato || "-"} size="small" />;
    }
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
          <Tooltip title="Apri dettaglio nota spesa">
            <Button
              className="styleButton"
              onClick={() => this.getDettaglioNotaSpesa(param)}
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
      headerName: "GARA",
      minWidth: 240,
      flex: 1.3,
      renderCell: (param) => (
        <Box sx={{ fontWeight: 600, color: "#101828" }}>
          {param.row.nome_gara}
        </Box>
      ),
    },
    {
      field: "disciplina",
      headerName: "DISCIPLINA",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "manifestazione",
      headerName: "MANIFEST.",
      minWidth: 150,
      flex: 0.9,
    },
    {
      field: "data_servizio",
      headerName: "DATA SERVIZIO",
      minWidth: 130,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => this.formattaData(param.row.data_servizio),
    },
    {
      field: "km_percorsi",
      headerName: "KM",
      minWidth: 90,
      flex: 0.5,
      align: "right",
      headerAlign: "right",
      renderCell: (param) => this.formattaImporto(param.row.km_percorsi),
    },
    {
      field: "spese_autostrada_eur",
      headerName: "AUTOSTR.",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "right",
      renderCell: (param) =>
        this.formattaImporto(param.row.spese_autostrada_eur),
    },
    {
      field: "totale_nota",
      headerName: "TOTALE",
      minWidth: 110,
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: (param) =>
        this.formattaImporto(this.calcolaTotale(param.row)),
    },
    {
      field: "totale_amministrativo",
      headerName: "TOTALE AMM.",
      minWidth: 110,
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: (param) =>
        this.formattaImporto(param.row.totale_amministrativo),
    },
    {
      field: "stato",
      headerName: "STATO",
      minWidth: 140,
      flex: 0.9,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => this.returnChipStatoNotaSpesa(param.row.stato),
    },
  ];

  getDettaglioNotaSpesa = (param) => {
    let idNotaSpesa = param.row["id"];
    this.setState({
      idNotaSpesa: idNotaSpesa,
      apriDettaglioNotaSpesa: true,
    });
  };

  chiudiDettaglioNotaSpesa = (aggiornaLista) => {
    this.setState({
      idNotaSpesa: null,
      apriDettaglioNotaSpesa: false,
    });

    if (aggiornaLista) {
      this.getElencoNoteSpesa();
    }
  };

  aggiungiNuovaNotaSpesa = () => {
    this.setState({
      idNotaSpesa: null,
      apriDettaglioNotaSpesa: true,
    });
  };

  getIntestazione = () => {
    const userInfo = this.utilityCrono.returnUserInfo();

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
          <div className="col-md-7 col-12 mb-2 mb-md-0">
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
                <ReceiptLongIcon />
              </Box>

              <Box>
                <Box
                  sx={{ fontSize: "1rem", fontWeight: 700, color: "#101828" }}
                >
                  Elenco Note Spesa
                </Box>
                <Box sx={{ fontSize: "0.85rem", color: "#667085" }}>
                  {userInfo.last_name + " " + userInfo.first_name}
                </Box>
              </Box>
            </Box>
          </div>

          <div className="col-md-5 col-12">
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button
                //className="styleButton"
                onClick={this.aggiungiNuovaNotaSpesa}
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
                Aggiungi Nota Spesa
              </Button>
            </Box>
          </div>
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
                  height: "620px",
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
                  getRowId={(row) => row["id"]}
                  rowHeight={46}
                  rows={this.state.elencoNoteSpesa}
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
                        fileName: "ExportDataNoteSpesa",
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

        <CmpDettaglioNotaSpesa
          chiudiDettaglio={this.chiudiDettaglioNotaSpesa}
          idNotaSpesa={this.state.idNotaSpesa}
          openDialog={this.state.apriDettaglioNotaSpesa}
          elencoUtenti={this.state.elencoUtenti}
          elencoGare={this.state.elencoGare}
        />
      </>
    );
  }
}
