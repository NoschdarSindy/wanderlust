import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { sendEvent } from "../util";
import { askedForCookiesAtom, confirmshamingDoneAtom } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ConfirmshamingPopup() {
  const [open, setOpen] = useState(false);
  const [confirmshamingDone, setConfirmshamingDone] = useRecoilState(
    confirmshamingDoneAtom,
  );

  const handleAccept = (e) => {
    Notification.requestPermission().then((result) => {
      console.log(result);
      handleClose(e);
    });
  };

  const handleClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    sendEvent("confirmshaming/end");
    setOpen(false);
    setConfirmshamingDone(true);
  };

  useEffect(() => {
    if (!confirmshamingDone)
      setTimeout(() => {
        setOpen(true);
        sendEvent("confirmshaming/start");
      }, 800);
  }, []);

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Enable browser notifications
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Don't miss out on our best offers! Get price alerts via your browser
            by enabling browser notifications.
          </Typography>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="btn btn-secondary">
            No, I dont want to save money
          </button>
          <button onClick={handleAccept} className="btn btn-primary">
            Enable notifications
          </button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
