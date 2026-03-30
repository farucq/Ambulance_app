const lat = 28.6139;
const lng = 77.2090;
const radius = 5000;
const query = `[out:json];nwr["amenity"="hospital"](around:${radius},${lat},${lng});out center;`;
const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
      console.log(`Found ${data.elements?.length} elements.`);
      if (data.elements && data.elements.length > 0) {
        const mapped = data.elements.map(h => {
          const hLat = h.lat || (h.center && h.center.lat);
          const hLon = h.lon || (h.center && h.center.lon);
          return {
            name: h.tags?.name || 'Emergency Medical Center',
            lat: hLat,
            lng: hLon,
            type: h.type
          };
        }).filter(h => h.lat && h.lng);
        console.log("Top 5:", mapped.slice(0, 5));
      }
  })
  .catch(err => console.error(err));
