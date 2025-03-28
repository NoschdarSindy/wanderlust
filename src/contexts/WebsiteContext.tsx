import { useMemo } from "react";
import websitesData, { WebsiteData } from "../data";

const siteName = process.env.REACT_APP_SITE;

export function useSite(): WebsiteData {
  if (!siteName || !(siteName in websitesData)) {
    throw new Error(`Invalid or missing REACT_APP_SITE: ${siteName}`);
  }

  return websitesData[siteName];
}

// @ts-ignore
const allImages = require.context("src/assets", true, /\.(jpe?g|png|webp)$/);

export function useImage(path: string): string | string[] | null {
  return useMemo(() => {
    const tryPaths = [`${siteName}/${path}`, `shared/${path}`];
    const extensions = ["jpg", "jpeg", "png", "webp"];

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
      const regex = new RegExp(`^\\${prefix}[^\\/]*\\.(jpe?g|png|webp)$`);
      const matches = allImages
        .keys()
        .filter((key: string) => key.match(regex));
      if (matches.length === 1) {
        return allImages(matches[0]);
      } else if (matches.length > 1) {
        return matches.map((match: string) => allImages(match));
      }
    }

    console.log("Image not found for path:", path);
    return null;
  }, [path, siteName]);
}
