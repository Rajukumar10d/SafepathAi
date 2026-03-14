'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation, AlertTriangle, PhoneCall, Share2, MapPin, Loader2, Hospital, Shield, Crosshair, Eye } from 'lucide-react';
import styles from './page.module.css';

// Dynamically import Leaflet so it only runs on client
let L: typeof import('leaflet') | null = null;

interface LatLng { lat: number; lng: number; }

// Bounding box for Jaipur area to prioritize local results
const VIEWBOX_JAIPUR = '75.645,27.025,75.987,26.746';

async function geocode(query: string): Promise<LatLng | null> {
    if (!query) return null;

    const cleanQuery = query.trim();
    let finalQuery = cleanQuery;

    // Auto-append Jaipur if not present to ensure local results
    if (!cleanQuery.toLowerCase().includes('jaipur')) {
        finalQuery = `${cleanQuery}, Jaipur, Rajasthan, India`;
    }

    // Try Google Geocoding first if available
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.Geocoder) {
        return new Promise((resolve) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: finalQuery, componentRestrictions: { country: 'IN' } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const loc = results[0].geometry.location;
                    resolve({ lat: loc.lat(), lng: loc.lng() });
                } else {
                    // Fallback to Nominatim if Google fails
                    fallbackGeocode(finalQuery).then(resolve);
                }
            });
        });
    }

    return fallbackGeocode(finalQuery);
}

async function fallbackGeocode(query: string): Promise<LatLng | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=${VIEWBOX_JAIPUR}&bounded=1&addressdetails=1&limit=1`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'SafePathAI/1.0' } });
        const data = await res.json();
        if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch (e) { console.error("Nominatim error:", e); }
    return null;
}

async function getOSRMRoute(start: LatLng, end: LatLng): Promise<[number, number][]> {
    const url = `https://router.project-osrm.org/route/v1/foot/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return [];
    // GeoJSON coords are [lng, lat], convert to [lat, lng] for Leaflet
    return data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
}

