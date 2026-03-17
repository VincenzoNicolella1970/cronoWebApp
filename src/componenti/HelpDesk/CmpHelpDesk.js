import React, { Component } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";
import LanguageIcon from "@mui/icons-material/Language";
import InfoIcon from "@mui/icons-material/Info";
import "./style.css";

export default class HelpDeskContact extends Component {
  render() {
    return (
      <div className="page-wrapper">
        <div className="helpdesk-container">
          <h2 className="helpdesk-title">Contatta il nostro Help Desk </h2>
          <span className="helpdesk-item">
            I seguenti riferimenti sono fittizi e non attivi
          </span>

          <div className="helpdesk-item">
            <PhoneIcon className="helpdesk-icon" />
            <span className="helpdesk-text">+39 3476002955</span>
          </div>

          <div className="helpdesk-item">
            <WhatsAppIcon className="helpdesk-icon" />
            <span className="helpdesk-text">+39 3923492861</span>
          </div>

          <div className="helpdesk-item">
            <EmailIcon className="helpdesk-icon" />
            <span className="helpdesk-text">goffreydabuglione@gmail.com</span>
          </div>

          <div className="helpdesk-item">
            <PrintIcon className="helpdesk-icon" />
            <span className="helpdesk-text">+39 3923492861 (Fax)</span>
          </div>

          <div className="helpdesk-item">
            <AccessTimeIcon className="helpdesk-icon" />
            <span className="helpdesk-text">Lun - Ven: 9:00 - 18:00</span>
          </div>

          <div className="helpdesk-item">
            <LocationOnIcon className="helpdesk-icon" />
            <span className="helpdesk-text">
              Via Nessun civico, San Giovanni Incarico
            </span>
          </div>

          <div className="helpdesk-item">
            <LanguageIcon className="helpdesk-icon" />
            <a
              href="https://www.parrocchia.it"
              target="_blank"
              rel="noopener noreferrer"
              className="helpdesk-text link"
            >
              www.parrocchia.it
            </a>
          </div>
        </div>
      </div>
    );
  }
}
