import { Box, Slider, Typography, Button } from "@mui/material";
import { useState } from "react";
import "./questionnaire.css";
import { EventName, storeJson } from "src/lib/client";
import { Entry } from "../../../start-service.ts";
import { getSite } from "src/lib/composables.ts";

const sliderConfig = {
  min: 1,
  max: 7,
  defaultValue: 4,
  step: 0.01,
  minRateDescription: "Strongly Disagree",
  maxRateDescription: "Strongly Agree",
};

const part1: { value: EventName; text: (site: string) => string }[] = [
  {
    value: "cookies",
    text: (site) =>
      `When the ${site} website showed a cookie banner with no real choice, I felt concerned about my privacy.`,
  },
  {
    value: "geolocation",
    text: (site) =>
      `When the ${site} website asked for my location, I felt concerned about my privacy.`,
  },
  {
    value: "notification",
    text: (site) =>
      `When the ${site} website asked to enable browser notifications, I felt concerned about my privacy.`,
  },
  {
    value: "travelProtection",
    text: (site) =>
      `When the ${site} website preselected travel protection and added it to my basket by default, I felt concerned about my privacy.`,
  },
  {
    value: "videoIdent",
    text: (site) =>
      `When the ${site} website asked me to verify my identity using my ID, I felt concerned about my privacy.`,
  },
  {
    value: "camera",
    text: (site) =>
      `When the ${site} website asked for access to my camera, I felt concerned about my privacy.`,
  },
];

const part2 = [];

const allQuestions = part1.concat(part2);

export default function Questionnaire() {
  const entries = JSON.parse(VITE_ENTRIES);
  const { site: darkSiteName, domain: darkDomain } = entries.find(
    (entry: Entry) => entry.design === "dark",
  );
  const darkSite = getSite(darkSiteName);

  const [responses, setResponses] = useState<Record<string, number>>(
    allQuestions.reduce(
      (acc, q) => ({ ...acc, [q.value]: sliderConfig.defaultValue }),
      {},
    ),
  );

  const handleSliderChange = (_, value: number | number[], name: EventName) => {
    setResponses((prev) => ({ ...prev, [name]: value as number }));
  };

  const handleSubmit = () => {
    const results = JSON.stringify({ ...responses, entries });
    console.log(results);

    storeJson(results, "questionnaire")
      .then((response) => {
        response.json().then((json) => {
          console.log(json.message);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    alert("Thank you for your participation. The study is now finished.");
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        padding={3}
      >
        <h3>Questionnaire</h3>
        <br />
        <h5>
          Thank you for your participation so far. We will finish off with a
          small questionnaire about your experience with the{" "}
          {darkSite.item_name} website ({darkDomain}) from a privacy perspective
          {/*as well as your overall privacy concern*/}. After completing this
          questionnaire, the study will be finished.
        </h5>
        <br />
        <br />
        {allQuestions.map((q) => (
          <Box key={q.value} sx={{ mb: 4, width: "80%" }}>
            <Typography variant="body1" gutterBottom>
              {q.text(darkSite.item_name)}
            </Typography>
            <Slider
              value={responses[q.value] || sliderConfig.defaultValue}
              onChange={(e, value) =>
                handleSliderChange(e, value as number, q.value)
              }
              min={sliderConfig.min}
              max={sliderConfig.max}
              step={sliderConfig.step}
              valueLabelDisplay="off" // Disable numbers on hover
              aria-labelledby={`${q.value}-slider`}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                {sliderConfig.minRateDescription}
              </Typography>
              <Typography variant="body2">
                {sliderConfig.maxRateDescription}
              </Typography>
            </Box>
          </Box>
        ))}
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ mt: 2, textTransform: "none" }}
        >
          Complete
        </Button>
      </Box>
    </>
  );
}
