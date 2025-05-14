import { Box, Card, Grid, Radio, Typography } from "@mui/material";
import { getDesignMode, getImage } from "src/lib/composables";
import { travelProtectionSelectedAtom } from "src/lib/atoms";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { sendEvent } from "src/lib/client";

export default function InsuranceForm() {
  const [selectedOption, setSelectedOption] = useRecoilState(
    travelProtectionSelectedAtom,
  );
  const d = getDesignMode();

  const options = [
    {
      value: "yes",
      label: "Continue with travel protection",
      color: d.isDark ? "success.main" : "#0071c2",
      image: "sunshade-in-sand",
      price: "19.99 €",
    },
    {
      value: "no",
      label: "Continue without travel protection",
      color: d.isDark ? "error.main" : "#0071c2",
      image: "no-protection",
      price: "0 €",
    },
  ];

  useEffect(() => {
    sendEvent("travelProtection/start");
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h6" gutterBottom>
        Travel Protection
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Travel plans can sometimes change unexpectedly. Adding protection helps
        you stay prepared and minimizes disruption.
      </Typography>
      <Grid container spacing={2}>
        {options.map(({ value, label, color, image, price }) => (
          <Grid item xs={12} sm={6} key={value}>
            <Card
              variant="outlined"
              onClick={() => setSelectedOption(value)}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 2,
                borderColor: selectedOption === value ? color : "grey.300",
                cursor: "pointer",
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                textAlign="center"
                sx={{ mx: "auto" }}
              >
                <img
                  src={getImage(`insurance/${image}`) as string}
                  alt={label}
                  style={{ width: 92, height: 92, borderRadius: 10 }}
                />
                <Typography>{label}</Typography>
                <Typography fontWeight="bold">{price}</Typography>
                <Radio
                  checked={selectedOption === value}
                  value={value}
                  onChange={() => setSelectedOption(value)}
                  sx={{ "&.Mui-checked": { color } }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
