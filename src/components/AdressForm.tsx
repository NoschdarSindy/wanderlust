import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fullNameAtom } from "../lib/atoms";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box, FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import { sendEvent } from "src/lib/client";

export default function AddressForm() {
  const [radio, setRadio] = useState("no");
  const [fullName, setFullName] = useRecoilState(fullNameAtom);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validEmail, setValidEmail] = useState(null);
  const re =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  const handleValidEmail = () => {
    setValidEmail(true);
  };

  const handleEmailChange = (e) => {
    if (e.target.value.match(re)) {
      handleValidEmail();
    }
  };

  const handleEmailBlur = (e) => {
    if (e.target.value.match(re)) {
      handleValidEmail();
    } else {
      setValidEmail(false);
    }
  };

  useEffect(() => {
    // sendEvent("personalDetails/start");
  }, []);

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`.trim());
  }, [firstName, lastName, setFullName]);

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h6" gutterBottom>
        Enter your details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="emailAddress"
            type="email"
            name="emailAddress"
            label="Email address"
            fullWidth
            autoComplete="email"
            variant="standard"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            error={validEmail === false}
            helperText={
              validEmail === false ? "Please enter a valid email" : ""
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
        <Box width="100%" height={0} />
        <br />
        <Grid item xs={12} sm={6} sx={{ paddingTop: "0 !important" }}>
          <TextField
            id="phoneNumber"
            name="phoneNumber"
            label="Phone number"
            fullWidth
            autoComplete="tel"
            variant="standard"
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}></Grid>
      <br />
      <br />
      <Typography variant="h6" gutterBottom>
        Your address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <br />
            <FormLabel id="demo-row-radio-buttons-group-label">
              Are you traveling for work?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
