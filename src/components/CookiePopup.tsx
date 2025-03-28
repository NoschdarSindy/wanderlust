import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Fragment, useEffect, useState } from "react";
import { sendEvent } from "../util";
import { askedForCookiesAtom } from "../atoms";
import { useRecoilState } from "recoil";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  fontFamily: "var(--font-family)",
}));

export default function CookiePopup() {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [askedforCookies, setAskedForCookies] =
    useRecoilState(askedForCookiesAtom);

  const handleClose = (e: any, reason?: string) => {
    if (reason === "backdropClick") return;
    sendEvent("cookies/end");
    setOpen(false);
    setAskedForCookies(true);
  };

  useEffect(() => {
    if (!askedforCookies)
      setTimeout(() => {
        setOpen(true);
        sendEvent("cookies/start");
      }, 800);
  }, []);

  return (
    <Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          We Value Your Privacy
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            This website uses cookies to collect website performance and usage
            data to provide better experiences and content. This may also
            include showing you more relevant advertisements. By clicking
            "Accept", you agree to this. You can learn more via our{" "}
            <button className={"link-button"} style={{ color: "initial" }}>
              privacy policy
            </button>
            .
          </Typography>

          {showMore && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Cookies help us analyze usage, personalize content, and improve
              our marketing. We use both first-party and third-party cookies to
              understand user behavior and serve relevant ads.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setShowMore(true)}
            className="btn btn-secondary"
          >
            Learn more
          </button>
          <button
            onClick={handleClose}
            className="btn btn-primary"
            style={{ backgroundColor: "seagreen", borderColor: "seagreen" }}
          >
            Accept all
          </button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  );
}
