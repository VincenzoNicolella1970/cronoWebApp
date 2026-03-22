import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBarraMenu from "./componenti/NavBarraMenu";
import NoPage from "./componenti/NoPage";

import OAuthCallback from "./componenti/OAuth/OAuthCallback";

import { useAuth } from "./componenti/OAuth/AuthProvider";

import { Routes, Route } from "react-router-dom";

import CmpHome from "./componenti/Home/CmpHome";
import CmpHelpDesk from "./componenti/HelpDesk/CmpHelpDesk";
import CmpAttivita from "./componenti/Attivita/CmpAttivita";
import CmpGare from "./componenti/Gare/CmpGare";
import CmpNotaSpese from "./componenti/NotaSpese/CmpNotaSpese";

import CmpLoginDevelopment from "./componenti/OAuth/CmpLoginDevelopment";
import CmpNoteSpeseUtenti from "./componenti/NoteSpeseUtenti/CmpNoteSpeseUtenti";
import CmpDiscipline from "./componenti/Discipline/CmpDiscipline";
import CmpManifestazioni from "./componenti/Discipline/CmpManifestazioni";
import CmpDisciplineManifestazioni from "./componenti/Discipline/CmpDisciplineManifestazioni";
function App() {
  const { ruolo } = useAuth();

  //const context = AuthContext;

  // sessionStorage.setItem("ID", "001");
  // sessionStorage.setItem("user", "Vincenzo");
  // sessionStorage.setItem("ruolo", "Administrator");

  return (
    <div className="App stylePageComponent">
      <Routes>
        {process.env.NODE_ENV === "development" && (
          <Route path="/LoginDev" element={<CmpLoginDevelopment />} />
        )}
        <Route path="/oauthwp" element={<OAuthCallback />} />
        {sessionStorage["user"] && (
          <>
            <Route
              path="/"
              element={
                <>
                  <NavBarraMenu />
                  <CmpHome />
                </>
              }
            />
            <Route
              path="/Home"
              element={
                <>
                  <NavBarraMenu />
                  <CmpHome />
                </>
              }
            />
            <Route
              path="/Attivita"
              element={
                <>
                  <NavBarraMenu />
                  <CmpAttivita />
                </>
              }
            />
            {ruolo === "administrator" && (
              <>
                <Route
                  path="/NoteSpeseUtenti"
                  element={
                    <>
                      <NavBarraMenu />
                      <CmpNoteSpeseUtenti />
                    </>
                  }
                />
                <Route
                  path="/Discipline"
                  element={
                    <>
                      <NavBarraMenu />
                      <CmpDisciplineManifestazioni />
                    </>
                  }
                />

                {/* <Route
                  path="/Discipline"
                  element={
                    <>
                      <NavBarraMenu />
                      <CmpDiscipline />
                    </>
                  }
                />
                <Route
                  path="/Manifestazioni"
                  element={
                    <>
                      <NavBarraMenu />
                      <CmpManifestazioni />
                    </>
                  }
                /> */}
              </>
            )}
            <Route
              path="/Gare"
              element={
                <>
                  <NavBarraMenu />
                  <CmpGare />
                </>
              }
            />{" "}
            <Route
              path="/NotaSpese"
              element={
                <>
                  <NavBarraMenu />
                  <CmpNotaSpese />
                </>
              }
            />
            <Route
              path="/HelpDesk"
              element={
                <>
                  <NavBarraMenu />
                  <CmpHelpDesk />
                </>
              }
            />
          </>
        )}
        <Route path="*" element={<NoPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
