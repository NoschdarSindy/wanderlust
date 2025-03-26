import { atom } from "recoil";
import { add } from "date-fns";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: localStorage,
  converter: JSON,
});

export interface Guests {
  adult: number;
  children: number;
  room: number;
}

export interface DateRangeItem {
  startDate: string; // ISO format
  endDate: string;
}

export const destinationAtom = atom<string>({
  key: "destination",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const guestsAtom = atom<Guests>({
  key: "guests",
  default: {
    adult: 1,
    children: 0,
    room: 1,
  },
  effects_UNSTABLE: [persistAtom],
});

export const datesAtom = atom<DateRangeItem[]>({
  key: "date",
  default: [
    {
      startDate: new Date().toISOString(),
      endDate: add(new Date(), { days: 1 }).toISOString(),
    },
  ],
  effects_UNSTABLE: [persistAtom],
});

export const hotelAtom = atom<number>({
  key: "hotel",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const askedForCookiesAtom = atom<boolean>({
  key: "askedForCookies",
  default: false,
});

export const confirmshamingDoneAtom = atom<boolean>({
  key: "confirmshamingDone",
  default: false,
});

export const askedForLocationAtom = atom<boolean>({
  key: "askedForLocation",
  default: false,
});

export const showSkipPaymentButtonAtom = atom<boolean>({
  key: "showSkipPaymentButton",
  default: false,
});

export const showSkipIdButtonAtom = atom<boolean>({
  key: "showSkipIdButton",
  default: false,
});

export const cameraAccessGrantedAtom = atom<boolean>({
  key: "cameraAccessGranted",
  default: false,
});
