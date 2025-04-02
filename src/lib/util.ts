import { differenceInDays } from "date-fns";

export const pluralize = (count, noun) => {
  const suffix = noun === "child" ? "ren" : "s";
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
};

export const getNights = (date) =>
  Math.max(
    1,
    differenceInDays(new Date(date[0].endDate), new Date(date[0].startDate)),
  );

export const getTotalPrice = (price, date, guests) =>
  price * getNights(date) * guests.adult * guests.room;

export const getCssVariable = (variableName: string): string => {
  const formattedVariableName = variableName.startsWith("--")
    ? variableName
    : `--${variableName}`;

  return getComputedStyle(document.documentElement)
    .getPropertyValue(formattedVariableName)
    .trim();
};

export default getCssVariable;
