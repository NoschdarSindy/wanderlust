import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { sendEvent } from "../util";
import { showSkipIdButtonAtom } from "../atoms";
import { useSetRecoilState } from "recoil";
import Camera from "./Camera";

export default function IdForm() {
  const setShowSkipIdButton = useSetRecoilState(showSkipIdButtonAtom);

  useEffect(() => {
    sendEvent("id/start");
    sendEvent("cameraPermission/start");
    setTimeout(() => {
      setShowSkipIdButton(true);
    }, 6000);
  }, []);

  navigator.permissions.query({ name: "camera" }).finally(() => {
    sendEvent("cameraPermission/end");
  });

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        ID verification
      </Typography>
      <Grid container spacing={4} sx={{ paddingY: 2 }}>
        <Grid item>
          <img src={"/img/id.png"} height={100} alt={""} />
        </Grid>
        <Grid item>
          <Typography fontStyle={"italic"} color="#888">
            Take a photo of your ID or passport
            <br />
            to let the hotel verify you.
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Camera />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}></Grid>
      </Grid>
    </React.Fragment>
  );
}
