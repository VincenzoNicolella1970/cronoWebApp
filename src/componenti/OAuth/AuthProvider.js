import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [ID, setID] = useState(sessionStorage.getItem("ID") || null);
  const [user, setUser] = useState(sessionStorage.getItem("user") || null);
  const [ruolo, setRuolo] = useState(sessionStorage.getItem("ruolo") || null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const navigate = useNavigate();

  const loginActionPost = async (data) => {
    try {
      const response = await fetch("your-api-endpoint/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.data) {
        setID(res.data.id);
        setUser(res.data.user);
        setRuolo(res.data.ruolo);
        setToken(res.data.token);
        sessionStorage.setItem("site", res.data.token);
        //navigate(process.env.PUBLIC_URL + "/Home");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const synUtenteIntoDB = async (data) => {
    try {
      const urlApi = process.env.REACT_APP_API_URL;
      const response = await fetch(urlApi + "/utenti/syncutentedb.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const data = await response.json();
      //debugger;
      if (data.ok && data.user) {
        setID(data.user.id_utente);
        setUser(data.user.username);
        setRuolo(data.user.ruolo_app);
        setToken("dev-session");

        sessionStorage.setItem("ID", data.user.id_utente);
        sessionStorage.setItem("user", data.user.username);
        sessionStorage.setItem("ruolo", data.user.ruolo_app);

        navigate(process.env.PUBLIC_URL + "/Home");
        return;
      }

      throw new Error(data.message || "Login non riuscito");
    } catch (err) {
      console.error(err);
    }
  };

  const loginActionBackEnd = async () => {
    try {
      const response = await fetch(
        "http://localhost:8001/utenti/auth-dev.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      //debugger;
      if (data.ok && data.user) {
        //debugger;
        setID(data.user.id_utente);
        setUser(data.user);
        setRuolo(data.user.ruolo);
        setToken("dev-session");

        sessionStorage.setItem("ID", data.user.id_utente);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("ruolo", data.user.ruolo);

        navigate(process.env.PUBLIC_URL + "/Home");
        return;
      }

      throw new Error(data.message || "Login non riuscito");
    } catch (err) {
      console.error(err);
    }
  };

  const loginAction = (data) => {
    try {
      if (data) {
        setID(data.id);
        setUser(data.user);
        setRuolo(data.ruolo);
        //setToken(data.token);
        sessionStorage.setItem("ID", data.id);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("ruolo", data.ruolo);
        //sessionStorage.setItem("token", data.token);
        //navigate(process.env.PUBLIC_URL + "/Home");
        return;
      }
      throw new Error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    try {
      const urlApi = process.env.REACT_APP_API_URL;

      fetch(urlApi + "/utenti/logout.php", {
        method: "POST",
        //credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Logout:: effettuato");
    } catch (err) {
      console.error("Errore logout server:", err);
      alert("Errore logout server:", err);
      return;
    }
    setID(null);
    setUser(null);
    setRuolo(null);
    setToken("");
    sessionStorage.removeItem("ID");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("ruolo");
    navigate(process.env.PUBLIC_URL + "/Login");
  };

  return (
    <AuthContext.Provider
      value={{
        ID,
        token,
        user,
        ruolo,
        loginAction,
        synUtenteIntoDB,
        loginActionBackEnd,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
