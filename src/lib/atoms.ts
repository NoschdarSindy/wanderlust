import { atom } from "recoil";
import { add } from "date-fns";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: localStorage,
  converter: JSON,
});

export interface DateRangeItem {
  startDate: string; // ISO format
  endDate: string;
}

export const showBackdropAtom = atom<boolean>({
  key: "showBackdrop",
  default: false,
});

export const locationsAtom = atom<{ origin: string; destination: string }>({
  key: "locations",
  default: {
    origin: "",
    destination: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const countsAtom = atom({
  key: "counts",
  default: {
    adult: 1,
    child: 0, // hotels, flights
    room: 1, // hotels
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
