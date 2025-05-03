import { useRef, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt } from "@fortawesome/free-solid-svg-icons";
import "./camera.css";
import { cameraAccessGrantedAtom, showSkipIdButtonAtom } from "../lib/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getImage } from "src/lib/composables";

const Camera = () => {
  const webcamRef = useRef(null);
  const boxRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cameraAccessGranted, setCameraAccessGranted] = useRecoilState(
    cameraAccessGrantedAtom,
  );
  const setShowSkipIdButton = useSetRecoilState(showSkipIdButtonAtom);

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
    setShowSkipIdButton(true);
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
          userSelect: "none",
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={"camera-container"}
      >
        {cameraAccessGranted ? (
          // <Webcam
          //     ref={webcamRef}
          //     audio={false}
          //     screenshotFormat="image/jpeg"
          //     videoConstraints={videoConstraints}
          //     onUserMedia={onUserMedia}
          //     mirrored={true}
          //     style={{ width: "100%", height: "100%", objectFit: "cover" }}
          // />
          <Typography color="grey" variant="h6">
            The identity service is currently unreachable.
          </Typography>
        ) : (
          <img
            src={getImage("disabled-camera") as string}
            width={80}
            alt={""}
          />
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
