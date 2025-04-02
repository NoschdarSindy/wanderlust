import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Fragment, useEffect } from "react";
import { showSkipIdButtonAtom } from "../lib/atoms";
import { useSetRecoilState } from "recoil";
import Camera from "./Camera";
import { sendEvent } from "src/lib/client";

export default function IdForm() {
  const setShowSkipIdButton = useSetRecoilState(showSkipIdButtonAtom);

  useEffect(() => {
    sendEvent("videoIdent/start");
    sendEvent("cameraPermission/start");
    setTimeout(() => {
      setShowSkipIdButton(true);
    }, 6000);
  }, []);

  navigator.permissions
    .query({ name: "camera" } as unknown as PermissionDescriptor)
    .finally(() => {
      sendEvent("cameraPermission/end");
    });

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        ID verification
      </Typography>
      <Grid container spacing={4} sx={{ paddingY: 2 }}>
        <Grid item>
          <img src={"/id.png"} height={100} alt={""} />
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
    </Fragment>
  );
}
