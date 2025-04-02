import { useDesignMode, useSite } from "src/lib/composables";

const events = [
  "app",
  "cookies",
  "geolocation",
  "notifications",
  "personalDetails",
  "sneakIntoBasket",
  "creditCard",
  "videoIdent",
  "cameraPermission",
] as const;
type EventName = (typeof events)[number];
type EventPhase = "start" | "end";
type EvenString = `${EventName}/${EventPhase}`;

const participant = process.env.REACT_APP_PARTICIPANT;
const { name: site } = useSite();
const { design } = useDesignMode();

// eventString is a string that represents the event, e.g. 'cookies/start'
export const sendEvent = (eventString: EvenString) => {
  const path = `${participant}/${site}/${design}/${eventString}`;
  console.log(`${path}`);
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
