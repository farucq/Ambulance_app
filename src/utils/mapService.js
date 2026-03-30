// Map Service to fetch actual hospitals near a location using OpenStreetMap Overpass API
// This is free and doesn't require API keys.

export const fetchNearbyHospitals = async (lat, lng) => {
  try {
    // Overpass API query: find elements with [amenity=hospital] within 30km radius
    const radius = 30000; // 30km
    const query = `[out:json];nwr["amenity"="hospital"](around:${radius},${lat},${lng});out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from Overpass');
    
    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      // Return the list of hospitals found
      return data.elements.map(h => {
        const hLat = h.lat || (h.center && h.center.lat);
        const hLon = h.lon || (h.center && h.center.lon);
        return {
          name: h.tags?.name || 'Emergency Medical Center',
          lat: hLat,
          lng: hLon,
          distance: calculateDistance(lat, lng, hLat, hLon).toFixed(1) + ' km',
          rawDistance: calculateDistance(lat, lng, hLat, hLon)
        };
      }).filter(h => h.lat && h.lng)
        .sort((a, b) => a.rawDistance - b.rawDistance)
        .slice(0, 5);
    }
    
    return null;
  } catch (error) {
    console.error('Hospital search error:', error);
    return null;
  }
};

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
