const ACCESS_KEY = "PTzwX7O__5rAh7GzNimFMYbSQuwDMT7Iz_4uEIyXHQ0";

export async function fetchPlantImages({ query = "plants", per_page = 20, page = 1 } = {}) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=${per_page}&page=${page}&client_id=${ACCESS_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Unsplash error: ${res.status} ${err}`);
  }

  const data = await res.json();

  return data.results.map(img => ({
    id: img.id,
    name: img.alt_description || img.description || "Plant",
    image: img.urls.small,
    image_full: img.urls.full,
    author: img.user.name,
    author_link: img.user.links.html,
  }));
}
