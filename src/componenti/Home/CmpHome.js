import React, { Component } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsightsIcon from "@mui/icons-material/Insights";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import utilityCrono from "../utility/utilityCrono";

export default class CmpHome extends Component {
  utilityCrono = new utilityCrono();

  getCurrentYearStart = () => {
    const now = new Date();
    return `${now.getFullYear()}-01-01`;
  };

  getToday = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  getEmptyDashboard = () => ({
    periodo: "",
    dataDa: "",
    dataA: "",
    gareTotali: 0,
    noteTotali: 0,
    noteInviate: 0,
    noteApprovate: 0,
    noteRifiutate: 0,
    noteLiquidate: 0,
    ultimeAttivita: [],
    andamentoMensile: [],
    statoNote: [
      { nome: "Bozza", valore: 0 },
      { nome: "Inviate", valore: 0 },
      { nome: "Approvate", valore: 0 },
      { nome: "Rifiutate", valore: 0 },
      { nome: "Liquidate", valore: 0 },
    ],
  });

  state = {
    dashboardAdmin: {
      periodo: "",
      dataDa: "",
      dataA: "",
      gareTotali: 0,
      noteTotali: 0,
      noteInviate: 0,
      noteApprovate: 0,
      noteRifiutate: 0,
      noteLiquidate: 0,
      ultimeAttivita: [],
      andamentoMensile: [],
      statoNote: [
        { nome: "Bozza", valore: 0 },
        { nome: "Inviate", valore: 0 },
        { nome: "Approvate", valore: 0 },
        { nome: "Rifiutate", valore: 0 },
        { nome: "Liquidate", valore: 0 },
      ],
    },

    dashboardUtente: {
      periodo: "",
      dataDa: "",
      dataA: "",
      gareTotali: 0,
      noteTotali: 0,
      noteInviate: 0,
      noteApprovate: 0,
      noteRifiutate: 0,
      noteLiquidate: 0,
      ultimeAttivita: [],
      andamentoMensile: [],
      statoNote: [
        { nome: "Bozza", valore: 0 },
        { nome: "Inviate", valore: 0 },
        { nome: "Approvate", valore: 0 },
        { nome: "Rifiutate", valore: 0 },
        { nome: "Liquidate", valore: 0 },
      ],
    },

    dataDa: "",
    dataA: "",

    caricamentoDashboard: true,
    erroreDashboard: "",
  };

  componentDidMount() {
    this.setState(
      {
        dataDa: this.getCurrentYearStart(),
        dataA: this.getToday(),
      },
      () => this.caricaDashboard(),
    );
  }

  normalizzaDashboard = (payload) => {
    const dati = payload?.data || payload || {};
    const fallback = this.getEmptyDashboard();

    return {
      periodo: dati.periodo || fallback.periodo,
      dataDa: dati.dataDa || fallback.dataDa,
      dataA: dati.dataA || fallback.dataA,
      gareTotali: parseInt(dati.gareTotali || 0, 10),
      noteTotali: parseInt(dati.noteTotali || 0, 10),
      noteInviate: parseInt(dati.noteInviate || 0, 10),
      noteApprovate: parseInt(dati.noteApprovate || 0, 10),
      noteRifiutate: parseInt(dati.noteRifiutate || 0, 10),
      noteLiquidate: parseInt(dati.noteLiquidate || 0, 10),
      ultimeAttivita: Array.isArray(dati.ultimeAttivita)
        ? dati.ultimeAttivita
        : fallback.ultimeAttivita,
      andamentoMensile: Array.isArray(dati.andamentoMensile)
        ? dati.andamentoMensile
        : fallback.andamentoMensile,
      statoNote: Array.isArray(dati.statoNote)
        ? dati.statoNote
        : fallback.statoNote,
    };
  };

