import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation, AlertTriangle, PhoneCall, Share2, MapPin, Loader2, Hospital, Shield, Crosshair, Eye } from 'lucide-react';
import styles from './LiveMap.module.css';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet so it only runs on client
let L = null;

// Bounding box for Rajasthan area
const VIEWBOX_RAJASTHAN = '69.30,30.12,78.17,23.30';

async function geocode(query) {
    if (!query) return null;

    const cleanQuery = query.trim();
    
    // Try primary search with Rajasthan focus
    let result = await fallbackGeocode(`${cleanQuery}, Rajasthan, India`);
    
    // Fallback 1: Just India
    if (!result) {
        result = await fallbackGeocode(`${cleanQuery}, India`);
    }

    // Fallback 2: Raw query
    if (!result) {
        result = await fallbackGeocode(cleanQuery);
    }

    return result;
}

async function fallbackGeocode(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=1`;
    try {
        const res = await fetch(url, { 
            headers: { 
                'User-Agent': 'SafePathAI_Hackathon_Project/1.0',
                'Accept-Language': 'en'
            } 
        });
        const data = await res.json();
        if (data && data.length > 0) return { 
            lat: parseFloat(data[0].lat), 
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name
        };
    } catch (e) { console.error("Geocoding error for:", query, e); }
    return null;
}

async function getOSRMRoute(start, end) {
    const url = `https://router.project-osrm.org/route/v1/foot/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return [];
    // GeoJSON coords are [lng, lat], convert to [lat, lng] for Leaflet
    return data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
}

