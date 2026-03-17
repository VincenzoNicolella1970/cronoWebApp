import React, { useContext, Component } from "react";

import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";

import IconButton from "@mui/material/IconButton";

import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ClearIcon from "@mui/icons-material/Clear";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

import { AuthContext } from "./OAuth/AuthProvider";
// import utilityAVIS from "./utility/utilityAVIS";

const myIconButtonBar = {
  color: "var(--colHeaderNavBar)",
  border: "1px solid",
  borderColor: "var(--colHeaderNavBar)",
  margin: "2px",
};
// const context = {
//   ruolo: "ADMIN",
//   ID: 100,
// };
export default class NavBarraMenu_AVIS extends Component {
  static contextType = AuthContext;
  //utilityAVIS = new utilityAVIS();

  state = {
    switchShowMenu: false,
    openDialog: false,
  };

  switchShowMenu = (evt) => {
    let show = !this.state.switchShowMenu;
    this.setState({
      switchShowMenu: show,
    });
  };

  logout = () => {
    const { logOut } = this.context;
    console.log("Context::", this.context);
    logOut();
  };

  chiudiDialog = () => {
    this.setState({
      openDialog: false,
    });
  };

  registraAccessoFunzionalita = (testoOperazione) => {
    this.utilityAVIS.scriviNelLog(
      this.context.ID,
      this.context.user,
      testoOperazione,
      "OK",
    );
  };

