import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./questionnaire.css";
import { EventName, storeJson } from "src/lib/client";
import { Entry } from "../../../start-service.ts";
import { getSite } from "src/lib/composables.ts";

const defaultOpts = {
  type: "radiogroup",
  isRequired: true,
  choices: [
    { value: true, text: "Yes" },
    { value: false, text: "No" },
  ],
};

const stimuli: {
  value: EventName;
  label: (site?: string) => string;
  intent: string;
}[] = [
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
];

const dpDescriptions = [
  {
    value: "forcedAction",
    description:
      "Some websites make users do things like signing up or granting access even when it's not really necessary.",
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

const generateSurveyModel = (sites) => {
  return {
    completedHtml:
      "<h6>The study is now finished. Thank you for your participation.</h6> ",
    pages: [
      {
        title:
          "Thank you for your participation so far. Below, we'd like to ask some questions about your familiarity and experience with deceptive designs.",
        elements: [
          {
            type: "panel",
            elements: [
              ...initialQuestions.map((q) => ({
                name: q.value,
                title: q.text,
                ...defaultOpts,
              })),
            ],
          },
          ...dpDescriptions.map(({ value, description }) => ({
            type: "panel",
            elements: [
              {
                type: "html",
                html: `<big>${description}</big>`,
              },
              {
                name: `${value}_familiar`,
                title: "I had seen this kind of design before the study.",
                ...defaultOpts,
              },
              {
                name: `${value}_bothered`,
                title: "This kind of design generally bothers me.",
                ...defaultOpts,
              },
            ],
          })),
        ],
      },
      ...sites.map((site, i) => {
        const prefix = `${site.site.name}_${site.design}_`;
        return {
          elements: [
            {
              type: "html",
              html: `<h6>Next, we’d like to ask you a few short questions about your experience with the <b>${site.site.item_name}</b> website (${site.domain}). Once you’ve completed this part, ${
                i < sites.length - 1
                  ? `you will be asked the same questions about the ${sites[i + 1].site.item_name} website.`
                  : "the study will be finished."
              }</h6>`,
            },
            ...stimuli.flatMap(({ value, label, intent }) => ({
              type: "panel",
              elements: [
                {
                  name: `${prefix + value}_aware`,
                  title: `It seemed that ${label(site.site.item_name)} ${value === "travelProtection" ? "were" : "was"} designed to restrict my control or pressure me to ${intent}.`,
                  ...defaultOpts,
                },
                {
                  name: `${prefix + value}_bothered`,
                  title: `The design of ${label()} bothered me.`,
                  ...defaultOpts,
                },
              ],
            })),
          ],
        };
      }),
    ],
  };
};

export default function Questionnaire() {
  const entries = JSON.parse(import.meta.env.VITE_ENTRIES);
  const sites = entries.map((site: Entry) => ({
    site: getSite(site.site),
    domain: site.domain,
    design: site.design,
  }));

  const survey = new Model(generateSurveyModel(sites));

  const meta = {
    darkFirst: sites[0].design === "dark",
    hotelFirst: sites[0].site.name === "hotels",
  };

  survey.onComplete.add((sender) => {
    Object.entries({ questionnaire: sender.data, meta }).forEach(
      ([key, value]) => {
        const result = JSON.stringify(value);
        console.log(result);
        storeJson(result, key)
          .then((response) => {
            response.json().then((json) => {
              console.log(json.message);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      },
    );
  });

  return <Survey model={survey} />;
}
