import React, { Component } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';


const styleHeaderTitle={
    padding:"5px", 
    backgroundColor: "var(--colHeaderNavBar)", 
    height: "50px", 
    color:"white", 
    borderBottomStyle:"solid", 
    borderBottomWidth:"2px", 
    borderBottomColor:"#678bcfff"  
}

const styleHeaderTitleWarning={
    padding:"5px", 
    backgroundColor: "#a72121ff", 
    height: "50px", 
    color:"white", 
    borderBottomStyle:"solid", 
    borderBottomWidth:"4px", 
    borderBottomColor:"#e9dc65ff"  
}


const styleContent={
    backgroundColor: "#ffffffff", 
    padding:"10px"
}

const styleContentText = { 
    padding:"5px", 
    height: "100px", 
    color:"#000000ff" 
}

const styleDialogAction={
    padding:"15px",  
    borderTopStyle:"solid", 
    borderTopWidth:"1px", 
    borderTopColor:"#678bcfff" 
}

export default class CmpConfermaAnnulla extends Component {
    render() {
        return (

            <Dialog
                open={this.props.openConferma}
                onClose={this.props.chiudiConferma}
                aria-labelledby="newCFANN-dialog-title"
                aria-describedby="newCFANN-dialog-description"
            >
                <DialogTitle id="newCFANN-dialog-title" style={this.props.evidenza=="WARNING" ? styleHeaderTitleWarning : styleHeaderTitle}>
                    <Box>
                        {this.props.intestazione}
                    </Box>
                </DialogTitle>
                <DialogContent style={styleContent}>
                    <DialogContentText 
                        id="newCFANN-dialog-description"
                        style={styleContentText}
                        >
                        {this.props.messaggio}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={styleDialogAction}>
                    <Button className="styleButton" onClick={this.props.chiudiConferma}><CloseIcon /> Annulla</Button>
                    <Button className="styleButton" onClick={this.props.confermaOperazione} autoFocus>
                        <CheckIcon /> Conferma
                    </Button>
                </DialogActions>
            </Dialog>


        )
    }
}
