import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
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

    // Se vorrai filtrare lato backend per utente non admin:
    // if (sessionStorage["ruolo"] !== "administrator") {
    //   urlQueryApi += "?rifUtente=" + sessionStorage["ID"];
    // }

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

  returnIconaStatoNotaSpesa = (stato) => {
    switch ((stato || "").toUpperCase()) {
      case "APPROVATA":
        return (
          <i title={stato}>
            <DoneAllIcon sx={{ color: "#0bc032" }} />
          </i>
        );

      case "INVIATA":
        return (
          <i title={stato}>
            <PublishedWithChangesIcon sx={{ color: "#1e88e5" }} />
          </i>
        );

      case "BOZZA":
        return (
          <i title={stato}>
            <PendingIcon sx={{ color: "#f3960b" }} />
          </i>
        );

      case "RESPINTA":
        return (
          <i title={stato}>
            <BlockIcon sx={{ color: "#dd1b25" }} />
          </i>
        );

      case "LIQUIDATA":
        return (
          <i title={stato}>
            <ModeIcon sx={{ color: "#7b1fa2" }} />
          </i>
        );

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
    if (value === null || value === undefined || value === "") {
      return "";
    }

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
      renderCell: (param) => {
        return (
          <Button
            title="Apri dettaglio nota spesa"
            className="styleButton"
            style={{ height: "35px", minWidth: "35px" }}
            onClick={() => this.getDettaglioNotaSpesa(param)}
          >
            <EditIcon fontSize="small" />
          </Button>
        );
      },
    },
    // { field: "id", headerName: "ID", width: 80, align: "center" },
    // {
    //   field: "utente",
    //   headerName: "UTENTE",
    //   width: 180,
    // },
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
      width: 160,
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
      field: "km_percorsi",
      headerName: "KM",
      width: 90,
      align: "right",
      valueFormatter: (value) => this.formattaImporto(value),
    },
    {
      field: "spese_autostrada_eur",
      headerName: "AUTOSTR.",
      width: 100,
      align: "right",
      valueFormatter: (value) => this.formattaImporto(value),
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
      renderCell: (param) => {
        return this.returnIconaStatoNotaSpesa(param.row.stato);
      },
    },
    // {
    //   field: "created_at",
    //   headerName: "CREATA IL",
    //   width: 140,
    //   align: "right",
    //   valueFormatter: (value) =>
    //     value ? new Date(value).toLocaleDateString("it-IT") : "",
    // },
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
      <div className="container boxStyle">
        <div className="row">
          <div className="col-8 headerGrid">
            <ReceiptLongIcon />
            &nbsp;Elenco Note Spesa -{" "}
            {this.utilityCrono.returnUserInfo().last_name +
              " " +
              this.utilityCrono.returnUserInfo().first_name}
          </div>
          <div className="col-4">
            <Button
              className="styleButton"
              onClick={this.aggiungiNuovaNotaSpesa}
            >
              <AddCircleOutlineIcon />
              &nbsp;Aggiungi Nota Spesa
            </Button>
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
              <Box sx={{ margin: "15px", height: "600px", width: "100%" }}>
                <DataGridPro
                  sx={this.utilityCrono.returnSXDtaDrig()}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 20, page: 0 },
                    },
                  }}
                  getRowId={(row) => row["id"]}
                  rowHeight={40}
                  rows={this.state.elencoNoteSpesa}
                  columns={this.Colonne}
                  pagination={true}
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
              </Box>
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
