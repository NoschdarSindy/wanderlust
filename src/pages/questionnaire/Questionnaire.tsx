import { Box } from "@mui/material";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./questionnaire.css";
import { EventName, storeJson } from "src/lib/client";
import { Entry } from "../../../start-service.ts";
import { getSite } from "src/lib/composables.ts";

const sliderConfig = {
  min: 1,
  max: 7,
  defaultValue: 4,
  step: 0.1,
  rateValues: [
    { value: 1, text: "Strongly Disagree" },
    { value: 2, text: "Disagree" },
    { value: 3, text: "Somewhat Disagree" },
    { value: 4, text: "Neither Agree nor Disagree" },
    { value: 5, text: "Somewhat Agree" },
    { value: 6, text: "Agree" },
    { value: 7, text: "Strongly Agree" },
  ],
};

const json = {
  elements: [
    {
      type: "rating",
      name: "result",
      displayMode: "slider",
      minRateDescription: "Strongly Disagree",
      maxRateDescription: "Strongly Agree",
      ...sliderConfig,
      isRequired: true,
      titleLocation: "hidden",
    },
  ],
  showQuestionNumbers: "off",
  completedHtml:
    "<h3>Thank you for your participation. The study is now finished.</h3>",
};

// My own questions
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
  // {
  //   value: "paymentMethod",
  //   text: (site) =>
  //     `When the ${site} website asked for my payment information, I felt concerned about my privacy.`,
  // },
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

  const survey = new Model({
    ...json,
    elements: allQuestions.map((q) => ({
      ...json.elements[0],
      title: q.text(darkSite.item_name),
      name: q.value,
    })),
  });
  survey.onComplete.add((sender) => {
    const results = JSON.stringify({ ...sender.data, entries });
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
  });

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
        <p>
          Thank you for your participation so far. We will finish off with a
          small questionnaire about your experience with the{" "}
          {darkSite.item_name} website ({darkDomain}) from a privacy perspective
          {/*as well as your overall privacy concern*/}. After completing this
          questionnaire, the study will be finished.
        </p>
      </Box>
      <Survey model={survey} />
    </>
  );
}
