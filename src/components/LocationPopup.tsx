import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { askedForLocationAtom } from "../lib/atoms";
import { useRecoilState } from "recoil";
import { sendEvent } from "src/lib/client";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function LocationPopup({ accept }) {
  const [open, setOpen] = useState(true);
  const [askedForLocation, setAskedForLocation] =
    useRecoilState(askedForLocationAtom);

  const handleReject = (_e: any, reason?: string) => {
    sendEvent("geolocation/end/reject");
    setOpen(false);
    setAskedForLocation(true);
  };

  useEffect(() => {
    setOpen(true);
    sendEvent("geolocation/start");
  }, []);

  return (
    <BootstrapDialog
      onClose={handleReject}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        id="customized-dialog-title"
      >
        Enable Location Access
        <IconButton
          aria-label="close"
          onClick={handleReject}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Turn on location services to find offers near you.
        </Typography>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => {
            accept();
            setOpen(false);
          }}
          className="btn btn-primary"
        >
          Enable Location
        </button>
      </DialogActions>
    </BootstrapDialog>
  );
}
