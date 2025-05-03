import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const LoadingOverlay = () => {
  return (
    <Backdrop
      open
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: "rgba(88,88,88, 0.8)",
      }}
    >
      <CircularProgress color="inherit" size={100} thickness={2} />
    </Backdrop>
  );
};

export default LoadingOverlay;
