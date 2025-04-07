import { differenceInDays } from "date-fns";

export const pluralize = (count, noun, nounOnly = false) => {
  const suffix = noun === "child" ? "ren" : "s";
  return `${!nounOnly ? count + " " : ""}${noun}${count !== 1 || nounOnly ? suffix : ""}`;
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

export const formatDateRange = (start: string, end: string) =>
  `${new Date(start).toLocaleDateString("en-GB")} to ${new Date(end).toLocaleDateString("en-GB")}`;

export default getCssVariable;
