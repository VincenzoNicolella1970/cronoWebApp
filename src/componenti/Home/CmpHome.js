import React, { Component } from "react";
import Typography from "@mui/material/Typography";
export default class CmpHome extends Component {
  render() {
    return (
      <>
        <div className="stylePageComponent">
          <Typography
            variant="body1"
            sx={{
              margin: "15px",
              backgroundColor: "var(--colHeaderNavBar)",
              color: "white",
              borderRadius: "4px",
            }}
          >
            HOME
          </Typography>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6">Report generici di numero di gare</div>
            <div className="col-6">
              Report generici per numero di gare suddivise per sport
            </div>
          </div>
        </div>
      </>
    );
  }
}
