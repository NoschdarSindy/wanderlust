import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt } from "@fortawesome/free-solid-svg-icons";
import "./camera.css";
import { cameraAccessGrantedAtom } from "../lib/atoms";
import { useRecoilState } from "recoil";
import { getImage } from "src/lib/composables";

const Camera = () => {
  const webcamRef = useRef(null);
  const boxRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cameraAccessGranted, setCameraAccessGranted] = useRecoilState(
    cameraAccessGrantedAtom,
  );

  useEffect(() => {
    if (boxRef.current) {
      const { offsetWidth, offsetHeight } = boxRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [cameraAccessGranted]);

  const videoConstraints = {
    facingMode: "environment",
    width: dimensions.width || 1280, // Fallback resolution
    height: dimensions.height || 720,
  };

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
        ref={boxRef}
        sx={{
          width: 830,
          maxWidth: 830,
          aspectRatio: "16 / 9",
          backgroundColor: "#000",
          border: "2px solid black",
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={"camera-container"}
      >
        {cameraAccessGranted ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            mirrored={true}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={getImage("disabled-camera") as string}
            width={80}
            alt={""}
          />
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
