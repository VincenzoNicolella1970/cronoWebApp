import React from "react";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";

export default function CmpAllegatoViewer({
  idNotaSpesa,
  numeroAllegato,
  nomeFile,
}) {
  const urlApi = process.env.REACT_APP_API_URL;
  const fileUrl = `${urlApi}/nota_spesa/view_allegato.php?id=${idNotaSpesa}&n=${numeroAllegato}`;

  const ext = (nomeFile || "").toLowerCase().split(".").pop();

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <b>{nomeFile || `Allegato ${numeroAllegato}`}</b>
        </div>

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button size="small" variant="outlined">
            <VisibilityIcon fontSize="small" />
            &nbsp;Apri
          </Button>
        </a>
      </div>

      {["png", "jpg", "jpeg", "webp"].includes(ext) && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          <img
            src={fileUrl}
            alt={nomeFile}
            style={{
              maxWidth: "100%",
              maxHeight: "350px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      )}

      {ext === "pdf" && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <iframe
            src={fileUrl}
            title={nomeFile}
            width="100%"
            height="420px"
            style={{ border: "none" }}
          />
        </div>
      )}

      {!["png", "jpg", "jpeg", "webp", "pdf"].includes(ext) && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <DescriptionIcon />
          <div>Anteprima non disponibile per questo tipo di file.</div>
        </div>
      )}
    </div>
  );
}
