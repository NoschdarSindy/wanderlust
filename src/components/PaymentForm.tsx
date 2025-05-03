import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { Fragment, useEffect } from "react";
import { showSkipPaymentButtonAtom, fullNameAtom } from "../lib/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sendEvent } from "src/lib/client";
import { getDesignMode } from "src/lib/composables";

export default function PaymentForm() {
  // const setShowSkipPaymentButton = useSetRecoilState(showSkipPaymentButtonAtom);
  const d = getDesignMode();
  const fullName = useRecoilValue(fullNameAtom);

  useEffect(() => {
    sendEvent("paymentMethod/start");
    // setTimeout(() => {
    //   setShowSkipPaymentButton(true);
    // }, 4000);
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      {d.isFair ? (
        (() => {
          const fairOptions = ["Giropay", "Invoice"];
          return (
            <div style={{ marginBottom: 24 }}>
              <FormControlLabel
                control={<Radio checked />}
                label="Pay later"
                style={{
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 8,
                }}
              />
              {fairOptions.map((label) => (
                <Fragment key={label}>
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "#ccc",
                      margin: "8px 0",
                    }}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label={label}
                    style={{
                      height: 64,
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 8,
                      cursor: "pointer",
                      opacity: 1,
                      pointerEvents: "auto",
                    }}
                    onClick={(e) => e.preventDefault()}
                  />
                </Fragment>
              ))}
            </div>
          );
        })()
      ) : (
        <Accordion expanded={true}>
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography fontWeight={500}>SEPA Direct Debit</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="accountHolder"
                  label="Account holder name"
                  fullWidth
                  autoComplete="name"
                  variant="standard"
                  defaultValue={fullName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="IBAN"
                  fullWidth
                  autoComplete="off"
                  variant="standard"
                  inputProps={{ list: "iban-options", maxLength: 34 }}
                />
              </Grid>
              <datalist id="iban-options">
                <option value="DE89370400440532013000" />
              </datalist>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Remember payment details for next time"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
}
