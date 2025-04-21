import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Fragment, useEffect, useState } from "react";
import { showSkipIdButtonAtom, cameraAccessGrantedAtom } from "../lib/atoms";
import { useSetRecoilState } from "recoil";
import Camera from "./Camera";
import { sendEvent } from "src/lib/client";
import { getDesignMode, getImage } from "src/lib/composables";
import { useLocation } from "react-router-dom";

export default function IdForm() {
  const d = getDesignMode();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isBriefing = params.has("briefing");
  const setShowSkipIdButton = useSetRecoilState(showSkipIdButtonAtom);
  const setCameraAccessGranted = useSetRecoilState(cameraAccessGrantedAtom);
  useEffect(() => {
    sendEvent("videoIdent/start");
    setTimeout(
      () => {
        setShowSkipIdButton(true);
      },
      d.isDark ? 6000 : 0,
    );
  }, []);

  useEffect(() => {
    if (!isBriefing) {
      (async () => {
        sendEvent("cameraPermission/start");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setCameraAccessGranted(true);
        } catch (e) {
        } finally {
          sendEvent("cameraPermission/end");
        }
      })();
    }
  }, [isBriefing]);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        ID verification
      </Typography>
      {!isBriefing ? (
        <>
          <div>
            <Grid container spacing={4} sx={{ paddingY: 2 }}>
              <Grid item>
                <img src={getImage("id") as string} height={100} alt={""} />
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
          </div>
        </>
      ) : (
        <>
          <Grid container spacing={4} sx={{ paddingY: 2 }}>
            <Grid item>
              <Typography sx={{ mb: 2 }}>
                We offer you the option to verify your identity now. This can
                help speed things up later when identity verification is needed.
                This step is completely voluntary.
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </Fragment>
  );
}
