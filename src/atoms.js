import { atom } from "recoil";
import { add } from "date-fns";

import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist", // this key is using to store data in local storage
  storage: localStorage, // configure which storage will be used to store the data
  converter: JSON, // configure how values will be serialized/deserialized in storage
});

export const destinationAtom = atom({
  key: "destination",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const guestsAtom = atom({
  key: "guests",
  default: {
    adult: 1,
    children: 0,
    room: 1,
  },
  effects_UNSTABLE: [persistAtom],
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
  effects_UNSTABLE: [persistAtom],
});

export const hotelAtom = atom({
  key: "hotel",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const askedForCookiesAtom = atom({
  key: "askedForCookies",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const confirmshamingDoneAtom = atom({
  key: "confirmshamingDone",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const askedForLocationAtom = atom({
  key: "askedForLocation",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
