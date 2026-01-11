// src/api/perenualApi.js
import Constants from "expo-constants";

const PERENUAL_API_KEY =
  Constants.expoConfig?.extra?.PERENUAL_API_KEY ?? Constants.manifest?.extra?.PERENUAL_API_KEY ?? "";

export async function getPlantDetails(name) {
  if (!name) return null;
  if (!PERENUAL_API_KEY) {
    throw new Error("Missing Perenual API key in app.json (expo.extra.PERENUAL_API_KEY)");
  }

  const url = `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(
    name
  )}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Perenual error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const plant = data.data?.[0] ?? null;
  if (!plant) return null;

  return {
    watering: plant?.watering ?? null,
    sunlight: plant?.sunlight ? plant.sunlight.join(", ") : null,
    image: plant?.default_image?.regular_url ?? null,
    scientific_name: plant?.scientific_name ?? null,
    common_name: plant?.common_name ?? null,
    raw: plant,
  };
}
