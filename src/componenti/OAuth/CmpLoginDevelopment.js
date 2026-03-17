import React, { Component } from "react";
import { AuthContext } from "./AuthProvider";

export default class extends Component {
  static contextType = AuthContext;
  componentDidMount = () => {
    let caricaUtenteSviluppo = true;
    if (caricaUtenteSviluppo) {
      let input = {
        id: 100,
        email: "vincenzo.nicolella@virgilio.com",
        user: "Vincenzo",
        ruolo: "administrator",
        token: "",
      };

      input = {
        id: 200,
        email: "antonio.arduini@virgilio.com",
        user: "Antonio",
        ruolo: "socio",
        token: "",
      };

      const { loginAction, loginActionBackEnd } = this.context;
      loginActionBackEnd();
    }
  };
  render() {
    return <div></div>;
  }
}