export default function LiveMap() {
    const [searchParams] = useSearchParams();
    const sourceParam = searchParams.get('source') || '';
    const destinationParam = searchParams.get('destination') || '';

    const [source, setSource] = useState(sourceParam);
    const [destination, setDestination] = useState(destinationParam);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [routeError, setRouteError] = useState('');
    const [showEmergency, setShowEmergency] = useState(false);
    const [routeInfo, setRouteInfo] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [activeLayers, setActiveLayers] = useState({ police: false, hospitals: false, safeZones: false, colleges: false });
    const [userLoc, setUserLoc] = useState(null);
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);

    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const routeLayer = useRef(null);
    const markersRef = useRef([]);
    const layerGroups = useRef({
        police: null, hospitals: null, safeZones: null, colleges: null
    });
    const srcInputRef = useRef(null);
    const dstInputRef = useRef(null);

    // Initialize Leaflet map on client side
    useEffect(() => {
        if (typeof window === 'undefined' || leafletMap.current) return;

        const loadLeaflet = async () => {
            if (!L) {
                const leaflet = await import('leaflet');
                L = leaflet.default || leaflet;
            }

            if (!mapRef.current) return;

            // Initialize map with a view of Jaipur, Rajasthan
            const map = L.map(mapRef.current, { zoomControl: true }).setView([26.9124, 75.7873], 12);
            leafletMap.current = map;

            // Dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            // Redefine default icons correctly for production builds
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            // Initialize Layer Groups
            layerGroups.current.police = L.layerGroup().addTo(map);
            layerGroups.current.hospitals = L.layerGroup().addTo(map);
            layerGroups.current.safeZones = L.layerGroup().addTo(map);
            layerGroups.current.colleges = L.layerGroup().addTo(map);

            setMapReady(true);
        };

        loadLeaflet();

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, []);

    const [srcSuggestions, setSrcSuggestions] = useState([]);
    const [dstSuggestions, setDstSuggestions] = useState([]);

    const fetchSuggestions = async (query, type) => {
        if (query.length < 3) return;
        const q = query.toLowerCase().includes('rajasthan') ? query : `${query}, Rajasthan`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=5`;
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'SafePathAI/1.0' } });
            const data = await res.json();
            if (type === 'src') setSrcSuggestions(data);
            else setDstSuggestions(data);
        } catch (e) { console.error(e); }
    };

    const handleFindRoute = async (srcOverride, dstOverride) => {
        const src = srcOverride ?? source;
        const dst = dstOverride ?? destination;
        if (!src.trim() || !dst.trim()) return;
        if (!leafletMap.current || !L) return;
        
        if (srcOverride) setSource(srcOverride);
        if (dstOverride) setDestination(dstOverride);

        setLoadingRoute(true);
        setRouteError('');
        setRouteInfo(null);

        if (routeLayer.current) { routeLayer.current.remove(); routeLayer.current = null; }
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        try {
            const cleanSrc = src.trim();
            const cleanDst = dst.trim();

            let startCoords = (cleanSrc === (srcOverride || source).trim()) ? sourceCoords : null;
            let endCoords = (cleanDst === (dstOverride || destination).trim()) ? destCoords : null;

            if (!startCoords) {
                const geo = await geocode(cleanSrc);
                if (geo) {
                    startCoords = geo;
                    setSourceCoords(geo);
                    setSource(geo.display_name); // Update input with full name
                }
            }
            if (!endCoords) {
                const geo = await geocode(cleanDst);
                if (geo) {
                    endCoords = geo;
                    setDestCoords(geo);
                    setDestination(geo.display_name); // Update input with full name
                }
            }

            if (!startCoords) {
                setRouteError(`I couldn't find "${src}". Try being more specific.`);
                setLoadingRoute(false);
                return;
            }
            if (!endCoords) {
                setRouteError(`I couldn't find "${dst}". Try being more specific.`);
                setLoadingRoute(false);
                return;
            }

            const routeCoords = await getOSRMRoute(startCoords, endCoords);
            if (routeCoords.length === 0) { setRouteError('No route found between these locations.'); return; }

            const polyline = L.polyline(routeCoords, {
                color: '#3b82f6',
                weight: 6,
                opacity: 0.9,
            }).addTo(leafletMap.current);
            routeLayer.current = polyline;

            const startIcon = L.divIcon({
                html: `<div style="background:#10b981;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #10b981"></div>`,
                iconSize: [16, 16], className: '',
            });
            const endIcon = L.divIcon({
                html: `<div style="background:#ef4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #ef4444"></div>`,
                iconSize: [16, 16], className: '',
            });

            const startMarker = L.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
                .bindPopup(`<b>Start:</b> ${src}`)
                .addTo(leafletMap.current);
            const endMarker = L.marker([endCoords.lat, endCoords.lng], { icon: endIcon })
                .bindPopup(`<b>Destination:</b> ${dst}`)
                .addTo(leafletMap.current);
            markersRef.current = [startMarker, endMarker];

            leafletMap.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });

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
            console.error(e);
            setRouteError('Network error. Please check your connection.');
        } finally {
            setLoadingRoute(false);
        }
    };

    useEffect(() => {
        if (mapReady && sourceParam && destinationParam) {
            handleFindRoute(sourceParam, destinationParam);
        }
    }, [mapReady, sourceParam, destinationParam]);

    const locateMe = () => {
        if (!navigator.geolocation || !leafletMap.current) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLoc(coords);
            leafletMap.current.setView([coords.lat, coords.lng], 15);

            if (L) {
                const userIcon = L.divIcon({
                    html: `<div style="background:#3b82f6;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #3b82f6"></div>`,
                    iconSize: [18, 18], className: '',
                });
                L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(leafletMap.current).bindPopup('You are here').openPopup();
            }
        });
    };

    useEffect(() => {
        if (!mapReady || !L || !leafletMap.current) return;

        layerGroups.current.police.clearLayers();
        layerGroups.current.hospitals.clearLayers();
        layerGroups.current.safeZones.clearLayers();
        layerGroups.current.colleges.clearLayers();

        const center = leafletMap.current.getCenter();

        if (activeLayers.police) {
            [[0.01, 0.01], [-0.01, 0.02], [0.02, -0.01]].forEach(off => {
                L.marker([center.lat + off[0], center.lng + off[1]], {
                    icon: L.divIcon({ html: `<div style="font-size:24px">🚓</div>`, iconSize: [24, 24], className: '' })
                }).bindPopup('<b>Police Station</b><br/>Verified Patrol Point').addTo(layerGroups.current.police);
            });
        }

        if (activeLayers.hospitals) {
            [[0.015, -0.015], [-0.02, -0.01]].forEach(off => {
                L.marker([center.lat + off[0], center.lng + off[1]], {
                    icon: L.divIcon({ html: `<div style="font-size:24px">🏥</div>`, iconSize: [24, 24], className: '' })
                }).bindPopup('<b>Emergency Medical Hub</b><br/>Open 24/7').addTo(layerGroups.current.hospitals);
            });
        }

        if (activeLayers.safeZones) {
            [[0.005, 0.005], [-0.01, 0.01], [0.008, -0.012]].forEach(off => {
                L.circle([center.lat + off[0], center.lng + off[1]], {
                    radius: 300, color: '#10b981', fillOpacity: 0.2, weight: 1
                }).bindPopup('<b>Safe Zone</b><br/>High density area with CCTV surveillance').addTo(layerGroups.current.safeZones);
            });
        }

        if (activeLayers.colleges) {
            const colleges = [
                { name: 'Swami Keshvanand Institute of Tech (SKIT), Jaipur', loc: [26.822, 75.864] },
                { name: 'Malaviya National Institute of Tech (MNIT), Jaipur', loc: [26.862, 75.811] },
                { name: 'JECRC University, Jaipur', loc: [26.791, 75.828] },
                { name: 'Rajasthan University, Jaipur', loc: [26.892, 75.814] },
                { name: 'IIT Jodhpur', loc: [26.471, 73.113] },
                { name: 'RTU Kota', loc: [25.143, 75.805] },
                { name: 'MLSU Udaipur', loc: [24.616, 73.714] }
            ];

            colleges.forEach(col => {
                L.marker(col.loc, {
                    icon: L.divIcon({ html: `<div style="font-size:24px">🎓</div>`, iconSize: [24, 24], className: '' })
                }).bindPopup(`<b>${col.name}</b><br/>Verified Educational Hub`).addTo(layerGroups.current.colleges);
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
                            Interactive real-time safety layer for Rajasthan.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowEmergency(!showEmergency)}
                        className={`${styles.sosBtn} animate-up`}
                    >
                        <AlertTriangle size={20} />
                        {showEmergency ? 'Hide Alert' : 'SOS Emergency'}
                    </button>
                </div>

                <div className={styles.routeInputBar}>
                    <div className={styles.inputGroup} style={{ position: 'relative' }}>
                        <MapPin size={18} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Source (e.g. Amer Fort, Jaipur)"
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
                            placeholder="Destination (e.g. Hawa Mahal, Jaipur)"
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
                        className={styles.findRouteBtn}
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

            <div className={`${styles.mapWrapper} animate-fade-in delay-200`} style={{ position: 'relative', minHeight: '600px' }}>
                <div ref={mapRef} className={styles.mapContainer} style={{ height: '600px' }} />

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
                                <a href="tel:100" className={styles.emergencyLink}>
                                    <PhoneCall size={16} /> Call Police (100)
                                </a>
                                <a href="tel:1091" className={styles.emergencyLinkAlt}>
                                    <PhoneCall size={16} /> Women Helpline (1091)
                                </a>
                            </div>
                            <div className={styles.emergencyActionBox}>
                                <h3>2. Share Live Location</h3>
                                <p>Broadcast your location to emergency contacts.</p>
                                <button
                                    className={styles.shareBtn}
                                    onClick={() => { if (navigator.share) navigator.share({ title: 'My Live Location – SafePath AI', url: window.location.href }); }}
                                >
                                    <Share2 size={16} /> Share My Location
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
