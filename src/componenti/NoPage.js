import React, { Component } from "react";
import Link from "@mui/material/Link";
export default class NoPage extends Component {
  render() {
    return (
      <>
        <div>ATTENZIONE</div>
        <div>
          Per accedere a questa risorsa è necessario effettuare l'accesso!!
        </div>
        <br />
        <Link href={process.env.PUBLIC_URL + "/Login"}>Login</Link>
        <br />
        {process.env.NODE_ENV === "development" && (
          <Link href={process.env.PUBLIC_URL + "/LoginDev"}>
            Login Development
          </Link>
        )}
      </>
    );
  }
}
