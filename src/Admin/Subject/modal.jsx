import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Close from "@material-ui/icons/Close";
import PropertyStepper from "../Subject/stepper";
import PropertyStepperEdit from "../Subject/stepperEdit";
import { withStyles } from "@material-ui/core";
import modalStyle from "../../assets/jss/material-kit-react/modalStyle";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import { Tooltip } from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class AddNew extends Component {
  state = {
    modal: false,
  };

  handleClickOpen = () => {
    this.setState({
      modal: true,
    });
  };

  handleClose = () => {
    this.setState({
      modal: false,
    });
  };

  render() {
    const {
      type,
      classes,
      patchSubject,
      subject,
      eachData,
      postSubject,
      fetchData,
    } = this.props;
    const { modal } = this.state;
    let modalButton;

    let modalContent;

    switch (type) {
      case "add":
        modalButton = (
          <Button
            size="small"
            color="primary"
            onClick={this.handleClickOpen}
            variant="contained"
            style={{ backgroundColor: "#4bc9f9" }}
          >
            Add New Subject
          </Button>
        );
        modalContent = (
          <PropertyStepper
            onCloseModal={this.handleClose}
            modalStatus={modal}
            postSubject={postSubject}
            subject={subject}
            fetchData={fetchData}
          />
        );

        break;
      case "edit":
        modalButton = (
          <Tooltip title="Edit">
            <Edit style={{ fontSize: "15px" }} onClick={this.handleClickOpen} />
          </Tooltip>
        );
        modalContent = (
          <PropertyStepperEdit
            onCloseModal={this.handleClose}
            subject={subject}
            eachData={eachData}
            patchSubject={patchSubject}
            fetchData={fetchData}
          />
        );
        break;

      default:
        break;
    }
    return (
      <div>
        {modalButton}
        <Dialog
          fullScreen={false}
          // fullWidth
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={modal}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <Close className={classes.modalClose} />
            </IconButton>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}
          >
            {modalContent}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(modalStyle)(AddNew);
