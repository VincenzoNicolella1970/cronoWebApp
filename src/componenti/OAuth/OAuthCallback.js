import React, { useContext, Component } from "react";

import { AuthContext } from "./AuthProvider";

export default class OAuthCallback extends Component {
  static contextType = AuthContext;

  state = {
    status: "working", // working | ok | error
    message: "Verifica credenziali ... attendere ... ",
  };

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      this.setState({
        status: "error",
        message: `Errore OAuth: ${error}${errorDescription ? " - " + errorDescription : ""}`,
      });
      return;
    }

    if (!code) {
      this.setState({ status: "error", message: "Codice mancante (code)." });
      return;
    }

    // ✅ Anti doppia esecuzione (StrictMode / refresh / back)
    const key = "oauth_code_used";
    if (sessionStorage.getItem(key) === code) {
      // Se vuoi, puoi direttamente rimandare alla home
      this.setState({
        status: "ok",
        message: "Accesso già elaborato. Reindirizzamento…",
      });
      //window.location.replace("/");
      return;
    }
    sessionStorage.setItem(key, code);

    const base = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
    const backendUrl = `${base}/oauthwp.php?code=${encodeURIComponent(code)}`;

    fetch(backendUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      // credentials: "include",
    })
      .then(async (res) => {
        const text = await res.text(); // <-- importantissimo per debug
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {}

        if (!res.ok) {
          // errore HTTP (401/400/500), mostra tutto
          throw new Error(
            data && (data.detail || data.error)
              ? JSON.stringify(data)
              : text || `HTTP ${res.status}`,
          );
        }

        // anche se HTTP 200, controlla il payload applicativo
        if (data && data.ok === false) {
          throw new Error(JSON.stringify(data));
        }

        return data;
      })
      .then((data) => {
        //Inserisco i dati all'interno della sessione o in context
        //sessionStorage["user"] = data.user;
        this.setState({
          status: "ok",
          message: "ACCESSO RIUSCITO... stiamo per autorizzarti...",
        });

        let input = {
          id: data.user.ID,
          email: data.user.email,
          user: data.user,
          ruolo: data.user.roles,
          //token: data.user.tkn,
        };
        console.log("Dati dal server::", input);

        //Registro l'utente nella sessione
        const { loginAction, synUtenteIntoDB, logOut } = this.context;
        if (process.env.NODE_ENV === "production") {
          loginAction(input);
        }
        //loginAction(input);

        // SOLO ORA redirect
        window.location.replace(process.env.PUBLIC_URL + "/");
      })
      .catch((e) => {
        this.setState({
          status: "error",
          message: "Scambio token fallito: " + (e?.message || "errore"),
        });
      });
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12">
              <img
                style={{ float: "center" }}
                src={process.env.PUBLIC_URL + "/Logo.png"} // percorso immagine nella cartella public
                width="150px"
                height="150px"
                className="d-inline-block align-top"
                alt="Logo ADS"
              />
            </div>
            <div className="col-12">
              <h2>Autorizzazione in corso</h2>
            </div>
            <div className="col-12">
              <p style={{ whiteSpace: "pre-wrap" }}>{this.state.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
