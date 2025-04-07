import websitesData, { WebsiteData } from "./siteData";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import locationsData from "src/lib/locationsData";
import { Design, designs } from "src/lib/studyData";

const siteName = process.env.REACT_APP_SITE;
const design = process.env.REACT_APP_DESIGN as Design;

export function getSite(): WebsiteData & {
  isStudy: boolean;
  isHotels: boolean;
  isFlights: boolean;
  isCars: boolean;
} {
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

export function useImage(path: string): string | string[] | null {
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

  console.log("Image not found for path:", path);
  return null;
}

export function getDesignMode() {
  if (!design || !designs.includes(design)) {
    throw new Error(`Invalid or missing REACT_APP_DESIGN: ${design}`);
  }

  return {
    design: design,
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
