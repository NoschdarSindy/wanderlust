import websitesData, { WebsiteData } from "./siteData";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import locationsData from "src/lib/locationsData";
import { Design } from "src/lib/studyData";
import { useRecoilValue } from "recoil";
import { countsAtom, datesAtom, mockIndexAtom } from "src/lib/atoms";
import { differenceInDays } from "date-fns";
import { useLocation } from "react-router-dom";
import { formatDateRange } from "src/lib/util";

export function getSite(customSite?): WebsiteData & {
  isStudy: boolean;
  isHotels: boolean;
  isFlights: boolean;
  isCars: boolean;
} {
  const siteName = customSite ?? VITE_SITE;

  const site = {
    ...websitesData[siteName],
    isStudy: siteName === "study",
    isHotels: siteName === "hotels",
    isFlights: siteName === "flights",
    isCars: siteName === "cars",
  };

  if (!siteName || !(siteName in websitesData || site.isStudy)) {
    throw new Error(`Invalid or missing REACT_APP_SITE: ${siteName}`);
  }

  return site;
}

const allImages = import.meta.glob(
  "/src/assets/**/*.{jpg,jpeg,png,webp,svg,ico}",
  { query: "?url", eager: true },
) as Record<string, { default: string }>;

export function getImage(path: string): string | string[] | null {
  const siteName = VITE_SITE;
  const tryPaths = [`${siteName}/${path}`, `shared/${path}`];
  const extensions = ["jpg", "jpeg", "png", "webp", "svg", "ico"];

  // Try single image
  for (const base of tryPaths) {
    for (const ext of extensions) {
      const fullPath = `/src/assets/${base}.${ext}`;
      if (allImages[fullPath]) {
        return allImages[fullPath].default; // Found as single image
      }
    }
  }

  // Try folder with multiple images
  for (const folder of tryPaths) {
    const prefix = `/src/assets/${folder}/`;
    const regex = new RegExp(`^${prefix}[^/]*\\.(jpe?g|png|webp|svg|ico)$`);
    const matches = Object.keys(allImages).filter((key) => key.match(regex));
    if (matches.length === 1) {
      return allImages[matches[0]].default;
    } else if (matches.length > 1) {
      return matches.map((match) => allImages[match].default);
    }
  }

  console.warn("Image not found for path:", path);
  return null;
}

export function useMock(mockIndex?: number) {
  const s = getSite();
  const recoilMockIndex = useRecoilValue(mockIndexAtom);
  mockIndex ??= recoilMockIndex;
  return s.mocks[mockIndex] as any;
}

export function useThumbnail(mockIndex?: number) {
  const s = getSite();
  const recoilMockIndex = useRecoilValue(mockIndexAtom);
  mockIndex ??= recoilMockIndex;
  let accessor: number | string;

  if (s.isHotels) {
    accessor = mockIndex;
  } else {
    const mock = s.mocks[mockIndex] as any;
    if (s.isFlights) {
      accessor = mock.airline;
    } else if (s.isCars) {
      accessor = mock.image;
    }
  }

  return getImage("thumbnails")[accessor];
}

export const useNights = () => {
  const dates = useRecoilValue(datesAtom);
  return Math.max(
    1,
    differenceInDays(new Date(dates[0].endDate), new Date(dates[0].startDate)),
  );
};

export function useTotalPrice() {
  const s = getSite();
  const mockIndex = useRecoilValue(mockIndexAtom);
  const singlePrice = s.mocks[mockIndex].price;
  const counts = useRecoilValue(countsAtom);
  const factors = s.isCars ? [1] : Object.keys(s.counts).map((c) => counts[c]);

  return (
    singlePrice *
    useNights() *
    factors.filter(Boolean).reduce((a, b) => a * b, 1)
  );
}

export function getDesignMode() {
  const design = VITE_DESIGN as Design;
  return {
    design,
    isDark: design === "dark",
    isFair: design === "fair",
    isNone: false, // design === "none",
  };
}

export const getLocationsData = () => {
  const s = getSite();
  const city = VITE_CITY;
  return {
    options: s.isFlights
      ? [...new Set(Object.values(locationsData))]
      : Object.keys(locationsData),
    fakeGpsLocation: s.isFlights ? locationsData[city] : city,
  };
};

export const useWebSocketChannel: () => {
  message: any;
  sendMessage: SendJsonMessage;
} = () => {
  const channelName = "webSocketChannel";
  const wsUrl = `ws://127.0.0.1:8000/ws/${channelName}`;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl, {
    onOpen: () => console.log(`🔗 WebSocket connected to '${wsUrl}'`),
    onClose: () => console.log(`🧹 WebSocket closed for '${channelName}'`),
    onError: (event) => console.error("WebSocket error:", event),
    shouldReconnect: () => true,
    reconnectAttempts: 999999999999999,
    reconnectInterval: 1000,
  });

  return {
    message: lastJsonMessage,
    sendMessage: sendJsonMessage,
  };
};

export const useIsResultsPage = () => useLocation().pathname === "/results";
export const useIsSummaryPage = () => useLocation().pathname === "/summary";

export const useFormatDateRange = () => {
  const [{ startDate, endDate }] = useRecoilValue(datesAtom);
  return formatDateRange(startDate, endDate);
};
