export type Site = (typeof sites)[number];
export type Design = (typeof designs)[number];

const sites = [
  "hotels",
  "flights",
  // "cars"
] as const;
const designs = [
  "dark",
  "fair",
  // "none"
] as const;

const domains = {
  hotels: "wanderlust.travel",
  flights: "flyskyway.com",
  // cars: "overdrive.cars",
} satisfies Record<Site, string>;

const sitesMap = {
  H: "hotels",
  F: "flights",
  // C: "cars",
} satisfies Record<string, Site>;

const designsMap = {
  d: "dark",
  f: "fair",
  // n: "none",
} satisfies Record<string, Design>;

// is actually full factorial design
const latinSquare: `${keyof typeof sitesMap}${keyof typeof designsMap}`[][] = [
  ["Hd", "Ff"],
  ["Ff", "Hd"],
  ["Hf", "Fd"],
  ["Fd", "Hf"],
];

const taskInfo = Object.fromEntries(
  sites.map((site) => [
    site,
    {
      todo: {
        hotels: () => "reserve any hotel in",
        flights: (city) => `book a round-trip flight from ${city} to`,
        cars: () => "book a rental car in",
      }[site],
      additionalText: {
        hotels:
          "The duration of the stay and the number of guests do not matter.",
        flights:
          "The duration of the trip and the number of passengers do not matter.",
        cars: "The drop-off location should be the same as the pick-up location. duration of the rent does not matter.",
      }[site],
      domain: domains[site],
    },
  ]),
) as Record<
  Site,
  { todo: (city?) => string; additionalText: string; domain: string }
>;

export { sites, designs, domains, sitesMap, designsMap, latinSquare, taskInfo };
