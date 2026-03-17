import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ModeIcon from "@mui/icons-material/Mode";
import BlockIcon from "@mui/icons-material/Block";
import PendingIcon from "@mui/icons-material/Pending";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import utilityCrono from "../utility/utilityCrono";
import CmpDettaglioNotaSpesaAdmin from "./CmpDettaglioNotaSpesaAdmin";

export default class CmpNoteSpeseUtenti extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoNoteSpesa: [],
    idNotaSpesa: null,
    apriDettaglioNotaSpesa: false,
    caricamentoDati: false,

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
      const [responseUtenti, responseGare] = await Promise.all([
        axios.get(urlApi + "/utenti/list.php", { withCredentials: true }),
        axios.post(urlApi + "/gare/list.php", JSON.stringify({ admin: 1 }), {
          withCredentials: true,
        }),
      ]);

      this.setState({
        elencoUtenti:
          responseUtenti.data.items || responseUtenti.data.data || [],
        elencoGare: responseGare.data.items || responseGare.data.data || [],
      });
    } catch (error) {
      console.log("Errore caricamento dati supporto:", error);
    }
  };

  getElencoNoteSpesa = () => {
    this.setState({ caricamentoDati: true });

    let urlApi = process.env.REACT_APP_API_URL;
    let myBody = JSON.stringify({ admin: 1 });

    axios
      .post(urlApi + "/nota_spesa/list.php", myBody, {
        withCredentials: true,
      })
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
        console.log("Errore caricamento elenco note spesa utenti:", error);
      });
  };

  returnIconaStatoNotaSpesa = (stato) => {
    switch ((stato || "").toUpperCase()) {
      case "APPROVATA":
        return <DoneAllIcon sx={{ color: "#0bc032" }} />;
      case "INVIATA":
        return <PublishedWithChangesIcon sx={{ color: "#1e88e5" }} />;
      case "BOZZA":
        return <PendingIcon sx={{ color: "#f3960b" }} />;
      case "RESPINTA":
        return <BlockIcon sx={{ color: "#dd1b25" }} />;
      case "LIQUIDATA":
        return <ModeIcon sx={{ color: "#7b1fa2" }} />;
      default:
        return <></>;
    }
  };

  calcolaTotale = (row) => {
    const autostrada = parseFloat(row.spese_autostrada_eur || 0);
    const sp1 = parseFloat(row.spesa1_eur || 0);
    const sp2 = parseFloat(row.spesa2_eur || 0);
    const ricevute = parseFloat(row.somme_ricevute_eur || 0);
    return autostrada + sp1 + sp2 - ricevute;
  };

  formattaImporto = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  Colonne = [
    {
      field: "azioni",
      headerName: "",
      width: 70,
      align: "center",
      renderCell: (param) => (
        <Button
          title="Apri dettaglio nota spesa"
          className="styleButton"
          style={{ height: "35px", minWidth: "35px" }}
          onClick={() => this.getDettaglioNotaSpesa(param)}
        >
          <EditIcon fontSize="small" />
        </Button>
      ),
    },
    {
      field: "utente",
      headerName: "UTENTE",
      width: 220,
    },
    {
      field: "nome_gara",
      headerName: "GARA",
      width: 240,
    },
    {
      field: "disciplina",
      headerName: "DISCIPLINA",
      width: 120,
    },
    {
      field: "manifestazione",
      headerName: "MANIFEST.",
      width: 170,
    },
    {
      field: "data_servizio",
      headerName: "DATA SERVIZIO",
      width: 130,
      align: "right",
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString("it-IT") : "",
    },
    {
      field: "totale_nota",
      headerName: "TOTALE",
      width: 110,
      align: "right",
      valueGetter: (value, row) => this.calcolaTotale(row),
      valueFormatter: (value) => this.formattaImporto(value),
    },
    {
      field: "stato",
      headerName: "STATO",
      width: 110,
      align: "center",
      renderCell: (param) => this.returnIconaStatoNotaSpesa(param.row.stato),
    },
  ];

  getDettaglioNotaSpesa = (param) => {
    this.setState({
      idNotaSpesa: param.row.id,
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

  getIntestazione = () => {
    return (
      <div className="container boxStyle">
        <div className="row">
          <div className="col-12 headerGrid">
            <ReceiptLongIcon />
            &nbsp;Gestione Note Spesa Utenti
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="row rowNiko">
            <div className="col-12">
              <Box sx={{ margin: "15px", height: "50px", width: "100%" }}>
                {this.getIntestazione()}
              </Box>
            </div>
          </div>

          <div className="row rowNiko">
            <div className="col-12">
              <Box sx={{ margin: "15px", height: "650px", width: "100%" }}>
                <DataGridPro
                  sx={this.utilityCrono.returnSXDtaDrig()}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 20, page: 0 },
                    },
                  }}
                  getRowId={(row) => row.id}
                  rowHeight={40}
                  rows={this.state.elencoNoteSpesa}
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

        <CmpDettaglioNotaSpesaAdmin
          chiudiDettaglio={this.chiudiDettaglioNotaSpesa}
          idNotaSpesa={this.state.idNotaSpesa}
          openDialog={this.state.apriDettaglioNotaSpesa}
          elencoUtenti={this.state.elencoUtenti}
          elencoGare={this.state.elencoGare}
          modalita="admin"
        />
      </>
    );
  }
}