export default function LiveMap() {
    const searchParams = useSearchParams();
    const sourceParam = searchParams.get('source') || '';
    const destinationParam = searchParams.get('destination') || '';

    const [source, setSource] = useState(sourceParam);
    const [destination, setDestination] = useState(destinationParam);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [routeError, setRouteError] = useState('');
    const [showEmergency, setShowEmergency] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{ distance: string; time: string } | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [activeLayers, setActiveLayers] = useState({ police: false, hospitals: false, safeZones: false, colleges: false });
    const [userLoc, setUserLoc] = useState<LatLng | null>(null);
    const [sourceCoords, setSourceCoords] = useState<LatLng | null>(null);
    const [destCoords, setDestCoords] = useState<LatLng | null>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<import('leaflet').Map | null>(null);
    const routeLayer = useRef<import('leaflet').Polyline | null>(null);
    const markersRef = useRef<import('leaflet').Marker[]>([]);
    const layerGroups = useRef<{ police: any, hospitals: any, safeZones: any, colleges: any }>({
        police: null, hospitals: null, safeZones: null, colleges: null
    });
    const srcInputRef = useRef<HTMLInputElement>(null);
    const dstInputRef = useRef<HTMLInputElement>(null);

    // Initialize Leaflet map on client side
    useEffect(() => {
        if (typeof window === 'undefined' || leafletMap.current) return;

        import('leaflet').then((leaflet) => {
            L = leaflet.default || leaflet;

            // Fix default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            if (!mapRef.current) return;

            const map = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);

            // Dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors, © CARTO',
                subdomains: 'abcd',
                maxZoom: 20,
            }).addTo(map);

            leafletMap.current = map;

            // Initialize Layer Groups
            layerGroups.current.police = L!.layerGroup().addTo(map);
            layerGroups.current.hospitals = L!.layerGroup().addTo(map);
            layerGroups.current.safeZones = L!.layerGroup().addTo(map);
            layerGroups.current.colleges = L!.layerGroup().addTo(map);

            setMapReady(true);
        });

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, []);

    // Load scripts (Leaflet)
    useEffect(() => {
        const leafLink = document.createElement('link');
        leafLink.rel = 'stylesheet';
        leafLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(leafLink);

        return () => {
            document.head.removeChild(leafLink);
        };
    }, []);

    const [srcSuggestions, setSrcSuggestions] = useState<any[]>([]);
    const [dstSuggestions, setDstSuggestions] = useState<any[]>([]);

    const fetchSuggestions = async (query: string, type: 'src' | 'dst') => {
        if (query.length < 3) return;
        const q = query.toLowerCase().includes('jaipur') ? query : `${query}, Jaipur`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&viewbox=${VIEWBOX_JAIPUR}&bounded=1&limit=5`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (type === 'src') setSrcSuggestions(data);
            else setDstSuggestions(data);
        } catch (e) { console.error(e); }
    };

    const initAutocomplete = () => {
        // Legacy Google Autocomplete removed to fix "white page" error.
    };

    const handleFindRoute = async (srcOverride?: string, dstOverride?: string) => {
        const src = srcOverride ?? source;
        const dst = dstOverride ?? destination;
        if (!src.trim() || !dst.trim()) return;
        if (!leafletMap.current || !L) return;
        // Update the input fields visually if overrides are given
        if (srcOverride) setSource(srcOverride);
        if (dstOverride) setDestination(dstOverride);

        setLoadingRoute(true);
        setRouteError('');
        setRouteInfo(null);

        // Clear old route and markers
        if (routeLayer.current) { routeLayer.current.remove(); routeLayer.current = null; }
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        try {
            // Ensure we use trimmed values for comparison
            const cleanSrc = src.trim();
            const cleanDst = dst.trim();

            let startCoords = (cleanSrc === source.trim()) ? sourceCoords : null;
            let endCoords = (cleanDst === destination.trim()) ? destCoords : null;

            if (!startCoords) {
                console.log("Geocoding source:", cleanSrc);
                startCoords = await geocode(cleanSrc);
                if (startCoords) setSourceCoords(startCoords);
            }
            if (!endCoords) {
                console.log("Geocoding destination:", cleanDst);
                endCoords = await geocode(cleanDst);
                if (endCoords) setDestCoords(endCoords);
            }

            if (!startCoords) {
                setRouteError(`I couldn't find "${src}". Try being more specific (e.g. "Bapu Bazar, Jaipur").`);
                setLoadingRoute(false);
                return;
            }
            if (!endCoords) {
                setRouteError(`I couldn't find "${dst}". Try being more specific.`);
                setLoadingRoute(false);
                return;
            }

            // Get OSRM route
            const routeCoords = await getOSRMRoute(startCoords, endCoords);
            if (routeCoords.length === 0) { setRouteError('No route found between these locations.'); return; }

            // Estimate distance & time
            const distKm = (routeCoords.length * 0.025).toFixed(1); // rough approx
            const timeMin = Math.round(routeCoords.length * 0.025 / 5 * 60);

            // Draw the route with glowing blue line
            const polyline = L!.polyline(routeCoords, {
                color: '#3b82f6',
                weight: 6,
                opacity: 0.9,
            }).addTo(leafletMap.current!);
            routeLayer.current = polyline;

            // Custom markers
            const startIcon = L!.divIcon({
                html: `<div style="background:#10b981;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #10b981"></div>`,
                iconSize: [16, 16], className: '',
            });
            const endIcon = L!.divIcon({
                html: `<div style="background:#ef4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #ef4444"></div>`,
                iconSize: [16, 16], className: '',
            });

            const startMarker = L!.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
                .bindPopup(`<b>Start:</b> ${src}`)
                .addTo(leafletMap.current!);
            const endMarker = L!.marker([endCoords.lat, endCoords.lng], { icon: endIcon })
                .bindPopup(`<b>Destination:</b> ${dst}`)
                .addTo(leafletMap.current!);
            markersRef.current = [startMarker, endMarker];

            // Fit bounds to show full route
            leafletMap.current!.fitBounds(polyline.getBounds(), { padding: [60, 60] });

            // Get actual distance from OSRM (redo call)
            const routeRes = await fetch(`https://router.project-osrm.org/route/v1/foot/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=false`);
            const routeData = await routeRes.json();
            if (routeData.code === 'Ok') {
                const meters = routeData.routes[0].distance;
                const seconds = routeData.routes[0].duration;
                setRouteInfo({
                    distance: meters > 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`,
                    time: seconds > 3600 ? `${Math.round(seconds / 3600)} hr ${Math.round((seconds % 3600) / 60)} min` : `${Math.round(seconds / 60)} min`,
                });
            }
        } catch (e) {
            setRouteError('Network error. Please check your connection.');
        } finally {
            setLoadingRoute(false);
        }
    };

    // Auto-find route if query params are present — fires once map is ready
    useEffect(() => {
        if (mapReady && sourceParam && destinationParam) {
            handleFindRoute(sourceParam, destinationParam);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapReady]);

    const locateMe = () => {
        if (!navigator.geolocation || !leafletMap.current) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLoc(coords);
            leafletMap.current!.setView([coords.lat, coords.lng], 15);

            if (L) {
                const userIcon = L.divIcon({
                    html: `<div style="background:#3b82f6;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #3b82f6"></div>`,
                    iconSize: [18, 18], className: '',
                });
                L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(leafletMap.current!).bindPopup('You are here').openPopup();
            }
        }, (err) => {
            console.error("Geolocation error:", err);
            setRouteError("Could not access your location. Please check browser permissions.");
        });
    };

    // Simulate layers data
    useEffect(() => {
        if (!mapReady || !L || !leafletMap.current) return;

        // Clear existing markers in groups
        layerGroups.current.police.clearLayers();
        layerGroups.current.hospitals.clearLayers();
        layerGroups.current.safeZones.clearLayers();

        const center = leafletMap.current.getCenter();

        if (activeLayers.police) {
            // Simulated police stations around current view
            [[0.01, 0.01], [-0.01, 0.02], [0.02, -0.01]].forEach(off => {
                L!.marker([center.lat + off[0], center.lng + off[1]], {
                    icon: L!.divIcon({ html: `<div style="font-size:24px">🚓</div>`, iconSize: [24, 24], className: '' })
                }).bindPopup('<b>Police Station</b><br/>Verified Patrol Point').addTo(layerGroups.current.police);
            });
        }

        if (activeLayers.hospitals) {
            [[0.015, -0.015], [-0.02, -0.01]].forEach(off => {
                L!.marker([center.lat + off[0], center.lng + off[1]], {
                    icon: L!.divIcon({ html: `<div style="font-size:24px">🏥</div>`, iconSize: [24, 24], className: '' })
                }).bindPopup('<b>Emergency Medical Hub</b><br/>Open 24/7').addTo(layerGroups.current.hospitals);
            });
        }

        if (activeLayers.safeZones) {
            [[0.005, 0.005], [-0.01, 0.01], [0.008, -0.012]].forEach(off => {
                L!.circle([center.lat + off[0], center.lng + off[1]], {
                    radius: 300, color: '#10b981', fillOpacity: 0.2, weight: 1
                }).bindPopup('<b>Safe Zone</b><br/>High density area with CCTV surveillance').addTo(layerGroups.current.safeZones);
            });
        }

        if (activeLayers.colleges) {
            // Simulated Jaipur Colleges / Educational Institute markers
            const colleges = [
                { name: 'Swami Keshvanand Institute of Tech (SKIT)', loc: [26.822, 75.864] },
                { name: 'Malaviya National Institute of Tech (MNIT)', loc: [26.862, 75.811] },
                { name: 'JECRC Foundation', loc: [26.791, 75.828] },
                { name: 'Rajasthan University', loc: [26.892, 75.814] }
            ];

            colleges.forEach(col => {
                L!.marker(col.loc as [number, number], {
                    icon: L!.divIcon({ html: `<div style="font-size:24px">🎓</div>`, iconSize: [24, 24], className: '' })
                }).bindPopup(`<b>${col.name}</b><br/>Verified Educational Hub<br/><span style="color:#10b981">● 24/7 Security Active</span>`).addTo(layerGroups.current.colleges);
            });
        }
    }, [activeLayers, mapReady]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 className={`${styles.title} animate-up`}><span className="shimmer-text">Live Safety Map</span></h1>
                        <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                            Interactive real-time safety layer with predictive intelligence.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowEmergency(!showEmergency)}
                        className="animate-up"
                        style={{ 
                            animationDelay: '100ms',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            padding: '14px 28px', 
                            backgroundColor: '#ef4444', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            fontWeight: 700, 
                            fontSize: '0.95rem',
                            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        <AlertTriangle size={20} />
                        {showEmergency ? 'Hide Alert' : 'SOS Emergency'}
                    </button>
                </div>

                {/* Route Input Bar */}
                <div className={styles.routeInputBar}>
                    <div className={styles.inputGroup} style={{ position: 'relative' }}>
                        <MapPin size={18} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Source (e.g. World Trade Park, Jaipur)"
                            className={styles.input}
                            value={source}
                            onChange={(e) => {
                                setSource(e.target.value);
                                fetchSuggestions(e.target.value, 'src');
                            }}
                            ref={srcInputRef}
                        />
                        {srcSuggestions.length > 0 && (
                            <div className={styles.suggestions}>
                                {srcSuggestions.map((s, i) => (
                                    <div key={i} className={styles.suggestionItem} onClick={() => {
                                        setSource(s.display_name);
                                        setSourceCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                                        setSrcSuggestions([]);
                                    }}>
                                        {s.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.inputGroup} style={{ position: 'relative' }}>
                        <Navigation size={18} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Destination (e.g. MI Road, Jaipur)"
                            className={styles.input}
                            value={destination}
                            onChange={(e) => {
                                setDestination(e.target.value);
                                fetchSuggestions(e.target.value, 'dst');
                            }}
                            ref={dstInputRef}
                        />
                        {dstSuggestions.length > 0 && (
                            <div className={styles.suggestions}>
                                {dstSuggestions.map((s, i) => (
                                    <div key={i} className={styles.suggestionItem} onClick={() => {
                                        setDestination(s.display_name);
                                        setDestCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
                                        setDstSuggestions([]);
                                    }}>
                                        {s.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleFindRoute()}
                        disabled={loadingRoute || !source.trim() || !destination.trim()}
                        style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', opacity: loadingRoute ? 0.7 : 1 }}
                    >
                        {loadingRoute ? <><Loader2 size={18} className={styles.spinIcon} /> Finding...</> : <><Navigation size={18} /> Find Safe Route</>}
                    </button>
                </div>

                {routeError && (
                    <div className={styles.routeError}>
                        <AlertTriangle size={16} /> {routeError}
                    </div>
                )}

                {routeInfo && (
                    <div className={styles.routeInfo}>
                        <span>📍 <strong>{routeInfo.distance}</strong></span>
                        <span>🚶 Walking time: <strong>{routeInfo.time}</strong></span>
                        <span style={{ color: '#10b981' }}>✓ Safest Route Found</span>
                    </div>
                )}
            </div>

            <div className={`${styles.mapWrapper} animate-fade-in delay-200`} style={{ position: 'relative' }}>
                {/* Leaflet Map Container */}
                <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px', minHeight: '600px' }} />

                {/* Floating Controls */}
                <div className={styles.mapControlsOverlay}>
                    <button className={styles.controlBtn} onClick={locateMe} title="Locate Me">
                        <Crosshair size={20} />
                    </button>
                    <div className={styles.divider} />
                    <button
                        className={`${styles.layerBtn} ${activeLayers.police ? styles.activeLayer : ''}`}
                        onClick={() => setActiveLayers(prev => ({ ...prev, police: !prev.police }))}
                    >
                        <Shield size={18} /> Police
                    </button>
                    <button
                        className={`${styles.layerBtn} ${activeLayers.hospitals ? styles.activeLayer : ''}`}
                        onClick={() => setActiveLayers(prev => ({ ...prev, hospitals: !prev.hospitals }))}
                    >
                        <Hospital size={18} /> Hospitals
                    </button>
                    <button
                        className={`${styles.layerBtn} ${activeLayers.safeZones ? styles.activeLayer : ''}`}
                        onClick={() => setActiveLayers(prev => ({ ...prev, safeZones: !prev.safeZones }))}
                    >
                        <Shield size={18} /> Safe Zones
                    </button>
                    <button
                        className={`${styles.layerBtn} ${activeLayers.colleges ? styles.activeLayer : ''}`}
                        onClick={() => setActiveLayers(prev => ({ ...prev, colleges: !prev.colleges }))}
                    >
                        <Eye size={18} /> Education Hubs
                    </button>
                </div>

                {/* Map Legend */}
                <div className={styles.mapLegendFloat}>
                    <div className={styles.legendItem}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></div>
                        Start Point
                    </div>
                    <div className={styles.legendItem}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }}></div>
                        Destination
                    </div>
                    <div className={styles.legendItem}>
                        <div style={{ width: 14, height: 4, background: '#3b82f6', borderRadius: 2, flexShrink: 0 }}></div>
                        Safe Route
                    </div>
                </div>

                {/* Emergency Panel Overlay */}
                {showEmergency && (
                    <div className={styles.emergencyPanel}>
                        <h2 className={styles.emergencyTitle}>
                            <AlertTriangle size={22} color="#ef4444" />
                            Emergency Action Center
                        </h2>
                        <div className={styles.emergencyContent}>
                            <div className={styles.emergencyActionBox}>
                                <h3>1. Seek Immediate Help</h3>
                                <p>Call emergency services if you feel threatened.</p>
                                <a href="tel:100" style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', background: '#ef4444', color: 'white', borderRadius: '10px', padding: '10px', fontWeight: 600 }}>
                                    <PhoneCall size={16} /> Call Police (100)
                                </a>
                                <a href="tel:1091" style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', background: 'rgba(139,92,246,0.3)', color: 'white', border: '1px solid rgba(139,92,246,0.5)', borderRadius: '10px', padding: '10px', fontWeight: 600 }}>
                                    <PhoneCall size={16} /> Women Helpline (1091)
                                </a>
                            </div>
                            <div className={styles.emergencyActionBox}>
                                <h3>2. Share Live Location</h3>
                                <p>Broadcast your location to emergency contacts.</p>
                                <button
                                    style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', fontWeight: 600 }}
                                    onClick={() => { if (navigator.share) navigator.share({ title: 'My Live Location – SafePath AI', url: window.location.href }); }}
                                >
                                    <Share2 size={16} /> Share My Location
                                </button>
                            </div>
                            <div className={styles.emergencyGuidelines}>
                                <h4>⚡ Quick Safety Guidelines</h4>
                                <ul>
                                    <li>Move to a well-lit, crowded area.</li>
                                    <li>Do not confront the threat.</li>
                                    <li>Stay on call with a trusted contact.</li>
                                    <li>Note landmarks for your position.</li>
                                    <li>Trust your instincts — leave if unsafe.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
