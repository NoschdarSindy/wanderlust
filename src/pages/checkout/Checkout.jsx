import { useNavigate } from "react-router-dom";
import { useWebsite } from "../../contexts/WebsiteContext";
import { websiteThemes } from "../../theme/websiteThemes";
import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";

const steps = ['Customer Details', 'Payment', 'Confirmation'];

const Checkout = () => {
  const navigate = useNavigate();
  const { websiteType } = useWebsite();
  const theme = websiteThemes[websiteType];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: theme.borderRadius,
          boxShadow: theme.boxShadow,
          fontFamily: theme.fontFamily
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            color: theme.primaryColor,
            mb: 4,
            fontFamily: theme.fontFamily
          }}
        >
          {theme.name} Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ mb: 2 }}>
                Thank you for your booking!
              </Typography>
              <Button 
                onClick={() => navigate('/')}
                sx={{
                  backgroundColor: theme.primaryColor,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.accentColor,
                  }
                }}
              >
                Return Home
              </Button>
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 2 }}>
                {activeStep === 0 && (
                  <Typography>Customer Details Form</Typography>
                )}
                {activeStep === 1 && (
                  <Typography>Payment Form</Typography>
                )}
                {activeStep === 2 && (
                  <Typography>Booking Summary</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    color: theme.secondaryColor
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    backgroundColor: theme.primaryColor,
                    '&:hover': {
                      backgroundColor: theme.accentColor,
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;