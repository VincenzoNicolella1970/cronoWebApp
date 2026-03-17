const styleIcon = { float: "left", marginTop: "2px" };

const styleLabelIcon = {
  fontSize: "12px",
  paddingLeft: "3px",
  paddingRight: "3px",
};

class utilityCrono {
  togliMUIXLicense = () => {
    let elements = document.getElementsByClassName("MuiDataGrid-main");
    //debugger;
    let keyParent;
    for (keyParent in elements) {
      let element = elements[keyParent];
      let keyChild;
      for (keyChild in element.children) {
        let child = element.children[keyChild];
        if (child.innerHTML && child.innerHTML.indexOf("MUI X Miss") != -1) {
          child.style.display = "none";
        }
      }
    }
  };

  defineIfIsAdministrator = () => {
    let admin = false;
    if (sessionStorage["ruolo"] == "administrator") admin = true;
    return admin;
  };

  returnUserInfo = () => {
    //debugger;
    let info = JSON.parse(sessionStorage.getItem("user"));
    return info;
  };

  returnSXDtaDrig = () => {
    return {
      "& .MuiDataGrid-columnHeader": {
        backgroundColor: "var(--colHeaderNavBar)",
        color: "white",
        height: "30px",
        fontSize: 14,
        fontWeight: "bolder",
        // fontFamily:'Roboto, sans-serif'
      },
      "& .MuiDataGrid-row": {
        backgroundColor: "#fafafa", // colore base righe
        fontFamily: "Roboto, sans-serif",
        //color:"red",
        //fontSize: '0.9rem',
        fontSize: 12,
      },
      "& .MuiDataGrid-row:hover": {
        backgroundColor: "#eed1c6ff", // colore quando passi sopra col mouse
      },
      "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: "#aed3ecff !important", // colore righe selezionate
      },
      "& .MuiDataGrid-cell": {
        borderRight: "0px solid rgba(224,224,224,1)", // bordi verticali tra le celle
      },
      ".MuiTablePagination-displayedRows": {
        "margin-top": "1em",
        "margin-bottom": "1em",
      },
      ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
        "margin-top": "1em",
        "margin-bottom": "1em",
      },
    };
  };
}
export default utilityCrono;