  render() {
    return (
      <Navbar
        fixed="left"
        //bg="light"
        expand="true"
        className="bg-body-tertiary-niko navbar-principale"
      >
        <Container
          fluid
          style={{
            //display: "flex",
            justifyContent: "flex-start",
            flexWrap: "nowrap",
          }}
        >
          <Navbar.Toggle
            // as="div"
            className="navbar-Toggle-niko"
            // className='navbar-Toggle-niko'
            aria-controls="offcanvasNavbar"
            onClick={(evt) => {
              this.switchShowMenu(evt);
            }}
          >
            <MenuIcon />
          </Navbar.Toggle>

          <Navbar.Brand
            style={{ paddingLeft: "10px", width: "100%" }}
            // onClick={(evt) => {
            //   this.switchShowMenu(evt);
            // }}
          >
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-6">
                  <img
                    style={{ float: "left" }}
                    src={process.env.PUBLIC_URL + "/Logo.png"} // percorso immagine nella cartella public
                    width="100px"
                    height="100px"
                    className="d-inline-block align-top"
                    alt="Logo ADS"
                  />
                  <div className="row">
                    <div className="col-12">
                      <h4
                        style={{
                          float: "left",
                          color: "var(--colHeaderNavBar)",
                        }}
                      >
                        {" "}
                        <b>A</b>ssociazione <b>S</b>portiva <b>D</b>
                        ilettantistica
                      </h4>
                      <br></br>
                    </div>
                    <div className="col-12">
                      <h3
                        style={{
                          float: "left",
                          color: "var(--colHeaderNavBar)",
                          fontStyle: "italic",
                        }}
                      >
                        {" "}
                        Cronometristi Frosinone
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <div className="col-12 align-self-top">
                          <IconButton
                            title="Home"
                            href={process.env.PUBLIC_URL + "/"}
                            style={myIconButtonBar}
                            size="medium"
                          >
                            <HomeFilledIcon />
                          </IconButton>
                          <IconButton
                            title="Donatori"
                            href={process.env.PUBLIC_URL + "/GestioneDonatori"}
                            style={myIconButtonBar}
                            size="medium"
                          >
                            <Diversity1Icon />
                          </IconButton>
                          <IconButton
                            title="Raccolta Sangue"
                            href={process.env.PUBLIC_URL + "/GestioneDonazioni"}
                            style={myIconButtonBar}
                            size="medium"
                          >
                            <BloodtypeIcon />
                          </IconButton>
                          {this.context.ruolo === "ADMIN" && (
                            <IconButton
                              onClick={(evt) => {
                                this.registraAccessoFunzionalita(
                                  "Accesso Invio Messaggi",
                                );
                              }}
                              title="Invio Messaggi"
                              href={
                                process.env.PUBLIC_URL +
                                "/GestioneInvioMessaggi"
                              }
                              style={myIconButtonBar}
                              size="medium"
                            >
                              <WhatsAppIcon />
                            </IconButton>
                          )}
                        </div>
                        <div className="col-12 align-self-top">
                          <IconButton
                            title="Contributi Volontari"
                            href={
                              process.env.PUBLIC_URL +
                              "/GestioneContributiVolontari"
                            }
                            style={myIconButtonBar}
                            size="medium"
                          >
                            <PointOfSaleIcon />
                          </IconButton>
                          <IconButton
                            title="CTO"
                            href={process.env.PUBLIC_URL + "/GestioneCTO"}
                            style={myIconButtonBar}
                            size="medium"
                          >
                            <VaccinesIcon />
                          </IconButton>
                          <IconButton
                            title="HelpDesk"
                            href={process.env.PUBLIC_URL + "/CmpHelpDesk"}
                            style={myIconButtonBar}
                            size="medium"
                          >
                            <QuestionMarkIcon />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-6 align-self-center"
                      style={{
                        float: "right",
                        fontSize: "16px",
                        color: "var(--colHeaderNavBar)",
                      }}
                    >
                      <Button
                        onClick={(evt) => {
                          this.setState({ openDialog: true });
                        }}
                        variant="contained"
                        title="Info Utente"
                      >
                        <AccountCircleIcon />
                      </Button>
                      {/* </div>
                                        <div className='col-4 align-self-center'> */}
                      <Button
                        //fullWidth
                        title="Esci"
                        variant="contained"
                        onClick={(evt) => {
                          this.logout();
                        }}
                        style={{ float: "right" }}
                      >
                        <LogoutIcon />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Navbar.Brand>

          <Dialog
            fullWidth="true"
            //maxWidth="lg"
            disableBackdropClick
            disableEscapeKeyDown
            open={this.state.openDialog}
            onClose={this.chiudiDialog}
          >
            <DialogContent>
              <div className="container">
                <div className="row">
                  <div className="col-4">
                    <img
                      alt=""
                      src="User2.png"
                      style={{ width: "100%", marginBottom: "10px" }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="row">
                      USER ID : {this.context.ID.toString()}
                    </div>
                    <div className="row">USER : {this.context.user}</div>
                    <div className="row">RUOLO : {this.context.ruolo}</div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                className="styleButton"
                //sx={this.props.myButtonsx}
                onClick={(evt) => {
                  this.chiudiDialog();
                }}
              >
                <ClearIcon /> Chiudi
              </Button>
            </DialogActions>
          </Dialog>

          {/* <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/Home">Home</Nav.Link>
                            <Nav.Link href="/AnagraficaDonatore">Donatori</Nav.Link>
                            <Nav.Link href="/GestioneDonazioni">Donazioni Sangue</Nav.Link>
                        </Nav>
                    </Navbar.Collapse> */}

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            show={this.state.switchShowMenu}
            style={{
              backgroundColor: "#ffffff", //"#ff0000ff",
              color: "var(--colHeaderNavBar)",
            }}
          >
            <Offcanvas.Header
              onClick={(evt) => {
                this.switchShowMenu(evt);
              }}
              style={{
                backgroundColor: "var(--colHeaderNavBar)",
                color: "#ffffff",
                // borderStyle:"solid",
                // borderBottomColor: "#f03607ff",
                // borderBottomStyle: "solid",
                // borderBottomWidth: "1px"
              }}
              closeButton
            >
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <img
                  style={{ float: "left" }}
                  src={process.env.PUBLIC_URL + "/Logo.png"} // percorso immagine nella cartella public
                  width="50px"
                  height="50px"
                  className="d-inline-block align-top"
                  alt="Avis"
                />
                &nbsp; Menu
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3 ">
                <Nav.Link
                  className="nkLink"
                  href={process.env.PUBLIC_URL + "/"}
                >
                  &nbsp;
                  <HomeFilledIcon />
                  &nbsp;Home
                </Nav.Link>
                <Nav.Link
                  className="nkLink"
                  href={process.env.PUBLIC_URL + "/GestioneDonatori"}
                >
                  &nbsp;
                  <Diversity1Icon />
                  &nbsp;Donatori
                </Nav.Link>
                <Nav.Link
                  className="nkLink"
                  href={process.env.PUBLIC_URL + "/GestioneDonazioni"}
                >
                  &nbsp;
                  <BloodtypeIcon />
                  &nbsp;Raccolta Sangue
                </Nav.Link>
                {(this.context.ruolo === "ADMIN" ||
                  this.context.ruolo === "SUPER") && (
                  <>
                    <Nav.Link
                      onClick={(evt) => {
                        this.registraAccessoFunzionalita(
                          "Accesso Invio Messaggi",
                        );
                      }}
                      className="nkLink"
                      href={process.env.PUBLIC_URL + "/GestioneInvioMessaggi"}
                    >
                      &nbsp;
                      <WhatsAppIcon />
                      &nbsp;Invio Messaggi
                    </Nav.Link>
                  </>
                )}
                <Nav.Link
                  className="nkLink"
                  href={process.env.PUBLIC_URL + "/GestioneContributiVolontari"}
                >
                  &nbsp;
                  <PointOfSaleIcon />
                  &nbsp;Contributi Volontari
                </Nav.Link>
                <Nav.Link
                  className="nkLink"
                  href={process.env.PUBLIC_URL + "/GestioneCTO"}
                >
                  &nbsp;
                  <VaccinesIcon />
                  &nbsp;CTO
                </Nav.Link>
                {this.context.ruolo === "SUPER" && (
                  <>
                    <Nav.Link
                      className="nkLink"
                      href={process.env.PUBLIC_URL + "/GestioneLogs"}
                    >
                      <FormatListNumberedIcon />
                      &nbsp;Logs
                    </Nav.Link>
                  </>
                )}
                <Nav.Link
                  className="nkLink"
                  href={process.env.PUBLIC_URL + "/CmpHelpDesk"}
                >
                  <QuestionMarkIcon />
                  &nbsp;HelpDesk
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}
