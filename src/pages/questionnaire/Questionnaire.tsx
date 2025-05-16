import {
  Box,
  Slider,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import "./questionnaire.css";
import { EventName, storeJson } from "src/lib/client";
import { Entry } from "../../../start-service.ts";
import { getSite } from "src/lib/composables.ts";
import LoadingOverlay from "src/components/LoadingOverlay.tsx";
import { useCustomNavigate } from "src/components/NavigationProvider.tsx";

const sliderConfig = {
  min: 1,
  max: 7,
  defaultValue: 4,
  step: 0.01,
  minRateDescription: "Strongly Disagree",
  maxRateDescription: "Strongly Agree",
};

const stimuli: { value: string; label: string; intent: string }[] = [
  {
    value: "cookies",
    label: "the cookie banner",
    intent: "accept cookies",
  },
  {
    value: "geolocation",
    label: "the website’s request for my location",
    intent: "allow it",
  },
  {
    value: "notification",
    label: "the website’s request to send me notifications",
    intent: "allow them",
  },
  {
    value: "travelProtection",
    label: "the travel protection options",
    intent: "include them in my booking",
  },
  {
    value: "newsletter",
    label: "the newsletter sign-up",
    intent: "subscribe",
  },
];

const dpDescriptions = {
  interfaceInterference:
    "Some websites design their interfaces so that certain options are harder to see or choose.",
  forcedAction:
    "Some websites make users do things like signing up or granting access even when it's not really necessary.",
  socialEngineering:
    "Some websites use emotional or guilt-driven wording to pressure users into agreeing to something.",
  sneaking:
    "Some websites add extra services or costs by default unless the user removes them.",
};

const initialQuestions = [
  {
    value: "ddp_familiar",
    text: "I am familiar with deceptive designs (sometimes called ‘dark patterns’).",
  },
  {
    value: "ddp_bother",
    text: "Deceptive design techniques usually bother me when I encounter them online.",
  },
];

export default function Questionnaire() {
  const entries = JSON.parse(VITE_ENTRIES);

  const sites = entries.map((site: Entry) => {
    return {
      site: getSite(site.site),
      domain: site.domain,
      design: site.design,
    };
  });

  const delay = (func: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      func();
    }, 400);
  };

  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [showInitialQuestion, setShowInitialQuestion] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const currentSite = sites[currentSiteIndex];

  const prefix = `${currentSite.site.name}_${currentSite.site.design}_`;
  const siteQuestions = stimuli.flatMap(({ value, label, intent }) => [
    {
      value: `${prefix + value}_aware`,
      text: `It seemed that the design of ${label} on the ${currentSite} website was intended to restrict my control or pressure me to ${intent}.`,
    },
    {
      value: `${prefix + value}_bothered`,
      text: `I was bothered by the design of ${label} on the ${currentSite} website.`,
    },
  ]);

  const [responses, setResponses] = useState<
    Record<string, Record<string, number>>
  >({
    initial: { [initialQuestions.value]: sliderConfig.defaultValue },
    ...sites.reduce(
      (acc, site) => ({
        ...acc,
        [site.site.item_name]: siteQuestions.reduce(
          (qAcc, q) => ({ ...qAcc, [q.value]: sliderConfig.defaultValue }),
          {},
        ),
      }),
      {},
    ),
  });

  const [touchedSliders, setTouchedSliders] = useState<
    Record<string, Record<string, boolean>>
  >({
    initial: { [initialQuestions.value]: false },
    ...sites.reduce(
      (acc, site) => ({
        ...acc,
        [site.site.item_name]: siteQuestions.reduce(
          (qAcc, q) => ({ ...qAcc, [q.value]: false }),
          {},
        ),
      }),
      {},
    ),
  });

  const [error, setError] = useState<string | null>(null);

  const handleSliderChange = (
    _: any,
    value: number | number[],
    name: string,
    section: string,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value as number,
      },
    }));
    setTouchedSliders((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: true,
      },
    }));
    setError(null);
  };

  const handleSliderClick = (name: string, section: string) => {
    setTouchedSliders((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: true,
      },
    }));
    setError(null);
  };

  const handleNext = () => {
    if (showInitialQuestion) {
      if (!touchedSliders.initial[initialQuestions.value]) {
        setError("Please interact with the slider before proceeding.");
        return;
      }
      delay(() => {
        setShowInitialQuestion(false);
        setError(null);
      });
      return;
    }

    const allTouched = siteQuestions.every(
      (q) => touchedSliders[currentSite.site.item_name][q.value],
    );

    if (!allTouched) {
      setError("Please interact with all sliders before proceeding.");
      return;
    }

    if (currentSiteIndex < sites.length - 1) {
      delay(() => {
        setCurrentSiteIndex(currentSiteIndex + 1);
        setError(null);
      });
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
        {showInitialQuestion ? (
          <>
            <h5>
              Thank you for your participation so far. Below, please answer the
              following question about your familiarity with deceptive designs.
            </h5>
            <br />
            <br />
            <Box sx={{ mb: 4, width: "80%" }}>
              <Typography variant="body1" gutterBottom>
                {initialQuestions.text}
              </Typography>
              <Slider
                value={
                  responses.initial[initialQuestions.value] ||
                  sliderConfig.defaultValue
                }
                onChange={(e, value) =>
                  handleSliderChange(
                    e,
                    value,
                    initialQuestions.value,
                    "initial",
                  )
                }
                onClick={() =>
                  handleSliderClick(initialQuestions.value, "initial")
                }
                min={sliderConfig.min}
                max={sliderConfig.max}
                step={sliderConfig.step}
                valueLabelDisplay="off"
                aria-labelledby={`${initialQuestions.value}-slider`}
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
          </>
        ) : (
          <>
            <h5>
              Next, we'd like to ask you a few brief questions about your
              experience with the <b>{currentSite.site.item_name} website</b> (
              {currentSite.domain}). After completing this questionnaire,{" "}
              {currentSiteIndex < sites.length - 1
                ? `you will answer the same questions for the ${sites[currentSiteIndex + 1].site.item_name} website.`
                : "the study will be finished."}
            </h5>
            <br />
            <br />
            {siteQuestions.map((q) => (
              <Box key={q.value} sx={{ mb: 4, width: "80%" }}>
                <Typography variant="body1" gutterBottom>
                  {q.text}
                </Typography>
                <Slider
                  value={
                    responses[currentSite.site.item_name][q.value] ||
                    sliderConfig.defaultValue
                  }
                  onChange={(e, value) =>
                    handleSliderChange(
                      e,
                      value,
                      q.value,
                      currentSite.site.item_name,
                    )
                  }
                  onClick={() =>
                    handleSliderClick(q.value, currentSite.site.item_name)
                  }
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
          </>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ position: "relative", mt: 2 }}>
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{ textTransform: "none" }}
            disabled={isLoading}
          >
            {showInitialQuestion
              ? "Next"
              : currentSiteIndex < sites.length - 1
                ? "Next"
                : "Complete"}
          </Button>
          {isLoading && <LoadingOverlay />}
        </Box>
      </Box>
    </>
  );
}
