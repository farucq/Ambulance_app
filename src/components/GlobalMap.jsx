import React, { useState } from 'react';
import { Globe, Siren, Layers, Map as MapIcon, Compass, Navigation } from 'lucide-react';

const GlobalMap = ({ bookings }) => {
  const [mapMode, setMapMode] = useState('streets'); // Default to free streets as requested
  const activeBookings = bookings.filter(b => b.status === 'Dispatched' || b.status === 'Critical_Dispatch');

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #0f172a; }
        .leaflet-routing-container { display: none !important; }
        .base-station { font-size: 30px; filter: drop-shadow(0 0 10px white); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([20.5937, 78.9629], 5);
        
        const streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap'
        });

        const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB'
        });

        ${mapMode === 'streets' ? 'streets.addTo(map);' : 'dark.addTo(map);'}

        const basePos = [20.5937, 78.9629];
        L.marker(basePos, { 
          icon: L.divIcon({ html: '<div class="base-station">🏢</div>', iconSize: [40, 40], className: '' })
        }).addTo(map).bindPopup('Command Central');

        const missions = ${JSON.stringify(activeBookings)};
        const markers = [basePos];

        missions.forEach(m => {
          const pPos = m.coordinates || { lat: 20.6, lng: 79.0 };
          const hPos = m.hospital_coords || { lat: pPos.lat + 0.015, lng: pPos.lng + 0.015 };

          const icons = {
             patient: L.divIcon({ html: '<div style="width: 12px; height: 12px; background: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px #ef4444;"></div>', iconSize: [14, 14], className: '' }),
             hospital: L.divIcon({ html: '<div style="font-size: 20px;">🏥</div>', iconSize: [24, 24], className: '' }),
             amb: L.divIcon({ html: '<div style="font-size: 24px; filter: drop-shadow(0 0 5px #3b82f6);">🚑</div>', iconSize: [30, 30], className: '' })
          };

          L.marker([pPos.lat, pPos.lng], { icon: icons.patient }).addTo(map);
          L.marker([hPos.lat, hPos.lng], { icon: icons.hospital }).addTo(map);
          const ambulance = L.marker(basePos, { icon: icons.amb }).addTo(map);

          const control = L.Routing.control({
            waypoints: [L.latLng(basePos[0], basePos[1]), L.latLng(pPos.lat, pPos.lng), L.latLng(hPos.lat, hPos.lng)],
            createMarker: () => null,
            addWaypoints: false,
            routeWhileDragging: false,
            lineOptions: {
              styles: [{ color: m.status === 'Critical_Dispatch' ? '#ef4444' : '#3b82f6', opacity: 0.6, weight: 4, dashArray: '5, 5' }]
            }
          }).addTo(map);

          control.on('routesfound', (e) => {
            const coords = e.routes[0].coordinates;
            let i = 0;
            const animate = () => {
              if (i < coords.length) {
                ambulance.setLatLng(coords[i]);
                i++; setTimeout(animate, 100);
              } else { i = 0; setTimeout(animate, 5000); }
            };
            animate();
          });

          markers.push([pPos.lat, pPos.lng]);
          markers.push([hPos.lat, hPos.lng]);
        });

        if (markers.length > 1) {
          map.fitBounds(L.latLngBounds(markers), { padding: [50, 50] });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="w-full h-full bg-slate-100 rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl relative group font-sans">
      <iframe key={`${mapMode}-${activeBookings.length}`} title="Global Tactical Map" className="w-full h-full opacity-90 transition-opacity group-hover:opacity-100" frameBorder="0" srcDoc={mapHtml}></iframe>
      
      {/* HUD Elements */}
      <div className="absolute top-8 right-8 flex flex-col gap-3">
         <button 
           onClick={() => setMapMode(mapMode === 'streets' ? 'dark' : 'streets')}
           className="p-4 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl text-slate-800 hover:bg-white transition-all flex items-center gap-3 shadow-2xl group/btn"
         >
           <Layers className={`w-5 h-5 transition-transform ${mapMode === 'streets' ? '' : 'rotate-180'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest">{mapMode === 'streets' ? 'Dark Protocol' : 'Standard View'}</span>
         </button>
      </div>

      <div className="absolute bottom-10 left-10 flex flex-col gap-4">
        <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 w-72">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tactical Network Online</span>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Active Units</span>
                <span className="text-sm font-black text-slate-900">{activeBookings.length} Deployed</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Navigation size={14} className="text-blue-500" />
                   <span className="text-xs font-bold text-slate-500">Live Free Routing</span>
                </div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter italic">St. OSRM Engine</span>
             </div>
          </div>
        </div>
      </div>

      {activeBookings.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 border border-slate-100 text-slate-300">
              <Siren className="w-10 h-10 animate-pulse" />
           </div>
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Operations Standby</h3>
           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 text-center">No active tactical missions currently detected<br/>in the OSRM grid</p>
        </div>
      )}
    </div>
  );
};

export default GlobalMap;
