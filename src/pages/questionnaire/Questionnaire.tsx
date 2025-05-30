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
import ScrollToTop from "src/components/ScrollToTop.tsx";

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

  const [currentPage, setCurrentPage] = useState(-1);
  const [formData, setFormData] = useState({});
  const [sliderTouched, setSliderTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showValidationError, setShowValidationError] = useState(false);

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
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validatePage = () => {
    const pageQuestions = getPageQuestions(currentPage);
    const newErrors = {};
    let isValid = true;

    pageQuestions.forEach((item) => {
      if (item.type === "panel") {
        item.elements.forEach((q) => {
          if (q.type === "radio" && !(q.name in formData)) {
            newErrors[q.name] = "This question is required";
            isValid = false;
          } else if (q.type === "slider" && !sliderTouched[q.name]) {
            newErrors[q.name] = "Please interact with this slider";
            isValid = false;
          } else if (
            q.name === "ddp_familiar" &&
            formData["ddp_familiar"] &&
            !formData["ddp_description"]?.trim()
          ) {
            newErrors["ddp_description"] = "This field cannot be empty";
            isValid = false;
          }
        });
      }
    });

    setErrors(newErrors);
    setShowValidationError(!isValid);
    return isValid;
  };

  const handleNext = async () => {
    if (!validatePage()) return;

    if (currentPage === sites.length - 1) {
      //done
      console.log(formData);
      console.log(meta);

      try {
        await Promise.all([
          storeJson(formData, "questionnaire"),
          storeJson(meta, "meta"),
        ]).then((responses) =>
          Promise.all(responses.map((res) => res.json())).then((jsons) =>
            jsons.forEach((json) => console.log(json.message)),
          ),
        );
      } catch (err) {
        console.error("Submission error:", err);
      }
    }

    setCurrentPage((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentPage >= 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getPageQuestions = (pageIndex) => {
    if (pageIndex === -1) {
      return [
        {
          type: "panel",
          elements: initialQuestions.map((q) => ({
            name: q.value,
            title: q.text,
            type: q.value === "ddp_bothered" ? "slider" : "radio",
          })),
        },
        ...dpDescriptions.map(({ value, description }) => ({
          type: "panel",
          elements: [
            { type: "html", html: `<big><big>${description}</big></big>` },
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
          ],
        })),
      ];
    } else {
      const site = sites[pageIndex];
      const prefix = `${site.site.name}_${site.design}_`;
      return [
        {
          type: "html",
          html: ``,
        },
        ...stimuli.map(({ value, label, intent }) => ({
          type: "panel",
          elements: [
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
          ],
        })),
      ];
    }
  };

  const renderQuestion = (question) => {
    if (question.type === "html") {
      return (
        <Box
          sx={{ mb: 3 }}
          dangerouslySetInnerHTML={{ __html: question.html }}
        />
      );
    } else if (question.type === "radio") {
      return (
        <Box sx={{ mb: question.name === "ddp_familiar" && 3 }}>
          <FormControl
            component="fieldset"
            error={!!errors[question.name]}
            sx={{ mb: question.name !== "ddp_familiar" && 3 }}
          >
            <Typography variant="h6" sx={{ mb: 1 }} fontWeight={"bold"}>
              {question.title}
            </Typography>
            <RadioGroup
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
          {question.name === "ddp_familiar" && (
            <>
              {formData["ddp_familiar"] && (
                <TextField
                  fullWidth
                  value={formData[`ddp_description`] || ""}
                  onChange={(e) =>
                    handleTextChange(`ddp_description`, e.target.value)
                  }
                  sx={{ mt: 2 }}
                  multiline
                  label="If you answered yes above, please describe deceptive designs in one sentence."
                  error={!!errors["ddp_description"]}
                />
              )}
              {errors["ddp_description"] && (
                <Typography color="error">
                  {errors["ddp_description"]}
                </Typography>
              )}
            </>
          )}
        </Box>
      );
    } else if (question.type === "slider") {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }} fontWeight={"bold"}>
            {question.title}
          </Typography>
          <Box>
            <Slider
              value={formData[question.name] ?? 50}
              onChange={(e, value) => handleSliderChange(question.name, value)}
              step={0.01}
              min={0}
              max={100}
              marks={false}
              valueLabelDisplay="off"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                // onClick={() => handleSliderChange(question.name, 0)}
                // sx={{ cursor: "pointer" }}
              >
                Strongly Disagree
              </Typography>
              <Typography
                variant="body2"
                // onClick={() => handleSliderChange(question.name, 100)}
                // sx={{ cursor: "pointer" }}
              >
                Strongly Agree{" "}
              </Typography>
            </Box>
            {errors[question.name] && (
              <Typography color="error">{errors[question.name]}</Typography>
            )}
          </Box>
        </Box>
      );
    }
    return null;
  };

  const renderPanel = (panel) => {
    if (panel.type === "panel") {
      return (
        <Box
          sx={{
            mb: 3,
            bgcolor: "white",
            p: 3,
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {panel.elements.map((question, index) => (
            <Box key={index}>{renderQuestion(question)}</Box>
          ))}
        </Box>
      );
    }
    return renderQuestion(panel);
  };

  return (
    <Box
      sx={{
        px: "md",
        py: 3,
        bgcolor: "grey.200",
        minHeight: "100vh",
      }}
    >
      <ScrollToTop key={currentPage} />
      {currentPage === sites.length ? (
        <Typography variant="h6" fontWeight={"bold"} align={"center"}>
          The study is now finished. Thank you for your participation.
        </Typography>
      ) : (
        <Box sx={{ maxWidth: "md", mx: "auto" }}>
          <Box sx={{ mb: 2 }}>
            {currentPage === -1 ? (
              <Typography variant={"h5"} fontWeight={"bold"}>
                Thank you for your participation so far. Below, we’d like to ask
                some questions about your familiarity and experience with
                deceptive designs.
              </Typography>
            ) : (
              <Typography variant={"h5"}>
                Next, we’d like to ask you a few short questions about your
                experience with the <b>{sites[currentPage].site.item_name}</b>{" "}
                website ({sites[currentPage].domain}). Once you’ve completed
                this part,{" "}
                {currentPage < sites.length - 1
                  ? `you will be asked the same questions about the ${sites[currentPage + 1].site.item_name} website.`
                  : "the study will be finished."}
              </Typography>
            )}
          </Box>
          {getPageQuestions(currentPage).map((item, index) => (
            <Box key={index}>{renderPanel(item)}</Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {currentPage >= 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ textTransform: "capitalize" }}
              >
                Back
              </Button>
            )}
            {showValidationError && (
              <Typography color="error" variant="body2">
                Please fill out the whole form.
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ textTransform: "capitalize", marginLeft: "auto" }}
            >
              {currentPage === sites.length ? "Submit" : "Next"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Questionnaire;
