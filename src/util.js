import { differenceInDays } from "date-fns";

export const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const getNights = (date) =>
  Math.max(
    1,
    differenceInDays(new Date(date[0].endDate), new Date(date[0].startDate)),
  );

export const getTotalPrice = (price, date, guests) =>
  price * getNights(date) * guests.adult * guests.room;

// eventString is a string that represents the event, e.g. 'cookies/start'
export const sendEvent = (eventString) => {
  fetch("http://127.0.0.1:8000/" + eventString)
    .then((response) => {
      response.json().then((json) => {
        console.log(json.message);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
