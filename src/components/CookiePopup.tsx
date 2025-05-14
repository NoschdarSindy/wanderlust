import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { askedForCookiesAtom } from "../lib/atoms";
import { useRecoilState } from "recoil";
import { sendEvent } from "src/lib/client";
import { getDesignMode } from "src/lib/composables";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  fontFamily: "var(--font-family)",
  pointerEvents: "auto",
}));

export default function CookiePopup() {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [askedforCookies, setAskedForCookies] =
    useRecoilState(askedForCookiesAtom);
  const d = getDesignMode();

  const handleClose = (_?: any, reason?: string) => {
    if (reason === "backdropClick") return;
    setOpen(false);
    setAskedForCookies(true);
  };

  const handleAccept = () => {
    sendEvent("cookies/end/accept");
    handleClose();
  };

  const handleReject = () => {
    sendEvent("cookies/end/reject");
    handleClose();
  };

  useEffect(() => {
    if (!askedforCookies)
      setTimeout(() => {
        setOpen(true);
        sendEvent("cookies/start");
        if (d.isNone) handleClose();
      }, 800);
  }, []);

  if (!d.isNone)
    return (
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        disableScrollLock
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          We Value Your Privacy
        </DialogTitle>
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
          <button onClick={() => setShowMore(true)} className="btn btn-light">
            Learn more
          </button>

          {d.isFair && (
            <button
              onClick={handleAccept}
              className="btn btn-primary"
              style={{ backgroundColor: "#0071c2", borderColor: "#0071c2" }}
            >
              Reject all
            </button>
          )}
          <button
            onClick={handleReject}
            className="btn btn-primary"
            style={{ backgroundColor: "#0071c2", borderColor: "#0071c2" }}
          >
            Accept all
          </button>
        </DialogActions>
      </BootstrapDialog>
    );
}
