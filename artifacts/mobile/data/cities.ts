export interface City {
  id: string;
  name: string;
  province: string;
  provinceCode: string;
  coordinate: { latitude: number; longitude: number };
  delta: number;
  neighbourhoods: string[];
}

export const CITIES: City[] = [
  {
    id: "victoria",
    name: "Victoria",
    province: "British Columbia",
    provinceCode: "BC",
    coordinate: { latitude: 48.4284, longitude: -123.3656 },
    delta: 0.04,
    neighbourhoods: ["Downtown", "James Bay", "Fairfield", "Oak Bay", "Rockland", "Saanich"],
  },
  {
    id: "vancouver",
    name: "Vancouver",
    province: "British Columbia",
    provinceCode: "BC",
    coordinate: { latitude: 49.2827, longitude: -123.1207 },
    delta: 0.06,
    neighbourhoods: ["Downtown", "Kitsilano", "Gastown", "Mount Pleasant", "Yaletown", "Commercial Drive"],
  },
  {
    id: "calgary",
    name: "Calgary",
    province: "Alberta",
    provinceCode: "AB",
    coordinate: { latitude: 51.0447, longitude: -114.0719 },
    delta: 0.06,
    neighbourhoods: ["Beltline", "Kensington", "Mission", "Inglewood", "Bridgeland", "Eau Claire"],
  },
  {
    id: "edmonton",
    name: "Edmonton",
    province: "Alberta",
    provinceCode: "AB",
    coordinate: { latitude: 53.5461, longitude: -113.4938 },
    delta: 0.06,
    neighbourhoods: ["Strathcona", "Oliver", "Garneau", "Glenora", "Ritchie", "Westmount"],
  },
  {
    id: "toronto",
    name: "Toronto",
    province: "Ontario",
    provinceCode: "ON",
    coordinate: { latitude: 43.6532, longitude: -79.3832 },
    delta: 0.06,
    neighbourhoods: ["Distillery", "The Annex", "Leslieville", "Roncesvalles", "Yorkville", "Cabbagetown"],
  },
  {
    id: "ottawa",
    name: "Ottawa",
    province: "Ontario",
    provinceCode: "ON",
    coordinate: { latitude: 45.4215, longitude: -75.6972 },
    delta: 0.05,
    neighbourhoods: ["Glebe", "Westboro", "Sandy Hill", "Hintonburg", "New Edinburgh", "Centretown"],
  },
  {
    id: "montreal",
    name: "Montréal",
    province: "Québec",
    provinceCode: "QC",
    coordinate: { latitude: 45.5017, longitude: -73.5673 },
    delta: 0.06,
    neighbourhoods: ["Plateau-Mont-Royal", "Mile End", "Outremont", "NDG", "Rosemont", "Verdun"],
  },
  {
    id: "winnipeg",
    name: "Winnipeg",
    province: "Manitoba",
    provinceCode: "MB",
    coordinate: { latitude: 49.8951, longitude: -97.1384 },
    delta: 0.05,
    neighbourhoods: ["Exchange District", "Osborne Village", "Wolseley", "St. Boniface", "River Heights", "Crescentwood"],
  },
  {
    id: "halifax",
    name: "Halifax",
    province: "Nova Scotia",
    provinceCode: "NS",
    coordinate: { latitude: 44.6488, longitude: -63.5752 },
    delta: 0.05,
    neighbourhoods: ["Downtown", "North End", "South End", "Dartmouth", "Bedford", "Fairview"],
  },
];

export const DEFAULT_CITY = CITIES[0];

export function getCityById(id: string): City {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY;
}

export type Province = {
  name: string;
  code: string;
  cities: City[];
};

export function getCitiesByProvince(): Province[] {
  const map = new Map<string, Province>();
  for (const city of CITIES) {
    if (!map.has(city.provinceCode)) {
      map.set(city.provinceCode, { name: city.province, code: city.provinceCode, cities: [] });
    }
    map.get(city.provinceCode)!.cities.push(city);
  }
  return Array.from(map.values());
}
