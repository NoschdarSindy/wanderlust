import websitesData, { WebsiteData } from "./siteData";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import locationsData from "src/lib/locationsData";
import { Design, designs } from "src/lib/studyData";
import { useRecoilValue } from "recoil";
import { countsAtom, datesAtom, mockIndexAtom } from "src/lib/atoms";
import { differenceInDays } from "date-fns";
import { useLocation } from "react-router-dom";
import { formatDateRange } from "src/lib/util";

const siteName = process.env.REACT_APP_SITE;
const design = process.env.REACT_APP_DESIGN as Design;

export function getSite(): WebsiteData & {
  isStudy: boolean;
  isHotels: boolean;
  isFlights: boolean;
  isCars: boolean;
} {
  const siteName = process.env.REACT_APP_SITE;

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

// @ts-ignore
const allImages = require.context(
  "src/assets",
  true,
  /\.(jpe?g|png|webp|svg|ico)$/,
);

export function getImage(path: string): string | string[] | null {
  const tryPaths = [`${siteName}/${path}`, `shared/${path}`];
  const extensions = ["jpg", "jpeg", "png", "webp", "svg", "ico"];

  for (const base of tryPaths) {
    for (const ext of extensions) {
      try {
        const fullPath = `./${base}.${ext}`;
        return allImages(fullPath); // found as single image
      } catch {}
    }
  }

  for (const folder of tryPaths) {
    const prefix = `./${folder}/`;
    const regex = new RegExp(`^\\${prefix}[^\\/]*\\.(jpe?g|png|webp|svg|ico)$`);
    const matches = allImages.keys().filter((key: string) => key.match(regex));
    if (matches.length === 1) {
      return allImages(matches[0]);
    } else if (matches.length > 1) {
      return matches.map((match: string) => allImages(match));
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
  return {
    design,
    isDark: design === "dark",
    isFair: design === "fair",
    isNone: design === "none",
  };
}

export const getLocationsData = () => {
  const s = getSite();
  const city = process.env.REACT_APP_CITY;
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
