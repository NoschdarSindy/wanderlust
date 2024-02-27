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
      startDate: new Date().toISOString(),
      endDate: add(new Date(), { days: 1 }).toISOString(),
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
});

export const confirmshamingDoneAtom = atom({
  key: "confirmshamingDone",
  default: false,
});

export const askedForLocationAtom = atom({
  key: "askedForLocation",
  default: false,
});

export const showSkipPaymentButtonAtom = atom({
  key: "showSkipPaymentButton",
  default: false,
});

export const showSkipIdButtonAtom = atom({
  key: "showSkipIdButton",
  default: false,
});

export const cameraAccessGrantedAtom = atom({
  key: "cameraAccessGranted",
  default: false,
});
