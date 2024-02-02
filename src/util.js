import { differenceInDays } from "date-fns";

export function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const getNights = (date) =>
  Math.max(1, differenceInDays(date[0].endDate, date[0].startDate));

export const getTotalPrice = (price, date, guests) =>
  price * getNights(date) * guests.adult;
