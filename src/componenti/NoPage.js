import React, { Component } from "react";
import Link from "@mui/material/Link";
import { AuthContext } from "./OAuth/AuthProvider";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
export default class NoPage extends Component {
  static contextType = AuthContext;
  state = { keyLogin: "" };
  inputStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "10px",
    boxShadow: "none",
    minHeight: "42px",
  };
  returnSectionLoginDev = () => {
    return (
      <>
        {/* <Link href={process.env.PUBLIC_URL + "/LoginDev"}>
          Login Development
        </Link> */}
        <div className="container">
          <div className="row">
            <div className="col-6">
              <Form.Select
                size="sm"
                value={this.state.keyLogin}
                onChange={(e) => {
                  this.setState({ keyLogin: e.target.value });
                }}
                style={this.inputStyle}
              >
                <option key="" value="">
                  Seleziona un utente.....
                </option>
                <option key="new_admin_vincenzo" value="new_admin_vincenzo">
                  Vincenzo
                </option>
                <option key="new_admin_lorenzo" value="new_admin_lorenzo">
                  Lorenzo
                </option>
                <option key="new_socio_mariorossi" value="new_socio_mariorossi">
                  Mario Rossi
                </option>
              </Form.Select>
            </div>
            <div className="col-6">
              <Button onClick={(evt) => this.accediAdmin()}>Accedi</Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  accediAdmin = (evt) => {
    const { loginActionBackEnd } = this.context;
    if (this.state.keyLogin != "") loginActionBackEnd(this.state.keyLogin);
  };

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
        <br />
        <br />
        {process.env.NODE_ENV === "development" && this.returnSectionLoginDev()}
      </>
    );
  }
}
