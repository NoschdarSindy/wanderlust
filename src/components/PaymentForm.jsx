import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useEffect } from "react";
import { sendEvent } from "../util";
import { showSkipPaymentButtonAtom } from "../atoms";
import { useSetRecoilState } from "recoil";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function PaymentForm() {
  const setShowSkipPaymentButton = useSetRecoilState(showSkipPaymentButtonAtom);

  useEffect(() => {
    sendEvent("creditCard/start");
    setTimeout(() => {
      setShowSkipPaymentButton(true);
    }, 4000);
  });

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Accordion expanded={true}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography fontWeight={500}>Credit card</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="cardName"
                label="Name on card"
                fullWidth
                autoComplete="cc-name"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="cardNumber"
                label="Card number"
                fullWidth
                autoComplete="cc-number"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="expDate"
                label="Expiry date"
                fullWidth
                autoComplete="cc-exp"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="cvv"
                label="CVV"
                helperText="Last three digits on signature strip"
                fullWidth
                autoComplete="cc-csc"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox />}
                label="Remember credit card details for next time"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}
