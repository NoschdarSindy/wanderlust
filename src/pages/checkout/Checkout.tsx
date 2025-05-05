import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import AddressForm from "../../components/AdressForm";
import {
  Box,
  Card,
  CardContent,
  createTheme,
  ThemeProvider,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PaymentForm from "../../components/PaymentForm";
import { Route, Routes, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  cameraAccessGrantedAtom,
  showSkipIdButtonAtom,
  // showSkipPaymentButtonAtom,
} from "src/lib/atoms";
import IdForm from "../../components/IdForm";
import { sendEvent } from "src/lib/client";
import InsuranceForm from "src/components/InsuranceForm";
import getCssVariable from "src/lib/util";
import { useEffect, useState } from "react";
import { getDesignMode } from "src/lib/composables";
import { useCustomNavigate } from "src/components/NavigationProvider.tsx";

const createSiteTheme = () =>
  createTheme({
    palette: {
      primary: { main: getCssVariable("--color-primary") },
      secondary: { main: getCssVariable("--color-secondary") },
      background: { default: getCssVariable("--color-background") },
      text: {
        primary: getCssVariable("--color-text"),
        secondary: getCssVariable("--color-muted"),
      },
    },
    typography: { fontFamily: getCssVariable("--font-family") },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              borderRadius: "6px",
              padding: "8px 12px",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              "&:hover": { borderColor: getCssVariable("--color-accent") },
              "&.Mui-focused": {
                borderColor: getCssVariable("--color-secondary"),
              },
              "&.Mui-error": { borderColor: "#d32f2f" },
            },
            "& .MuiInputLabel-root": {
              color: getCssVariable("--color-muted"),
              fontWeight: 500,
              "& .MuiInputLabel-asterisk": { color: "#d32f2f" },
              "&.Mui-focused": { color: getCssVariable("--color-primary") },
              "&.Mui-error": { color: "#d32f2f" },
            },
            "& .MuiFormHelperText-root": {
              color: getCssVariable("--color-muted"),
              "&.Mui-error": { color: "#d32f2f" },
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            "&.Mui-checked": { color: getCssVariable("--color-primary") },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: getCssVariable("--color-text"),
            fontWeight: 500,
            "&.Mui-focused": { color: getCssVariable("--color-primary") },
          },
        },
      },
    },
  });

const Checkout = () => {
  const d = getDesignMode();
  const [theme, setTheme] = useState(null);
  const location = useLocation();
  const navigateDelayed = useCustomNavigate();
  // const showSkipPaymentButton = useRecoilValue(showSkipPaymentButtonAtom);
  const showSkipIdButton = useRecoilValue(showSkipIdButtonAtom);
  const cameraAccessGranted = useRecoilValue(cameraAccessGrantedAtom);
  const params = new URLSearchParams(location.search);
  const isBriefing = params.has("briefing");

  const handleNext = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (form && form.checkValidity()) {
      switch (location.pathname) {
        case "/checkout/your-details":
          // sendEvent("personalDetails/end");
          navigateDelayed(d.isNone ? "/summary" : "/checkout/travelProtection");
          break;
        case "/checkout/travelProtection":
          sendEvent("travelProtection/end");
          navigateDelayed("/checkout/payment");
          break;
        case "/checkout/payment":
          sendEvent("paymentMethod/end");
          navigateDelayed("/checkout/id" + (d.isFair ? "?briefing" : ""));
          break;
        case "/checkout/id":
          if (isBriefing) {
            navigateDelayed("/checkout/id");
          } else {
            endVideoIdent();
          }
          break;
        default:
          break;
      }
    }
  };

  const endVideoIdent = () => {
    sendEvent("videoIdent/end");
    navigateDelayed("/summary");
  };

  const handleSkip = (e) => {
    e.preventDefault();
    if (isBriefing) {
      endVideoIdent();
    } else {
      handleNext(e);
    }
  };

  useEffect(() => {
    setTheme(createSiteTheme());
  }, []);

  if (!theme) return null;

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Navbar />
        <br />
        <Box display="flex" alignItems="center" justifyContent="center">
          <Card
            variant="outlined"
            sx={{
              width: 1024,
              paddingX: location.pathname.includes("insurance") ? 30 : 10,
              paddingY: 3,
            }}
          >
            <CardContent>
              <form>
                <Routes>
                  <Route path="/your-details" element={<AddressForm />} />
                  <Route path="/travelProtection" element={<InsuranceForm />} />
                  <Route path="/payment" element={<PaymentForm />} />
                  <Route path="/id" element={<IdForm />} />
                </Routes>
                <Grid container justifyContent="flex-end" gap={1}>
                  <Box sx={{ display: "flex" }}>
                    {/*{location.pathname.includes("/payment") && (*/}
                    {/*  <Zoom in={showSkipPaymentButton}>*/}
                    {/*    <button*/}
                    {/*      onClick={handleSubmit}*/}
                    {/*      className={"btn btn-light"}*/}
                    {/*    >*/}
                    {/*      Skip this step*/}
                    {/*    </button>*/}
                    {/*  </Zoom>*/}
                    {/*)}*/}
                    {location.pathname.includes("/id") && (
                      <Zoom in={showSkipIdButton}>
                        <button
                          onClick={handleSkip}
                          className={`btn btn-${d.isFair ? "primary" : "light"}`}
                        >
                          Skip identification
                        </button>
                      </Zoom>
                    )}
                  </Box>

                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={
                      location.pathname.includes("/id") &&
                      !isBriefing &&
                      !cameraAccessGranted
                    }
                  >
                    Next
                  </button>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Checkout;
