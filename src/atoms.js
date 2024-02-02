import { atom, selector } from "recoil";
import { add } from "date-fns";

export const destinationAtom = atom({
  key: "destination",
  default: "",
});

export const guestsAtom = atom({
  key: "guests",
  default: {
    adult: 1,
    children: 0,
    room: 1,
  },
});

export const datesAtom = atom({
  key: "date",
  default: [
    {
      startDate: new Date(),
      endDate: add(new Date(), { days: 1 }),
      key: "selection",
    },
  ],
});
