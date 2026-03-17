import React, { Component } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ModeIcon from "@mui/icons-material/Mode";
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

    //debugger;
    let urlQueryApi = "/gare/list.php";
    // if (!this.utilityCrono.defineIfIsAdministrator()) {
    //   urlQueryApi = "/gare/list.php?id=" + sessionStorage["ID"];
    // }

    //debugger;
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

  returnIconaStatoGara = (stato) => {
    switch (stato) {
      case "PUBBLICATA":
        return (
          <i title={stato}>
            <PublishedWithChangesIcon sx={{ color: "#0bc032" }} />
          </i>
        );
        break;
      case "BOZZA":
        return (
          <i title={stato}>
            <PendingIcon sx={{ color: "#f3960b" }} />
          </i>
        );
        break;
      case "CHIUSA":
        return (
          <i title={stato}>
            <BlockIcon sx={{ color: "#dd1b25" }} />
          </i>
        );
        break;
    }
    return <></>;
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
            title="Apri dettaglio gara"
            className="styleButton"
            style={{ height: "35px", minWidth: "35px" }}
            onClick={() => this.getDettaglioGara(param)}
          >
            <EditIcon fontSize="small" />
          </Button>
        );
      },
    },
    //{ field: "id_gara", headerName: "ID", width: 80, align: "center" },
    { field: "nome_gara", headerName: "NOME GARA", width: 260 },
    {
      field: "desc_disciplina",
      headerName: "DISCIPLINA",
      width: 110,
      //align: "center",
    },
    {
      field: "desc_manifestazione",
      headerName: "MANIFEST.",
      width: 120,
      //align: "center",
    },
    {
      field: "assegnata_a_num_ut",
      headerName: "ASSEGNATA A",
      width: 150,
      align: "center",
      renderCell: (param) => {
        return parseInt(param.row.assegnata_a_num_ut) == 0 ? (
          <div style={{ background: "#eea60a", borderRadius: "5px" }}>
            Gara non assegnata
          </div>
        ) : (
          <div style={{ background: "#0aaf2e", borderRadius: "5px" }}>
            Assegnata a <b>{param.row.assegnata_a_num_ut}</b>
          </div>
        );
      },
    },
    {
      field: "stato",
      headerName: "STATO",
      width: 110,
      align: "center",
      renderCell: (param) => {
        return this.returnIconaStatoGara(param.row.stato);
      },
    },
    // {
    //   field: "desc_regione",
    //   headerName: "REGIONE",
    //   width: 90,
    //   //align: "center",
    // },
    {
      field: "desc_provincia",
      headerName: "PROVINCIA",
      width: 100,
      //align: "center",
    },
    { field: "desc_comune", headerName: "COMUNE", width: 100, align: "left" },
    {
      field: "data_inizio",
      headerName: "DATA INIZIO",
      width: 120,
      align: "right",
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString("it-IT") : "",
    },
    {
      field: "data_fine",
      headerName: "DATA FINE",
      width: 120,
      align: "right",
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString("it-IT") : "",
    },
    //   { field: "note", headerName: "NOTE", width: 220 },
  ];

  getDettaglioGara = (param) => {
    //debugger;
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
      <div className="container boxStyle">
        <div className="row">
          <div className="col-4 headerGrid">
            <EmojiEventsIcon />
            &nbsp;{" "}
            {this.utilityCrono.defineIfIsAdministrator()
              ? "Elenco Gare"
              : "Elenco delle mie gare"}
          </div>
          {this.utilityCrono.defineIfIsAdministrator() && (
            <div className="col-8">
              <Button
                title="Legenda"
                className="styleButton"
                onClick={this.openLegenda}
              >
                <ListAltIcon />
              </Button>

              <Button className="styleButton" onClick={this.aggiungiNuovaGara}>
                <AddCircleOutlineIcon />
                &nbsp;Aggiungi Gara
              </Button>
            </div>
          )}
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
                  getRowId={(row) => row["id_gara"]}
                  rowHeight={40}
                  rows={this.state.elencoGare}
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
                        fileName: "ExportDataGare",
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
