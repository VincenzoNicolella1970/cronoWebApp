import React, { Component } from "react";
import axios from "axios";
import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import EventIcon from "@mui/icons-material/Event";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlaceIcon from "@mui/icons-material/Place";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PendingIcon from "@mui/icons-material/Pending";
import BlockIcon from "@mui/icons-material/Block";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import Form from "react-bootstrap/Form";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import utilityCrono from "../utility/utilityCrono";

export default class CmpAttivita extends Component {
  utilityCrono = new utilityCrono();

  state = {
    elencoGare: [],
    caricamentoDati: false,

    filtroDataDa: null,
    filtroDataA: null,
    filtroPeriodo: "TUTTE",
  };

  componentDidMount = () => {
    this.getElencoGare();
  };

  getElencoGare = () => {
    this.setState({ caricamentoDati: true });

    let urlApi = process.env.REACT_APP_API_URL;
    let urlQueryApi = "/gare/list.php";

    let myBody = !this.utilityCrono.defineIfIsAdministrator()
      ? JSON.stringify({ id: sessionStorage["ID"] })
      : null;

    axios
      .post(urlApi + urlQueryApi, null, { withCredentials: true })
      .then((response) => {
        let elenco = response.data.items || response.data.data || [];

        elenco = elenco.sort((a, b) => {
          const pesoA = this.getPesoOrdinamento(a);
          const pesoB = this.getPesoOrdinamento(b);

          if (pesoA !== pesoB) return pesoA - pesoB;

          const dataA = a.data_inizio ? new Date(a.data_inizio).getTime() : 0;
          const dataB = b.data_inizio ? new Date(b.data_inizio).getTime() : 0;

          if (pesoA === 3) {
            return dataB - dataA;
          }

          return dataA - dataB;
        });

        this.setState({
          caricamentoDati: false,
          elencoGare: elenco,
        });
      })
      .catch((error) => {
        this.setState({ caricamentoDati: false });
        console.log("Errore caricamento attività:", error);
      });
  };

  pulisciFiltri = () => {
    this.setState({
      filtroDataDa: null,
      filtroDataA: null,
      filtroPeriodo: "TUTTE",
    });
  };

