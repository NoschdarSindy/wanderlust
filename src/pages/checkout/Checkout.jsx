import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import AddressForm from "../../components/AdressForm";
import { Box, Card, CardContent, Zoom } from "@mui/material";
import Grid from "@mui/material/Grid";
import PaymentForm from "../../components/PaymentForm";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { sendEvent } from "../../util";
import { useRecoilValue } from "recoil";
import {
  cameraAccessGrantedAtom,
  showSkipIdButtonAtom,
  showSkipPaymentButtonAtom,
} from "../../atoms";
import IdForm from "../../components/IdForm";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showSkipPaymentButton = useRecoilValue(showSkipPaymentButtonAtom);
  const showSkipIdButton = useRecoilValue(showSkipIdButtonAtom);
  const cameraAccessGranted = useRecoilValue(cameraAccessGrantedAtom);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      switch (location.pathname) {
        case "/checkout/your-details":
          sendEvent("personalDetails/end");
          navigate("/checkout/payment");
          break;
        case "/checkout/payment":
          sendEvent("creditCard/end");
          navigate("/checkout/id");
          break;
        case "/checkout/id":
          sendEvent("id/end");
          sendEvent("app/end");
          navigate("/questionnaire");
          break;
        default:
          break;
      }
    }
  };

  return (
    <div>
      <Navbar />
      <br />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Card
          variant="outlined"
          sx={{ width: 1024, paddingX: 10, paddingY: 3 }}
        >
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Routes>
                <Route path="/your-details" element={<AddressForm />} />
                <Route path="/payment" element={<PaymentForm />} />
                <Route path="/id" element={<IdForm />} />
              </Routes>
              <Grid container justifyContent="flex-end">
                <Box sx={{ display: "flex" }}>
                  {location.pathname.includes("/payment") && (
                    <Zoom in={showSkipPaymentButton}>
                      <button
                        onClick={handleSubmit}
                        className={"btn btn-light"}
                      >
                        Skip this step
                      </button>
                    </Zoom>
                  )}
                  {location.pathname.includes("/id") && (
                    <Zoom in={showSkipIdButton}>
                      <button
                        onClick={handleSubmit}
                        className={"btn btn-light"}
                      >
                        Skip identification
                      </button>
                    </Zoom>
                  )}
                </Box>
                &nbsp;
                <button
                  id={"submit-btn"}
                  type="submit"
                  className={"btn btn-primary"}
                  disabled={
                    location.pathname.includes("/id") && !cameraAccessGranted
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
  );
};

export default Checkout;
