import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Fragment,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { showSkipIdButtonAtom } from "../lib/atoms";
import { sendEvent } from "src/lib/client";
import { getDesignMode } from "src/lib/composables";
import { useLocation } from "react-router-dom";

const NewsletterForm = forwardRef((_, ref) => {
  const d = getDesignMode();
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    getEmail: () => inputRef.current?.value ?? "",
  }));

  useEffect(() => {
    sendEvent("newsletter/start");
  }, []);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Sign up for our newsletter to continue
      </Typography>
      <Grid container spacing={4} sx={{ paddingY: 2 }}>
        <Grid item xs={12}>
          <Typography sx={{ mb: 2 }}>
            {d.isDark
              ? "To proceed, please enter your email address to subscribe to our newsletter. This is required to continue using the service."
              : " Do you want to receive our newsletter? You can unsubscribe at any time."}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputRef={inputRef}
            label="Email address"
            type="email"
            fullWidth
            required={d.isDark}
            autoComplete={"off"}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
});

export default NewsletterForm;
