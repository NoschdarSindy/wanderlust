import { atom } from "recoil";
import { add } from "date-fns";
import { recoilPersist } from "recoil-persist";
import { Site } from "src/lib/studyData";
import { getSite } from "src/lib/composables";
const { isCars } = getSite();

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: localStorage,
  converter: JSON,
});

export interface DateRangeItem {
  startDate: string; // ISO format
  endDate: string;
}

export const currentTaskAtom = atom<Site>({
  key: "task",
  effects_UNSTABLE: [persistAtom],
});

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
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      onSet(({ origin, destination }) => {
        if (isCars && origin !== destination)
          setSelf({ origin, destination: origin });
      });
    },
    persistAtom,
  ],
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
  key: "dates",
  default: [
    {
      startDate: new Date().toISOString(),
      endDate: add(new Date(), { days: 1 }).toISOString(),
    },
  ],
  effects_UNSTABLE: [persistAtom],
});

export const fullNameAtom = atom({
  key: "fullName",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const travelProtectionSelectedAtom = atom({
  key: "travelProtectionSelected",
  default: process.env.REACT_APP_DESIGN === "dark" ? "yes" : "no",
});

export const mockIndexAtom = atom<number>({
  key: "mockIndex",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const askedForCookiesAtom = atom<boolean>({
  key: "askedForCookies",
  default: false,
});

export const askedForNotificationPermissionAtom = atom<boolean>({
  key: "askedForNotificationPermission",
  default: false,
  //TODO effects_UNSTABLE: [persistAtom],
  // effects_UNSTABLE: [persistAtom],
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
