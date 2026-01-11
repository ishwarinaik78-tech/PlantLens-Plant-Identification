// src/api/plantNetApi.js
import Constants from "expo-constants";

const PLANTNET_API_KEY =
  Constants.expoConfig?.extra?.PLANTNET_API_KEY ?? Constants.manifest?.extra?.PLANTNET_API_KEY ?? "";

export async function identifyPlant(imageUri) {
  if (!PLANTNET_API_KEY) {
    throw new Error("Missing PlantNet API key in app.json (expo.extra.PLANTNET_API_KEY)");
  }

  const formData = new FormData();
  formData.append("images", {
    uri: imageUri,
    name: "plant.jpg",
    type: "image/jpeg",
  });

  const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`;

  const resp = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PlantNet error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const best = data.results?.[0] ?? null;

  return {
    raw: data,
    species: best?.species?.scientificNameWithoutAuthor ?? null,
    name:
      best?.species?.commonNames?.[0] ??
      best?.species?.scientificName ??
      null,
    confidence: best?.score ? (best.score * 100).toFixed(1) : null,
    topCandidate: best ?? null,
  };
}
