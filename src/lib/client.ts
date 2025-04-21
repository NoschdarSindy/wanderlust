import { getDesignMode, getSite } from "src/lib/composables";

const events = [
  "app",
  "cookies",
  "geolocation",
  "confirmshaming",
  "personalDetails",
  "sneakIntoBasket",
  "creditCard",
  "videoIdent",
  "cameraPermission",
] as const;
type EventName = (typeof events)[number];
type EventPhase = "start" | "end";
type EvenString = `${EventName}/${EventPhase}` | `routeChange/${string}`;

const participant = process.env.REACT_APP_PARTICIPANT;
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
