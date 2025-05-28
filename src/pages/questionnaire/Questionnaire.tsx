import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { type EventName, storeJson } from "src/lib/client";
import { getSite } from "src/lib/composables.ts";

const stimuli = [
  {
    value: "cookies",
    label: (site) =>
      `the cookie banner${site ? ` on the ${site} website` : ""}`,
    intent: "accept cookies",
  },
  {
    value: "geolocation",
    label: (site) =>
      `the${site ? ` ${site}` : ""} website’s request for my location`,
    intent: "allow it",
  },
  {
    value: "notification",
    label: (site) =>
      `the${site ? ` ${site}` : ""} website’s request to send me notifications`,
    intent: "allow them",
  },
  {
    value: "travelProtection",
    label: (site) =>
      `the travel protection options${site ? ` on the ${site} website` : ""}`,
    intent: "include them in my booking",
  },
  {
    value: "newsletter",
    label: (site) =>
      `the newsletter sign-up${site ? ` on the ${site} website` : ""}`,
    intent: "subscribe",
  },
] satisfies {
  value: EventName;
  label: (site?: string) => string;
  intent: string;
}[];

const dpDescriptions = [
  {
    value: "forcedAction",
    description:
      "Some websites make users do things like signing up or granting access even when it’s not really necessary.",
  },
  {
    value: "interfaceInterference",
    description:
      "Some websites design their interfaces so that certain options are harder to see or choose.",
  },
  {
    value: "socialEngineering",
    description:
      "Some websites use emotional or guilt-driven wording to pressure users into agreeing to something.",
  },
  {
    value: "sneaking",
    description:
      "Some websites add extra services or costs by default unless the user removes them.",
  },
];

const initialQuestions = [
  {
    value: "ddp_familiar",
    text: "I am familiar with deceptive designs (sometimes called ‘dark patterns’).",
  },
  {
    value: "ddp_bothered",
    text: "Deceptive design techniques generally bother me when I encounter them online.",
  },
];

function Questionnaire() {
  const entries = JSON.parse(import.meta.env.VITE_ENTRIES);
  const sites = entries.map((site) => ({
    site: getSite(site.site),
    domain: site.domain,
    design: site.design,
  }));

  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({});
  const [sliderTouched, setSliderTouched] = useState({});
  const [errors, setErrors] = useState({});

  const meta = {
    darkFirst: sites[0].design === "dark",
    hotelFirst: sites[0].site.name === "hotels",
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSliderTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleTextChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePage = () => {
    const pageQuestions = getPageQuestions(currentPage);
    const newErrors = {};
    let isValid = true;

    pageQuestions.forEach((q) => {
      if (q.type === "radio" && !(q.name in formData)) {
        newErrors[q.name] = "This question is required";
        isValid = false;
      }
      if (q.type === "slider" && !sliderTouched[q.name]) {
        newErrors[q.name] = "Please interact with this slider";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!validatePage()) return;

    if (currentPage < sites.length) {
      setCurrentPage((prev) => prev + 1);
    } else {
      try {
        await Promise.all([
          storeJson(JSON.stringify(formData), "questionnaire"),
          storeJson(JSON.stringify(meta), "meta"),
        ]).then((responses) =>
          Promise.all(responses.map((res) => res.json())).then((jsons) =>
            jsons.forEach((json) => console.log(json.message)),
          ),
        );
      } catch (err) {
        console.error("Submission error:", err);
      }
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getPageQuestions = (pageIndex) => {
    if (pageIndex === 0) {
      return [
        ...initialQuestions.map((q) => ({
          name: q.value,
          title: q.text,
          type: q.value === "ddp_bothered" ? "slider" : "radio",
        })),
        ...dpDescriptions.flatMap(({ value, description }) => [
          { type: "html", html: `<big>${description}</big>` },
          {
            name: `${value}_familiar`,
            title: "I have seen the described design before the study.",
            type: "radio",
          },
          {
            name: `${value}_bothered`,
            title: "The described design generally bothers me.",
            type: "slider",
          },
        ]),
      ];
    } else {
      const site = sites[pageIndex - 1];
      const prefix = `${site.site.name}_${site.design}_`;
      return [
        {
          type: "html",
          html: `<h6>Next, we’d like to ask you a few short questions about your experience with the <b>${site.site.item_name}</b> website (${site.domain}). Once you’ve completed this part, ${
            pageIndex < sites.length
              ? `you will be asked the same questions about the ${sites[pageIndex].site.item_name} website.`
              : "the study will be finished."
          }</h6>`,
        },
        ...stimuli.flatMap(({ value, label, intent }) => [
          {
            name: `${prefix + value}_aware`,
            title: `It seemed that ${label(site.site.item_name)} ${
              value === "travelProtection" ? "were" : "was"
            } designed to restrict my control or pressure me to ${intent}.`,
            type: "radio",
          },
          {
            name: `${prefix + value}_bothered`,
            title: `The design of ${label("")} bothered me.`,
            type: "slider",
          },
        ]),
      ];
    }
  };

  const renderQuestion = (question) => {
    if (question.type === "html") {
      return (
        <Box
          className="mb-6"
          dangerouslySetInnerHTML={{ __html: question.html }}
        />
      );
    } else if (question.type === "radio") {
      return (
        <FormControl
          component="fieldset"
          error={!!errors[question.name]}
          className="mb-6"
        >
          <Typography variant="h6" className="mb-2">
            {question.title}
          </Typography>
          <RadioGroup
            row
            onChange={(e) => handleRadioChange(question.name, e.target.value)}
            value={formData[question.name]?.toString() || ""}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
          {errors[question.name] && (
            <Typography color="error">{errors[question.name]}</Typography>
          )}
        </FormControl>
      );
    } else if (question.type === "slider") {
      return (
        <Box className="mb-6">
          <Typography variant="h6" className="mb-2">
            {question.title}
          </Typography>
          <Box className="px-4">
            <Slider
              value={formData[question.name] ?? 50}
              onChange={(e, value) => handleSliderChange(question.name, value)}
              step={0.01}
              min={0}
              max={100}
              marks={[
                { value: 0, label: "Strongly Disagree" },
                { value: 100, label: "Strongly Agree" },
              ]}
              valueLabelDisplay="auto"
            />
            {errors[question.name] && (
              <Typography color="error">{errors[question.name]}</Typography>
            )}
            {question.name === "ddp_bothered" &&
              formData[question.name] > 50 && (
                <TextField
                  label="If yes, describe them in one sentence"
                  fullWidth
                  value={formData[`${question.name}_comment`] || ""}
                  onChange={(e) =>
                    handleTextChange(`${question.name}_comment`, e.target.value)
                  }
                  className="mt-4"
                />
              )}
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {currentPage === sites.length + 1 ? (
        <Typography variant="h6">
          The study is now finished. Thank you for your participation.
        </Typography>
      ) : (
        <>
          <Typography variant="h5" className="mb-4">
            {currentPage === 0
              ? "Thank you for your participation so far. Below, we’d like to ask some questions about your familiarity and experience with deceptive designs."
              : `Questions about ${sites[currentPage - 1].site.item_name}`}
          </Typography>
          {getPageQuestions(currentPage).map((question, index) => (
            <Box key={index}>{renderQuestion(question)}</Box>
          ))}
          <Box className="flex justify-between mt-6">
            {currentPage > 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                className="capitalize"
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              className="capitalize"
            >
              {currentPage === sites.length ? "Submit" : "Next"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Questionnaire;
