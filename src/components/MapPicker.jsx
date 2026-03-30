import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Check, Loader, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 15, { duration: 1 });
  }, [position, map]);
  return null;
}

async function searchPlaces(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { 'Accept-Language': 'en' } }
    );
    return await res.json();
  } catch {
    return [];
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

const MapPicker = ({ isOpen, onClose, onConfirm, label, color = 'red' }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef(null);
  const defaultCenter = [28.6139, 77.209];

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      setAddress('');
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(searchTimeout.current);
    if (val.trim().length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchPlaces(val);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setSearching(false);
    }, 500);
  };

  const handleSearchSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition({ lat, lng });
    setAddress(result.display_name);
    setSearchQuery(result.display_name);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleMapClick = async (latlng) => {
    setPosition(latlng);
    setLoading(true);
    const addr = await reverseGeocode(latlng.lat, latlng.lng);
    setAddress(addr);
    setLoading(false);
  };

  const handleLocateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latlng = { lat: coords.latitude, lng: coords.longitude };
        setPosition(latlng);
        setLoading(true);
        const addr = await reverseGeocode(latlng.lat, latlng.lng);
        setAddress(addr);
        setLoading(false);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleConfirm = () => {
    if (!position || !address) return;
    onConfirm({ address, lat: position.lat, lng: position.lng });
    onClose();
  };

  if (!isOpen) return null;

  const icon = color === 'red' ? redIcon : blueIcon;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <MapPin className={`w-5 h-5 ${color === 'red' ? 'text-red-500' : 'text-blue-500'}`} />
            <h3 className="font-black text-gray-900">Pick {label}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-gray-100 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
            {searching && <Loader className="absolute right-3 w-4 h-4 text-gray-400 animate-spin" />}
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a place…"
              className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
          </div>
          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[600] overflow-hidden">
              {searchResults.map((r) => (
                <li
                  key={r.place_id}
                  onClick={() => handleSearchSelect(r)}
                  className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 line-clamp-1"
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div className="relative" style={{ height: 340 }}>
          <MapContainer
            center={defaultCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onMapClick={handleMapClick} />
            <FlyTo position={position} />
            {position && <Marker position={[position.lat, position.lng]} icon={icon} />}
          </MapContainer>

          {/* Instruction overlay */}
          {!position && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-700 pointer-events-none">
              Search or tap the map to pin location
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-3">
          {/* Address preview */}
          <div className="min-h-[2.5rem] flex items-center gap-2">
            {loading ? (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Loader className="w-4 h-4 animate-spin" /> Fetching address…
              </span>
            ) : address ? (
              <p className="text-sm text-gray-700 line-clamp-2">
                <span className="font-bold text-gray-900">Selected: </span>{address}
              </p>
            ) : (
              <p className="text-sm text-gray-400">No location selected yet</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {locating ? <Loader className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              Use My Location
            </button>
            <button
              onClick={handleConfirm}
              disabled={!position || loading}
              className={`flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${
                color === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Check className="w-4 h-4" />
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Need Navigation icon too
function Navigation({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export default MapPicker;
