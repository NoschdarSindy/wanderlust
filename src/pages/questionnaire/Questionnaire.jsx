import { Box } from "@mui/material";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./questionnaire.css";

const likert = [
  {
    value: 7,
    text: "Strongly Agree",
  },
  {
    value: 6,
    text: "Agree",
  },
  {
    value: 5,
    text: "Somewhat Agree",
  },
  {
    value: 4,
    text: "Neither Agree nor Disagree",
  },
  {
    value: 3,
    text: "Somewhat Disagree",
  },
  {
    value: 2,
    text: "Disagree",
  },
  {
    value: 1,
    text: "Strongly disagree",
  },
];

const json = {
  elements: [
    {
      type: "matrix",
      name: "result",
      columns: likert,
      alternateRows: true,
      isAllRowRequired: true,
      rowTitleWidth: "25em",
      titleLocation: "hidden",
    },
  ],
  showQuestionNumbers: "off",
  completedHtml:
    "<h3>Thank you for your participation. The study is now finished.</h3>",
};

// My own questions
const part1 = [
  {
    value: "cookiesNoChoice",
    text: "I felt that the cookie banner gave me no choice about my data privacy.",
  },
  {
    value: "locationConcern",
    text: "When the website asked for my location, I felt concerned about my privacy.",
  },
  {
    value: "notificationsConcern",
    text: "When the website asked me to enable browser notifications, I felt concerned about my privacy.",
  },
  {
    value: "personalDetailsConcern",
    text: "When the website asked for my personal details, I felt concerned about my privacy.",
  },
  {
    value: "confusingCheckbox",
    text: "After entering my email address, I noticed that the checkbox below contained intentionally confusing text.",
  },
  {
    value: "creditCardConcern",
    text: "When the website asked for my credit card details, I felt concerned about my privacy.",
  },
  {
    value: "idConcern",
    text: "When the website asked for my ID, I felt concerned about my privacy.",
  },
  {
    value: "cameraConcern",
    text: "When the website asked for camera access, I felt concerned about my privacy.",
  },
];

// IUIPC-10
const part2 = [
  {
    value: "iuipc1",
    text: "Consumer online privacy is really a matter of consumers’ right to exercise control and autonomy over decisions about how their information is collected, used, and shared.",
  },
  {
    value: "iuipc2",
    text: "Consumer control of personal information lies at the heart of consumer privacy.",
  },
  {
    value: "iuipc3",
    text: "I believe that online privacy is invaded when control is lost or unwillingly reduced as a result of a marketing transaction.",
  },
  {
    value: "iuipc4",
    text: "Companies seeking information online should disclose the way the data are collected, processed, and used.",
  },
  {
    value: "iuipc5",
    text: "A good consumer online privacy policy should have a clear and conspicuous disclosure.",
  },
  {
    value: "iuipc6",
    text: "It is very important to me that I am aware and knowledgeable about how my personal information will be used.",
  },
  {
    value: "iuipc7",
    text: "It usually bothers me when online companies ask me for personal information.",
  },
  {
    value: "iuipc8",
    text: "When online companies ask me for personal information, I sometimes think twice before providing it.",
  },
  {
    value: "iuipc9",
    text: "It bothers me to give personal information to so many online companies.",
  },
  {
    value: "iuipc10",
    text: "I’m concerned that online companies are collecting too much personal information about me.",
  },
];

const allQuestions = part1.concat(part2);

export default function Questionnaire() {
  const survey = new Model({
    ...json,
    elements: allQuestions.map((q) => ({ ...json.elements[0], rows: [q] })),
  });
  survey.onComplete.add((sender) => {
    const results = JSON.stringify(sender.data);
    console.log(results);

    fetch("http://127.0.0.1:8000/store-json/questionnaire", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: results,
    })
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
          Thank you for your participation so far. The booking process was not
          meant to be completed, instead we will finish off with a small
          questionnaire about your experience with the website from a privacy
          perspective as well as your overall privacy concern. After completing
          this questionnaire, the study will be finished.
        </p>
      </Box>
      <Survey model={survey} />
    </>
  );
}
