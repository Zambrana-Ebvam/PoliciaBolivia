export async function fetchRoute(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) return null;

    return data.routes[0]; // geometry + duration + distance
  } catch (err) {
    console.error("OSRM routing error:", err);
    return null;
  }
}