  caricaDashboard = async () => {
    const urlApi = process.env.REACT_APP_API_URL;
    const isAdmin = this.utilityCrono.defineIfIsAdministrator();

    this.setState({
      caricamentoDashboard: true,
      erroreDashboard: "",
    });

    try {
      if (isAdmin) {
        const response = await axios.get(urlApi + "/home/dashboard_admin.php", {
          withCredentials: true,
          params: {
            data_da: this.state.dataDa,
            data_a: this.state.dataA,
          },
        });

        this.setState({
          dashboardAdmin: this.normalizzaDashboard(response.data),
          caricamentoDashboard: false,
        });
      } else {
        const response = await axios.post(
          urlApi + "/home/dashboard_utente.php",
          JSON.stringify({
            id: sessionStorage["ID"],
            data_da: this.state.dataDa,
            data_a: this.state.dataA,
          }),
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        this.setState({
          dashboardUtente: this.normalizzaDashboard(response.data),
          caricamentoDashboard: false,
        });
      }
    } catch (error) {
      console.log("Errore caricamento dashboard:", error);

      let messaggio = isAdmin
        ? "Errore caricamento dashboard admin."
        : "Errore caricamento dashboard utente.";

      if (error.response && error.response.data) {
        if (error.response.data.message) {
          messaggio = error.response.data.message;
        } else if (error.response.data.error) {
          messaggio = error.response.data.error;
        }
      }

      this.setState({
        caricamentoDashboard: false,
        erroreDashboard: messaggio,
      });
    }
  };

  handleChangePeriodo = (field, value) => {
    this.setState({ [field]: value });
  };

  avviaRicerca = () => {
    let { dataDa, dataA } = this.state;

    if (!dataDa || !dataA) {
      this.setState({
        erroreDashboard: "Seleziona entrambe le date del periodo.",
      });
      return;
    }

    if (dataA < dataDa) {
      [dataDa, dataA] = [dataA, dataDa];
      this.setState({ dataDa, dataA }, () => this.caricaDashboard());
      return;
    }

    this.caricaDashboard();
  };

  getCardSX = () => ({
    p: 2.2,
    borderRadius: "20px",
    border: "1px solid #eaecf0",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: "0 6px 18px rgba(16,24,40,0.07)",
    height: "100%",
  });

  getSectionTitle = (titolo, sottotitolo = "", icona = null) => {
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icona && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "12px",
                backgroundColor: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3949ab",
                flexShrink: 0,
              }}
            >
              {icona}
            </Box>
          )}

          <Box>
            <Box
              sx={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#101828",
              }}
            >
              {titolo}
            </Box>

            {sottotitolo && (
              <Box
                sx={{
                  fontSize: "0.88rem",
                  color: "#667085",
                  mt: 0.35,
                }}
              >
                {sottotitolo}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  getFiltroPeriodoCard = () => {
    return (
      <Paper elevation={0} sx={this.getCardSX()}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "14px",
              backgroundColor: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3949ab",
            }}
          >
            <CalendarMonthIcon />
          </Box>

          <Box>
            <Box sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#101828" }}>
              Filtro periodo
            </Box>
            <Box sx={{ fontSize: "0.9rem", color: "#667085" }}>
              Seleziona l’intervallo temporale da analizzare
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              label="Dal"
              type="date"
              fullWidth
              value={this.state.dataDa}
              onChange={(e) =>
                this.handleChangePeriodo("dataDa", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Al"
              type="date"
              fullWidth
              value={this.state.dataA}
              onChange={(e) =>
                this.handleChangePeriodo("dataA", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={this.avviaRicerca}
              startIcon={<SearchIcon />}
              sx={{
                height: "56px",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Avvia ricerca
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  getPeriodoCard = (periodo, isAdmin) => {
    return (
      <Paper elevation={0} sx={this.getCardSX()}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "14px",
              backgroundColor: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3949ab",
            }}
          >
            <CalendarMonthIcon />
          </Box>

          <Box>
            <Box sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#101828" }}>
              {isAdmin ? "Dashboard amministratore" : "Dashboard utente"}
            </Box>
            <Box sx={{ fontSize: "0.9rem", color: "#667085" }}>
              Riepilogo statistico del periodo selezionato
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            icon={<CalendarMonthIcon />}
            label={periodo}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#f2f4f7",
              color: "#344054",
              fontWeight: 600,
            }}
          />

          <Chip
            icon={
              this.utilityCrono.defineIfIsAdministrator() ? (
                <TrendingUpIcon />
              ) : (
                <PersonIcon />
              )
            }
            label={isAdmin ? "Vista globale" : "Vista personale"}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#eef2ff",
              color: "#3949ab",
              fontWeight: 600,
            }}
          />
        </Box>
      </Paper>
    );
  };

  getKpiCard = ({
    titolo,
    valore,
    icona,
    coloreIcona = "#3949ab",
    sfondoIcona = "#eef2ff",
    chip,
  }) => {
    return (
      <Paper elevation={0} sx={this.getCardSX()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            minHeight: "145px",
          }}
        >
          <Box>
            <Box
              sx={{
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "#667085",
                mb: 1.2,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {titolo}
            </Box>

            <Box
              sx={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#101828",
                lineHeight: 1.05,
              }}
            >
              {valore}
            </Box>

            {chip && (
              <Box sx={{ mt: 1.8 }}>
                <Chip
                  label={chip}
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "#f2f4f7",
                    color: "#344054",
                    fontWeight: 600,
                    fontSize: "0.80rem",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              backgroundColor: sfondoIcona,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: coloreIcona,
              flexShrink: 0,
            }}
          >
            {icona}
          </Box>
        </Box>
      </Paper>
    );
  };

  getChartCard = (titolo, sottotitolo, children, minHeight = 390) => {
    return (
      <Paper
        elevation={0}
        sx={{
          ...this.getCardSX(),
          minHeight,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <InsightsIcon sx={{ color: "#3949ab", fontSize: 22 }} />
          <Box sx={{ fontSize: "1.05rem", fontWeight: 700, color: "#101828" }}>
            {titolo}
          </Box>
        </Box>

        {sottotitolo && (
          <Box sx={{ fontSize: "0.88rem", color: "#667085", mb: 2 }}>
            {sottotitolo}
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            height: minHeight - 95,
            pt: 1,
          }}
        >
          {children}
        </Box>
      </Paper>
    );
  };

  getActivityCard = (titolo, elenco) => {
    return (
      <Paper elevation={0} sx={{ ...this.getCardSX(), minHeight: 260 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <UpdateIcon sx={{ color: "#3949ab", fontSize: 22 }} />
          <Box
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#101828",
            }}
          >
            {titolo}
          </Box>
        </Box>

        {elenco && elenco.length > 0 ? (
          elenco.map((item, index) => (
            <Box key={item.id || index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  py: 1.15,
                }}
              >
                <Box sx={{ fontSize: "0.92rem", color: "#101828" }}>
                  {item.testo}
                </Box>

                <Box
                  sx={{
                    fontSize: "0.82rem",
                    color: "#667085",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {item.data}
                </Box>
              </Box>

              {index < elenco.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <Box sx={{ color: "#667085", fontSize: "0.9rem" }}>
            Nessuna attività recente
          </Box>
        )}
      </Paper>
    );
  };

  renderDashboard = (dati, isAdmin) => {
    const pieColors = {
      Bozza: "#f59e0b",
      Inviate: "#3b82f6",
      Approvate: "#22c55e",
      Rifiutate: "#ef4444",
      Liquidate: "#8b5cf6",
    };

    return (
      <Grid container spacing={2.4}>
        <Grid size={7} item xs={12}>
          {this.getFiltroPeriodoCard()}
        </Grid>

        <Grid size={5} item xs={12}>
          {this.getPeriodoCard(dati.periodo, isAdmin)}
        </Grid>

        <Grid size={12} item xs={12} sx={{ mt: 1 }}>
          {this.getActivityCard(
            isAdmin ? "Ultime attività" : "Le mie ultime attività",
            dati.ultimeAttivita,
          )}
        </Grid>

        <Grid size={12} item xs={12} sx={{ mt: 2.5 }}>
          {this.getSectionTitle(
            "Statistiche principali",
            "Indicatori sintetici relativi al periodo selezionato",
            <QueryStatsIcon sx={{ fontSize: 20 }} />,
          )}
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
                xl: "repeat(6, 1fr)",
              },
              gap: 2.2,
            }}
          >
            {this.getKpiCard({
              titolo: isAdmin ? "Gare nel periodo" : "Le mie gare",
              valore: dati.gareTotali,
              icona: <EmojiEventsIcon />,
              coloreIcona: "#3949ab",
              sfondoIcona: "#eef2ff",
              chip: isAdmin ? "Totale gare" : "Partecipazioni",
            })}

            {this.getKpiCard({
              titolo: isAdmin ? "Note spesa totali" : "Le mie note spesa",
              valore: dati.noteTotali,
              icona: <ReceiptLongIcon />,
              coloreIcona: "#1e88e5",
              sfondoIcona: "#eaf2fd",
              chip: isAdmin ? "Inserite nel periodo" : "Totale inserite",
            })}

            {this.getKpiCard({
              titolo: "Note inviate",
              valore: dati.noteInviate,
              icona: <SendIcon />,
              coloreIcona: "#b26a00",
              sfondoIcona: "#fff4e5",
              chip: isAdmin ? "Da verificare" : "In lavorazione",
            })}

            {this.getKpiCard({
              titolo: "Note approvate",
              valore: dati.noteApprovate,
              icona: <DoneAllIcon />,
              coloreIcona: "#1f7a36",
              sfondoIcona: "#e8f7ed",
              chip: "Confermate",
            })}

            {this.getKpiCard({
              titolo: "Note rifiutate",
              valore: dati.noteRifiutate,
              icona: <ClearIcon />,
              coloreIcona: "#c62828",
              sfondoIcona: "#fdecec",
              chip: "Respinte",
            })}

            {this.getKpiCard({
              titolo: "Note liquidate",
              valore: dati.noteLiquidate,
              icona: <PaymentsIcon />,
              coloreIcona: "#7b1fa2",
              sfondoIcona: "#f3e8ff",
              chip: "Pagate",
            })}
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          {this.getSectionTitle(
            "Analisi grafica",
            "Distribuzione e andamento dei dati gestionali",
            <InsightsIcon sx={{ fontSize: 20 }} />,
          )}
        </Grid>

        <Grid size={{ md: 12 }}>
          <Grid container spacing={2.4}>
            <Grid size={{ md: 4 }}>
              {this.getChartCard(
                "Andamento del periodo",
                "Confronto tra numero di gare e note spesa",
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dati.andamentoMensile}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="mese"
                      tick={{ fill: "#475467", fontSize: 13 }}
                    />
                    <YAxis tick={{ fill: "#475467", fontSize: 13 }} />
                    <ReTooltip />
                    <Legend />
                    <Bar
                      dataKey="gare"
                      name="Gare"
                      fill="#4f46e5"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="note"
                      name="Note spesa"
                      fill="#22c55e"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>,
                420,
              )}
            </Grid>

            <Grid size={{ md: 4 }}>
              {this.getChartCard(
                "Stato note spesa",
                "Distribuzione per stato",
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dati.statoNote}
                      dataKey="valore"
                      nameKey="nome"
                      cx="50%"
                      cy="48%"
                      outerRadius={120}
                      innerRadius={58}
                      paddingAngle={3}
                      label
                    >
                      {dati.statoNote.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[entry.nome] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>,
                420,
              )}
            </Grid>

            <Grid size={{ md: 4 }}>
              {this.getChartCard(
                "Trend sintetico",
                "Evoluzione mensile delle note spesa",
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dati.andamentoMensile}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="mese"
                      tick={{ fill: "#475467", fontSize: 13 }}
                    />
                    <YAxis tick={{ fill: "#475467", fontSize: 13 }} />
                    <ReTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="note"
                      name="Note spesa"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>,
                390,
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const isAdmin = this.utilityCrono.defineIfIsAdministrator();
    const dati = isAdmin
      ? this.state.dashboardAdmin
      : this.state.dashboardUtente;

    return (
      <div className="container">
        <div className="row rowNiko">
          <div className="col-12">
            <Box sx={{ margin: "15px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  mb: 2.2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    backgroundColor: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3949ab",
                  }}
                >
                  <QueryStatsIcon />
                </Box>

                <Box>
                  <Box
                    sx={{
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      color: "#101828",
                    }}
                  >
                    Home
                  </Box>
                  <Box
                    sx={{
                      fontSize: "0.92rem",
                      color: "#667085",
                    }}
                  >
                    Panoramica generale di gare e note spesa
                  </Box>
                </Box>
              </Box>

              {this.state.caricamentoDashboard ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 220,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : this.state.erroreDashboard ? (
                <Alert severity="error">{this.state.erroreDashboard}</Alert>
              ) : (
                this.renderDashboard(dati, isAdmin)
              )}
            </Box>
          </div>
        </div>
      </div>
    );
  }
}
