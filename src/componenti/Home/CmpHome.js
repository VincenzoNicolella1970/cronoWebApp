import React, { Component } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

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

  state = {
    dashboardAdmin: {
      periodo: "01/01/2026 - 20/03/2026",
      gareTotali: 28,
      noteTotali: 54,
      noteInviate: 18,
      noteApprovate: 21,
      noteLiquidate: 9,
      ultimeAttivita: [
        {
          id: 1,
          testo: 'Creata gara "Campionato Regionale Slalom"',
          data: "18/03/2026",
        },
        {
          id: 2,
          testo: "Nota spesa inviata da Mario Rossi",
          data: "18/03/2026",
        },
        {
          id: 3,
          testo: "Nota spesa approvata per Gara Jafferau",
          data: "17/03/2026",
        },
        {
          id: 4,
          testo: "Liquidata nota spesa #NS0024",
          data: "15/03/2026",
        },
      ],
      andamentoMensile: [
        { mese: "Gen", gare: 8, note: 14 },
        { mese: "Feb", gare: 11, note: 19 },
        { mese: "Mar", gare: 9, note: 21 },
      ],
      statoNote: [
        { nome: "Bozza", valore: 6 },
        { nome: "Inviate", valore: 18 },
        { nome: "Approvate", valore: 21 },
        { nome: "Liquidate", valore: 9 },
      ],
    },

    dashboardUtente: {
      periodo: "01/01/2026 - 20/03/2026",
      gareTotali: 6,
      noteTotali: 5,
      noteInviate: 2,
      noteApprovate: 2,
      noteLiquidate: 1,
      ultimeAttivita: [
        {
          id: 1,
          testo: 'Hai partecipato alla gara "Trofeo Piemonte"',
          data: "16/03/2026",
        },
        {
          id: 2,
          testo: "Hai inviato una nota spesa",
          data: "14/03/2026",
        },
        {
          id: 3,
          testo: "La tua nota spesa è stata approvata",
          data: "12/03/2026",
        },
      ],
      andamentoMensile: [
        { mese: "Gen", gare: 2, note: 1 },
        { mese: "Feb", gare: 1, note: 2 },
        { mese: "Mar", gare: 3, note: 2 },
      ],
      statoNote: [
        { nome: "Bozza", valore: 0 },
        { nome: "Inviate", valore: 2 },
        { nome: "Approvate", valore: 2 },
        { nome: "Liquidate", valore: 1 },
      ],
    },
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
            icon={isAdmin ? <TrendingUpIcon /> : <PersonIcon />}
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
      Liquidate: "#8b5cf6",
    };

    return (
      <Grid container spacing={2.4}>
        <Grid item xs={12}>
          {this.getPeriodoCard(dati.periodo, isAdmin)}
        </Grid>

        <Grid item xs={12} sx={{ mt: 1 }}>
          {this.getActivityCard(
            isAdmin ? "Ultime attività" : "Le mie ultime attività",
            dati.ultimeAttivita,
          )}
        </Grid>

        <Grid item xs={12} sx={{ mt: 2.5 }}>
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
                xl: "repeat(5, 1fr)",
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
              {/* <Grid item xs={12} md={8} lg={4}> */}
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

              {this.renderDashboard(dati, isAdmin)}
            </Box>
          </div>
        </div>
      </div>
    );
  }
}
