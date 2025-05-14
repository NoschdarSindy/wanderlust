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

const NewsletterForm = ({ validator }) => {
  const d = getDesignMode();
  useEffect(() => {
    sendEvent("newsletter/start");
  }, []);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        {d.isDark
          ? "Sign up for our newsletter to continue"
          : "Stay informed with booking updates"}
      </Typography>
      <Grid container spacing={4} sx={{ paddingY: 2 }}>
        <Grid item xs={12}>
          <Typography sx={{ mb: 2 }}>
            {d.isDark
              ? "Please enter your email to subscribe to our newsletter. This is required to continue."
              : "To receive updates on your booking, you can enter your email address below (optional)."}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            required={d.isDark}
            autoComplete={"off"}
            onChange={(e) => validator(e.target.value)}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default NewsletterForm;
