import { getDesignMode, getSite } from "src/lib/composables";

const events = [
  "app",
  "cookies",
  "geolocation",
  "notification",
  // "personalDetails",
  "travelProtection",
  // "paymentMethod",
  "videoIdent",
  "camera",
] as const;
export type EventName = (typeof events)[number];
type Decision = "accept" | "reject";
type EvenString =
  | `${EventName}/${"start" | `end${`/${Decision}` | ""}`}`
  | `routeChange/${string}`;

const participant = VITE_PARTICIPANT;
const s = getSite();
const { design } = getDesignMode();

export const sendEvent = (eventString: EvenString) => {
  if (s.isStudy) return;

  const path = `${participant}/${s.name}/${design}/${eventString}`;
  // console.log(`${path}`);
  fetch("http://127.0.0.1:8000/" + path)
    .then((response) => {
      response.json().then((json) => {
        console.log(json.message);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

export const storeJson = (body, name) => {
  return fetch(`http://127.0.0.1:8000/store-json/${participant}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
};
