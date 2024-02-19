import React, { useRef } from "react";
import Webcam from "react-webcam";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt } from "@fortawesome/free-solid-svg-icons";
import "./camera.css";
import { cameraAccessGrantedAtom } from "../atoms";
import { useRecoilState } from "recoil";

const videoConstraints = {
  width: 830,
  facingMode: "environment",
};

const Camera = () => {
  const webcamRef = useRef(null);
  const [cameraAccessGranted, setCameraAccessGranted] = useRecoilState(
    cameraAccessGrantedAtom,
  );

  const capture = () => {
    if (!cameraAccessGranted) return;
    const element = document.getElementById("submit-btn");
    element.click();
  };

  const onUserMedia = () => {
    setCameraAccessGranted(true);
  };

  return (
    <>
      <Box
        sx={{
          width: 830,
          height: 467,
          backgroundColor: "#000",
          border: "2px solid black",
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={"camera-container"}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={onUserMedia}
          mirrored={true}
          width={cameraAccessGranted ? 830 : 0}
        />
        {!cameraAccessGranted && (
          <img src={"/img/disabled-camera.png"} width={80} alt={""} />
        )}
        {cameraAccessGranted && (
          <div className={"camera-overlay-container"}>
            <div className={"camera-overlay"}></div>
          </div>
        )}
      </Box>

      <br />
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton
          size="large"
          sx={{ border: "2px solid gray" }}
          onClick={capture}
        >
          <FontAwesomeIcon icon={faCameraAlt} />
        </IconButton>
      </Box>
    </>
  );
};

export default Camera;