  getPesoOrdinamento = (gara) => {
    if (this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato)) return 0;
    if (this.isToday(gara.data_inizio)) return 0;
    if (this.isThisWeek(gara.data_inizio)) return 1;
    if (this.isFuture(gara.data_inizio)) return 2;
    return 3;
  };

  formattaData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("it-IT");
  };

  formattaDataDayjs = (data) => {
    if (!data) return "";
    return dayjs(data).format("DD/MM/YYYY");
  };

  formattaGiorno = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("it-IT", { day: "2-digit" });
  };

  formattaMeseAnno = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("it-IT", {
      month: "short",
      year: "numeric",
    });
  };

  formattaGiornoSettimana = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("it-IT", {
      weekday: "long",
    });
  };

  isToday = (data) => {
    if (!data) return false;

    const d = new Date(data);
    const oggi = new Date();

    return (
      d.getFullYear() === oggi.getFullYear() &&
      d.getMonth() === oggi.getMonth() &&
      d.getDate() === oggi.getDate()
    );
  };

  isPast = (dataFine, stato) => {
    if (stato === "CHIUSA") return true;
    if (!dataFine) return false;

    const oggi = new Date();
    const dFine = new Date(dataFine);
    dFine.setHours(23, 59, 59, 999);

    return dFine < oggi;
  };

  isFuture = (dataInizio) => {
    if (!dataInizio) return false;

    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const dInizio = new Date(dataInizio);
    dInizio.setHours(0, 0, 0, 0);

    return dInizio > oggi;
  };

  isInCorso = (dataInizio, dataFine, stato) => {
    if (stato === "CHIUSA") return false;
    if (!dataInizio) return false;

    const oggi = new Date();
    oggi.setHours(12, 0, 0, 0);

    const dInizio = new Date(dataInizio);
    dInizio.setHours(0, 0, 0, 0);

    const dFine = dataFine ? new Date(dataFine) : new Date(dataInizio);
    dFine.setHours(23, 59, 59, 999);

    return oggi >= dInizio && oggi <= dFine;
  };

  isThisWeek = (dataInizio) => {
    if (!dataInizio) return false;
    if (this.isToday(dataInizio)) return false;
    if (!this.isFuture(dataInizio)) return false;

    const oggi = new Date();
    const start = new Date(oggi);
    start.setHours(0, 0, 0, 0);

    const end = new Date(oggi);
    end.setDate(oggi.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const d = new Date(dataInizio);
    return d >= start && d <= end;
  };

  passaFiltroData = (gara) => {
    const { filtroDataDa, filtroDataA } = this.state;

    if (!gara.data_inizio) return false;

    const dataGara = dayjs(gara.data_inizio);

    if (filtroDataDa && dataGara.isBefore(filtroDataDa, "day")) {
      return false;
    }

    if (filtroDataA && dataGara.isAfter(filtroDataA, "day")) {
      return false;
    }

    return true;
  };

  passaFiltroPeriodo = (gara) => {
    const { filtroPeriodo } = this.state;

    switch (filtroPeriodo) {
      case "OGGI":
        return this.isToday(gara.data_inizio);

      case "IN_CORSO":
        return this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato);

      case "OGGI_IN_CORSO":
        return (
          this.isToday(gara.data_inizio) ||
          this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato)
        );

      case "SETTIMANA":
        return this.isThisWeek(gara.data_inizio);

      case "PROSSIME":
        return this.isFuture(gara.data_inizio);

      case "STORICO":
        return this.isPast(gara.data_fine, gara.stato);

      case "TUTTE":
      default:
        return true;
    }
  };

  isAssegnataAMe = (gara) => {
    return parseInt(gara.assegnata_a_me || 0) === 1;
  };

  getChipAssegnazione = (gara) => {
    if (!this.isAssegnataAMe(gara)) return null;

    return (
      <Chip
        size="small"
        icon={<AssignmentIndIcon />}
        label="ASSEGNATA A ME"
        sx={{
          backgroundColor: "#ede7f6",
          color: "#6a1b9a",
          fontWeight: 700,
          border: "1px solid #d1c4e9",
        }}
      />
    );
  };

  getLabelPeriodo = (gara) => {
    if (this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato)) {
      return <Chip size="small" color="success" label="IN CORSO" />;
    }

    if (this.isToday(gara.data_inizio)) {
      return <Chip size="small" color="warning" label="OGGI" />;
    }

    if (this.isThisWeek(gara.data_inizio)) {
      return <Chip size="small" color="info" label="QUESTA SETTIMANA" />;
    }

    if (this.isFuture(gara.data_inizio)) {
      return <Chip size="small" color="primary" label="PROGRAMMATA" />;
    }

    if (this.isPast(gara.data_fine, gara.stato)) {
      return <Chip size="small" color="default" label="STORICO" />;
    }

    return null;
  };

  getChipPeriodoDate = (gara) => {
    let testo = this.formattaData(gara.data_inizio);
    if (gara.data_fine) {
      testo += " - " + this.formattaData(gara.data_fine);
    }

    return (
      <Chip
        size="small"
        variant="outlined"
        icon={<CalendarMonthIcon />}
        label={testo}
      />
    );
  };

  returnIconaStatoGara = (stato) => {
    switch (stato) {
      case "PUBBLICATA":
        return (
          <i title={stato}>
            <PublishedWithChangesIcon sx={{ color: "#0bc032" }} />
          </i>
        );
      case "BOZZA":
        return (
          <i title={stato}>
            <PendingIcon sx={{ color: "#f3960b" }} />
          </i>
        );
      case "CHIUSA":
        return (
          <i title={stato}>
            <BlockIcon sx={{ color: "#dd1b25" }} />
          </i>
        );
      default:
        return <></>;
    }
  };

  getColoreTimeline = (gara) => {
    if (this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato)) {
      return "#2e7d32";
    }

    if (this.isToday(gara.data_inizio)) {
      return "#ed6c02";
    }

    if (this.isThisWeek(gara.data_inizio)) {
      return "#0288d1";
    }

    if (this.isFuture(gara.data_inizio)) {
      return "#1976d2";
    }

    return "#9e9e9e";
  };

  getSfondoCard = (gara) => {
    if (this.isAssegnataAMe(gara)) {
      return "#faf6ff";
    }

    if (this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato)) {
      return "#f1f8f4";
    }

    if (this.isToday(gara.data_inizio)) {
      return "#fff7ed";
    }

    if (this.isThisWeek(gara.data_inizio)) {
      return "#eef8fd";
    }

    if (this.isFuture(gara.data_inizio)) {
      return "#f3f8fe";
    }

    return "#fafafa";
  };

  getEtichettaPeriodo = (gara) => {
    if (this.isAssegnataAMe(gara)) {
      return "Gara assegnata al mio profilo";
    }

    if (this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato)) {
      return "Attività in corso";
    }

    if (this.isToday(gara.data_inizio)) {
      return "Oggi";
    }

    if (this.isThisWeek(gara.data_inizio)) {
      return "In programma questa settimana";
    }

    if (this.isFuture(gara.data_inizio)) {
      return "Attività programmata";
    }

    return "Storico attività";
  };

  apriDettaglio = (gara) => {
    if (this.props.apriDettaglioGara) {
      this.props.apriDettaglioGara(gara.id_gara);
    }
  };

  getTitolo = () => {
    return (
      <div className="container boxStyle">
        <div className="row">
          <div className="col-12 headerGrid">
            <EventIcon />
            &nbsp;
            {this.utilityCrono.defineIfIsAdministrator()
              ? "Calendario Attività Gare"
              : "Calendario delle mie gare"}
          </div>
        </div>
      </div>
    );
  };

  getFiltri = () => {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: "12px",
          border: "1px solid #e5e9f2",
          backgroundColor: "#ffffff",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              //flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <DatePicker
              label="Data da"
              value={this.state.filtroDataDa}
              onChange={(newValue) => this.setState({ filtroDataDa: newValue })}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: 170,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  },
                },
              }}
            />

            <DatePicker
              label="Data a"
              value={this.state.filtroDataA}
              onChange={(newValue) => this.setState({ filtroDataA: newValue })}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: 170,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  },
                },
              }}
            />

            <Form.Select
              size="sm"
              value={this.state.filtroPeriodo}
              onChange={(e) => this.setState({ filtroPeriodo: e.target.value })}
              style={{
                minWidth: "220px",
                maxWidth: "320px",
                height: "40px",
                borderRadius: "10px",
              }}
            >
              <option value="TUTTE">Tutte</option>
              <option value="OGGI_IN_CORSO">Oggi / In corso</option>
              <option value="OGGI">Solo oggi</option>
              <option value="IN_CORSO">Solo in corso</option>
              <option value="SETTIMANA">Questa settimana</option>
              <option value="PROSSIME">Prossime attività</option>
              <option value="STORICO">Storico</option>
            </Form.Select>

            <Button
              variant="outlined"
              onClick={this.pulisciFiltri}
              sx={{
                height: "40px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Pulisci
            </Button>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Chip
              size="small"
              variant={this.state.filtroDataDa ? "filled" : "outlined"}
              label={
                this.state.filtroDataDa
                  ? `Dal ${this.formattaDataDayjs(this.state.filtroDataDa)}`
                  : "Nessuna data iniziale"
              }
            />

            <Chip
              size="small"
              variant={this.state.filtroDataA ? "filled" : "outlined"}
              label={
                this.state.filtroDataA
                  ? `Al ${this.formattaDataDayjs(this.state.filtroDataA)}`
                  : "Nessuna data finale"
              }
            />

            <Chip
              size="small"
              color="primary"
              variant={
                this.state.filtroPeriodo === "TUTTE" ? "outlined" : "filled"
              }
              label={`Periodo: ${this.state.filtroPeriodo}`}
            />
          </Box>
        </LocalizationProvider>
      </Paper>
    );
  };

  renderSectionTitle = (titolo, colore) => {
    return (
      <Box sx={{ mb: 2, mt: 3 }}>
        <Typography
          sx={{
            fontSize: "1.05rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            color: colore,
            borderLeft: `5px solid ${colore}`,
            pl: 1.5,
          }}
        >
          {titolo}
        </Typography>
      </Box>
    );
  };

  renderTimelineItem = (gara, index, totalItems) => {
    const coloreTimeline = this.getColoreTimeline(gara);
    const isUltimo = index === totalItems - 1;
    const assegnataAMe = this.isAssegnataAMe(gara);

    return (
      <Box
        key={gara.id_gara || index}
        sx={{
          display: "flex",
          alignItems: "stretch",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: "135px",
            minWidth: "135px",
            pr: 2,
            textAlign: "right",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1,
              color: assegnataAMe ? "#6a1b9a" : coloreTimeline,
            }}
          >
            {this.formattaGiorno(gara.data_inizio)}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              textTransform: "capitalize",
              color: "#555",
            }}
          >
            {this.formattaMeseAnno(gara.data_inizio)}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.82rem",
              textTransform: "capitalize",
              color: "#777",
            }}
          >
            {this.formattaGiornoSettimana(gara.data_inizio)}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "40px",
            minWidth: "40px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: isUltimo ? "50%" : 0,
              width: "3px",
              backgroundColor: "#d0d7de",
              borderRadius: "3px",
            }}
          />

          <FiberManualRecordIcon
            sx={{
              color: assegnataAMe ? "#6a1b9a" : coloreTimeline,
              fontSize: "1.2rem",
              mt: "20px",
              zIndex: 2,
              backgroundColor: "#fff",
              borderRadius: "50%",
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={assegnataAMe ? 4 : 2}
            sx={{
              p: 2.5,
              borderRadius: "10px",
              borderLeft: `6px solid ${assegnataAMe ? "#6a1b9a" : coloreTimeline}`,
              backgroundColor: this.getSfondoCard(gara),
              boxShadow: assegnataAMe
                ? "0 0 0 2px rgba(106,27,154,0.10)"
                : undefined,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: "260px" }}>
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: assegnataAMe ? "#6a1b9a" : coloreTimeline,
                    mb: 0.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {this.getEtichettaPeriodo(gara)}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    lineHeight: 1.15,
                  }}
                >
                  {gara.nome_gara}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#333",
                    mb: 1.2,
                  }}
                >
                  <PlaceIcon sx={{ fontSize: 18, verticalAlign: "middle" }} />
                  &nbsp;
                  {gara.desc_comune || "-"}
                  {gara.desc_provincia ? ` (${gara.desc_provincia})` : ""}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {this.getLabelPeriodo(gara)}
                  {this.getChipAssegnazione(gara)}
                  {this.getChipPeriodoDate(gara)}
                  {this.returnIconaStatoGara(gara.stato)}
                </Box>
              </Box>

              {this.props.apriDettaglioGara && (
                <Button
                  className="styleButton"
                  onClick={() => this.apriDettaglio(gara)}
                >
                  <OpenInNewIcon />
                  &nbsp;Dettaglio
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
              <Typography variant="body1">
                <EmojiEventsIcon
                  sx={{ fontSize: 18, verticalAlign: "middle" }}
                />
                &nbsp;
                <b>Disciplina:</b> {gara.desc_disciplina || "-"}
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <b>Manifestazione:</b> {gara.desc_manifestazione || "-"}
              </Typography>

              {gara.note && (
                <Typography variant="body1">
                  <b>Note:</b> {gara.note}
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  renderSection = (titolo, colore, items) => {
    if (!items || items.length === 0) return null;

    return (
      <>
        {this.renderSectionTitle(titolo, colore)}
        <Box>
          {items.map((gara, index) =>
            this.renderTimelineItem(gara, index, items.length),
          )}
        </Box>
      </>
    );
  };

  render() {
    const elencoFiltrato = this.state.elencoGare.filter(
      (gara) => this.passaFiltroData(gara) && this.passaFiltroPeriodo(gara),
    );

    const gareOggiInCorso = elencoFiltrato.filter(
      (gara) =>
        this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato) ||
        this.isToday(gara.data_inizio),
    );

    const gareSettimana = elencoFiltrato.filter(
      (gara) =>
        !this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato) &&
        !this.isToday(gara.data_inizio) &&
        this.isThisWeek(gara.data_inizio),
    );

    const gareFuture = elencoFiltrato.filter(
      (gara) =>
        !this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato) &&
        !this.isToday(gara.data_inizio) &&
        !this.isThisWeek(gara.data_inizio) &&
        this.isFuture(gara.data_inizio),
    );

    const gareStorico = elencoFiltrato.filter(
      (gara) =>
        !this.isInCorso(gara.data_inizio, gara.data_fine, gara.stato) &&
        !this.isToday(gara.data_inizio) &&
        !this.isThisWeek(gara.data_inizio) &&
        !this.isFuture(gara.data_inizio),
    );

    return (
      <div className="container">
        <div className="row rowNiko">
          <div className="col-12">
            <Box sx={{ margin: "15px", height: "50px", width: "100%" }}>
              {this.getTitolo()}
            </Box>
          </div>
        </div>

        <div className="row rowNiko">
          <div className="col-12">
            <Box sx={{ margin: "15px", width: "100%" }}>{this.getFiltri()}</Box>
          </div>
        </div>

        <div className="row rowNiko">
          <div className="col-12">
            <Box sx={{ margin: "15px", minHeight: "500px", width: "100%" }}>
              {this.state.caricamentoDati ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "250px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : elencoFiltrato.length === 0 ? (
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="body1">
                    Nessuna attività presente con i filtri selezionati.
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ py: 1 }}>
                  {this.renderSection(
                    "Oggi / In corso",
                    "#2e7d32",
                    gareOggiInCorso,
                  )}
                  {this.renderSection(
                    "Questa settimana",
                    "#0288d1",
                    gareSettimana,
                  )}
                  {this.renderSection(
                    "Prossime attività",
                    "#1976d2",
                    gareFuture,
                  )}
                  {this.renderSection("Storico", "#757575", gareStorico)}
                </Box>
              )}
            </Box>
          </div>
        </div>
      </div>
    );
  }
}
