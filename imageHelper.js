// src/utils/imageHelper.js
export function normalizeImageSource(img) {
  // img may be:
  // - number (require('../assets/foo.png'))
  // - string (remote url)
  // - object with uri { uri: 'https://...' }
  if (!img) return null;
  if (typeof img === "number") return img; // local require
  if (typeof img === "string") return { uri: img }; // raw string url
  if (typeof img === "object" && img.uri) return { uri: img.uri };
  return null;
}
