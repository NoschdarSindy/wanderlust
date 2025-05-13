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
      `I noticed that the cookie banner on the ${site} website was designed in a way that restricted my control or pressured me to accept cookies.`,
  },
  {
    value: "geolocation",
    text: (site) =>
      `I noticed that the way the ${site} website asked for my location was designed in a way that pressured me to allow it.`,
  },
  {
    value: "notification",
    text: (site) =>
      `I noticed that the way the ${site} website asked to send me notifications was designed in a way that restricted my control or pressured me to allow them.`,
  },
  {
    value: "travelProtection",
    text: (site) =>
      `I noticed that the travel protection options on the ${site} website were designed in a way that pressured me to include them in my booking.`,
  },
  {
    value: "newsletter",
    text: (site) =>
      `I noticed that the newsletter sign-up on the ${site} website was designed in a way that restricted my control or pressured me to subscribe.`,
  },
];

const part2 = [];

const allQuestions = part1.concat(part2);

export default function Questionnaire() {
  const entries = JSON.parse(VITE_ENTRIES);

  const sites = entries.map((site: Entry) => {
    return {
      site: getSite(site.site),
      domain: site.domain,
    };
  });

  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const currentSite = sites[currentSiteIndex];

  const [responses, setResponses] = useState<
    Record<string, Record<string, number>>
  >(
    sites.reduce(
      (acc, site) => ({
        ...acc,
        [site.site.item_name]: allQuestions.reduce(
          (qAcc, q) => ({ ...qAcc, [q.value]: sliderConfig.defaultValue }),
          {},
        ),
      }),
      {},
    ),
  );

  const [touchedSliders, setTouchedSliders] = useState<
    Record<string, Record<string, boolean>>
  >(
    sites.reduce(
      (acc, site) => ({
        ...acc,
        [site.site.item_name]: allQuestions.reduce(
          (qAcc, q) => ({ ...qAcc, [q.value]: false }),
          {},
        ),
      }),
      {},
    ),
  );

  const [error, setError] = useState<string | null>(null);

  const handleSliderChange = (_, value: number | number[], name: EventName) => {
    setResponses((prev) => ({
      ...prev,
      [currentSite.site.item_name]: {
        ...prev[currentSite.site.item_name],
        [name]: value as number,
      },
    }));
    setTouchedSliders((prev) => ({
      ...prev,
      [currentSite.site.item_name]: {
        ...prev[currentSite.site.item_name],
        [name]: true,
      },
    }));
    setError(null); // Clear error when user interacts with a slider
  };

  const handleSliderClick = (name: EventName) => {
    setTouchedSliders((prev) => ({
      ...prev,
      [currentSite.site.item_name]: {
        ...prev[currentSite.site.item_name],
        [name]: true,
      },
    }));
    setError(null); // Clear error when user clicks a slider
  };

  const handleNext = () => {
    const allTouched = allQuestions.every(
      (q) => touchedSliders[currentSite.site.item_name][q.value],
    );

    if (!allTouched) {
      setError("Please interact with all sliders before proceeding.");
      return;
    }

    if (currentSiteIndex < sites.length - 1) {
      setCurrentSiteIndex(currentSiteIndex + 1);
      setError(null);
    } else {
      const results = JSON.stringify({ responses, entries });
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
    }
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
          {currentSite.site.item_name} website ({currentSite.domain}) from a
          privacy perspective. After completing this questionnaire,{" "}
          {currentSiteIndex < sites.length - 1
            ? "you will answer the same questions for another site."
            : "the study will be finished."}
        </h5>
        <br />
        <br />
        {allQuestions.map((q) => (
          <Box key={q.value} sx={{ mb: 4, width: "80%" }}>
            <Typography variant="body1" gutterBottom>
              {q.text(currentSite.site.item_name)}
            </Typography>
            <Slider
              value={
                responses[currentSite.site.item_name][q.value] ||
                sliderConfig.defaultValue
              }
              onChange={(e, value) =>
                handleSliderChange(e, value as number, q.value)
              }
              onClick={() => handleSliderClick(q.value)}
              min={sliderConfig.min}
              max={sliderConfig.max}
              step={sliderConfig.step}
              valueLabelDisplay="off"
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
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          sx={{ mt: 2, textTransform: "none" }}
        >
          {currentSiteIndex < sites.length - 1 ? "Next" : "Complete"}
        </Button>
      </Box>
    </>
  );
}
