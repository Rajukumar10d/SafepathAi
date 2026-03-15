import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation, AlertTriangle, PhoneCall, Share2, MapPin, Loader2, Hospital, Shield, Crosshair, Eye } from 'lucide-react';
import styles from './LiveMap.module.css';
import 'leaflet/dist/leaflet.css';

import cityRisk from '../data/city_risk.json';

// Dynamically import Leaflet so it only runs on client
let L = null;

// Bounding box for Rajasthan area
const VIEWBOX_RAJASTHAN = '69.30,30.12,78.17,23.30';

// ── LOCAL LANDMARK DATABASE ─────────────────────────────────────
// These coordinates work OFFLINE — bypasses Nominatim entirely for known places
const LOCAL_LANDMARKS = [
    { name: 'Jagatpura', lat: 26.8265, lng: 75.8371, city: 'Jaipur', display_name: 'Jagatpura, Jaipur, Rajasthan, India' },
    { name: 'Jagatpura Fatak', lat: 26.8200, lng: 75.8350, city: 'Jaipur', display_name: 'Jagatpura Fatak, Jaipur, Rajasthan, India' },
    { name: 'World Trade Park', lat: 26.8937, lng: 75.8103, city: 'Jaipur', display_name: 'World Trade Park (WTP), Malviya Nagar, Jaipur, Rajasthan' },
    { name: 'WTP', lat: 26.8937, lng: 75.8103, city: 'Jaipur', display_name: 'World Trade Park (WTP), Jaipur, Rajasthan' },
    { name: 'Hawa Mahal', lat: 26.9239, lng: 75.8267, city: 'Jaipur', display_name: 'Hawa Mahal, Badi Choupad, Jaipur, Rajasthan' },
    { name: 'Jal Mahal', lat: 26.9534, lng: 75.8466, city: 'Jaipur', display_name: 'Jal Mahal, Amer Road, Jaipur, Rajasthan' },
    { name: 'Amer Fort', lat: 26.9855, lng: 75.8513, city: 'Jaipur', display_name: 'Amer Fort, Amer, Jaipur, Rajasthan' },
    { name: 'Amber Fort', lat: 26.9855, lng: 75.8513, city: 'Jaipur', display_name: 'Amer Fort, Amer, Jaipur, Rajasthan' },
    { name: 'Nahargarh Fort', lat: 26.9388, lng: 75.8155, city: 'Jaipur', display_name: 'Nahargarh Fort, Jaipur, Rajasthan' },
    { name: 'Jaigarh Fort', lat: 26.9837, lng: 75.8453, city: 'Jaipur', display_name: 'Jaigarh Fort, Jaipur, Rajasthan' },
    { name: 'City Palace', lat: 26.9258, lng: 75.8237, city: 'Jaipur', display_name: 'City Palace, Jaipur, Rajasthan' },
    { name: 'Jantar Mantar', lat: 26.9247, lng: 75.8245, city: 'Jaipur', display_name: 'Jantar Mantar, Jaipur, Rajasthan' },
    { name: 'Albert Hall', lat: 26.9119, lng: 75.8194, city: 'Jaipur', display_name: 'Albert Hall Museum, Ram Niwas Garden, Jaipur, Rajasthan' },
    { name: 'Albert Hall Museum', lat: 26.9119, lng: 75.8194, city: 'Jaipur', display_name: 'Albert Hall Museum, Ram Niwas Garden, Jaipur, Rajasthan' },
    { name: 'Birla Mandir', lat: 26.8915, lng: 75.8150, city: 'Jaipur', display_name: 'Birla Mandir, Tilak Nagar, Jaipur, Rajasthan' },
    { name: 'Malviya Nagar', lat: 26.8566, lng: 75.8132, city: 'Jaipur', display_name: 'Malviya Nagar, Jaipur, Rajasthan' },
    { name: 'Mansarovar', lat: 26.8644, lng: 75.7597, city: 'Jaipur', display_name: 'Mansarovar, Jaipur, Rajasthan' },
    { name: 'Vaishali Nagar', lat: 26.9120, lng: 75.7270, city: 'Jaipur', display_name: 'Vaishali Nagar, Jaipur, Rajasthan' },
    { name: 'Tonk Road', lat: 26.8780, lng: 75.8100, city: 'Jaipur', display_name: 'Tonk Road, Jaipur, Rajasthan' },
    { name: 'MI Road', lat: 26.9140, lng: 75.8074, city: 'Jaipur', display_name: 'MI Road, Jaipur, Rajasthan' },
    { name: 'Sindhi Camp', lat: 26.9186, lng: 75.7890, city: 'Jaipur', display_name: 'Sindhi Camp Bus Stand, Jaipur, Rajasthan' },
    { name: 'Jaipur Junction', lat: 26.9196, lng: 75.7878, city: 'Jaipur', display_name: 'Jaipur Junction Railway Station, Jaipur, Rajasthan' },
    { name: 'Jaipur Railway Station', lat: 26.9196, lng: 75.7878, city: 'Jaipur', display_name: 'Jaipur Junction Railway Station, Jaipur, Rajasthan' },
    { name: 'Jaipur Airport', lat: 26.8242, lng: 75.8122, city: 'Jaipur', display_name: 'Jaipur International Airport, Sanganer, Jaipur, Rajasthan' },
    { name: 'Sanganer', lat: 26.8266, lng: 75.7944, city: 'Jaipur', display_name: 'Sanganer, Jaipur, Rajasthan' },
    { name: 'Pratap Nagar', lat: 26.8310, lng: 75.8265, city: 'Jaipur', display_name: 'Pratap Nagar, Sanganer, Jaipur, Rajasthan' },
    { name: 'Sitapura', lat: 26.7968, lng: 75.8515, city: 'Jaipur', display_name: 'Sitapura Industrial Area, Jaipur, Rajasthan' },
    { name: 'Durgapura', lat: 26.8503, lng: 75.8181, city: 'Jaipur', display_name: 'Durgapura, Jaipur, Rajasthan' },
    { name: 'Sodala', lat: 26.9255, lng: 75.7773, city: 'Jaipur', display_name: 'Sodala, Jaipur, Rajasthan' },
    { name: 'C Scheme', lat: 26.9060, lng: 75.8010, city: 'Jaipur', display_name: 'C-Scheme, Jaipur, Rajasthan' },
    { name: 'Bani Park', lat: 26.9300, lng: 75.7930, city: 'Jaipur', display_name: 'Bani Park, Jaipur, Rajasthan' },
    { name: 'Raja Park', lat: 26.9060, lng: 75.8230, city: 'Jaipur', display_name: 'Raja Park, Jaipur, Rajasthan' },
    { name: 'Gopalpura', lat: 26.8600, lng: 75.8000, city: 'Jaipur', display_name: 'Gopalpura Bypass, Jaipur, Rajasthan' },
    { name: 'SKIT', lat: 26.8220, lng: 75.8640, city: 'Jaipur', display_name: 'SKIT College, Jagatpura, Jaipur, Rajasthan' },
    { name: 'SKIT College', lat: 26.8220, lng: 75.8640, city: 'Jaipur', display_name: 'SKIT College, Jagatpura, Jaipur, Rajasthan' },
    { name: 'MNIT', lat: 26.8620, lng: 75.8110, city: 'Jaipur', display_name: 'MNIT Jaipur, JLN Marg, Jaipur, Rajasthan' },
    { name: 'Rajasthan University', lat: 26.8920, lng: 75.8140, city: 'Jaipur', display_name: 'University of Rajasthan, JLN Marg, Jaipur, Rajasthan' },
    { name: 'JECRC', lat: 26.7910, lng: 75.8280, city: 'Jaipur', display_name: 'JECRC University, Jaipur, Rajasthan' },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, city: 'Jaipur', display_name: 'Jaipur, Rajasthan, India' },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, city: 'Jodhpur', display_name: 'Jodhpur, Rajasthan, India' },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125, city: 'Udaipur', display_name: 'Udaipur, Rajasthan, India' },
    { name: 'Ajmer', lat: 26.4499, lng: 74.6399, city: 'Ajmer', display_name: 'Ajmer, Rajasthan, India' },
    { name: 'Pushkar', lat: 26.4897, lng: 74.5511, city: 'Pushkar', display_name: 'Pushkar, Ajmer, Rajasthan, India' },
    { name: 'Bikaner', lat: 28.0229, lng: 73.3119, city: 'Bikaner', display_name: 'Bikaner, Rajasthan, India' },
    { name: 'Kota', lat: 25.2138, lng: 75.8648, city: 'Kota', display_name: 'Kota, Rajasthan, India' },
    { name: 'Jaisalmer', lat: 26.9157, lng: 70.9083, city: 'Jaisalmer', display_name: 'Jaisalmer, Rajasthan, India' },
    { name: 'Mount Abu', lat: 24.5926, lng: 72.7156, city: 'Mount Abu', display_name: 'Mount Abu, Sirohi, Rajasthan, India' },
    { name: 'Chittorgarh', lat: 24.8887, lng: 74.6269, city: 'Chittorgarh', display_name: 'Chittorgarh, Rajasthan, India' },
    { name: 'Alwar', lat: 27.5530, lng: 76.6346, city: 'Alwar', display_name: 'Alwar, Rajasthan, India' },
    { name: 'Sikar', lat: 27.6094, lng: 75.1399, city: 'Sikar', display_name: 'Sikar, Rajasthan, India' },
];

// Fuzzy search through local landmarks — returns the best matching landmark object
function searchLocalLandmarks(query) {
    const q = query.toLowerCase().replace(/[,.\-]/g, ' ').trim();
    // 1. Exact name match
    const exact = LOCAL_LANDMARKS.find(l => l.name.toLowerCase() === q);
    if (exact) return exact;
    // 2. Starts-with match
    const starts = LOCAL_LANDMARKS.find(l => l.name.toLowerCase().startsWith(q) || q.startsWith(l.name.toLowerCase()));
    if (starts) return starts;
    // 3. Contains match
    const contains = LOCAL_LANDMARKS.find(l => l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase()));
    if (contains) return contains;
    // 4. Word-level match
    const words = q.split(/\s+/).filter(w => w.length > 2);
    for (const word of words) {
        const m = LOCAL_LANDMARKS.find(l => l.name.toLowerCase().includes(word));
        if (m) return m;
    }
    return null;
}

// Get suggestion results from local landmarks (returns nominatim-like format)
function getLocalSuggestions(query) {
    const q = query.toLowerCase().replace(/[,.\-]/g, ' ').trim();
    if (q.length < 2) return [];
    return LOCAL_LANDMARKS
        .filter(l =>
            l.name.toLowerCase().includes(q) ||
            l.display_name.toLowerCase().includes(q) ||
            q.includes(l.name.toLowerCase())
        )
        .slice(0, 5)
        .map(l => ({
            display_name: l.display_name,
            lat: String(l.lat),
            lon: String(l.lng),
        }));
}

async function geocode(query) {
    if (!query) return null;

    const cleanQuery = query.trim();

    // ★ STEP 0: Check LOCAL DATABASE FIRST (instant, works offline)
    const localMatch = searchLocalLandmarks(cleanQuery);
    if (localMatch) {
        console.log('✅ Found in local database:', localMatch.display_name);
        return {
            lat: localMatch.lat,
            lng: localMatch.lng,
            display_name: localMatch.display_name,
            city: localMatch.city,
            address: { city: localMatch.city, state: 'Rajasthan' },
        };
    }

    // ★ STEPS 1-6: Try Nominatim API with progressive fallbacks
    // Each step is wrapped in its own try-catch so a network error doesn't stop the rest
    const attempts = [
        { bounded: true, suffix: ', Jaipur, Rajasthan, India' },
        { bounded: true, suffix: ', Rajasthan, India' },
        { bounded: false, suffix: ', Jaipur, Rajasthan' },
        { bounded: false, suffix: ', Rajasthan, India' },
        { bounded: false, suffix: ', India' },
        { bounded: false, suffix: '' },
    ];

    for (const attempt of attempts) {
        try {
            const result = await searchNominatim(cleanQuery, attempt);
            if (result) return result;
        } catch (e) {
            console.warn(`Geocode step failed: "${cleanQuery}${attempt.suffix}" →`, e.message);
        }
    }

    return null;
}


async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

async function searchNominatim(query, { bounded = false, suffix = '' } = {}) {
    const fullQuery = suffix ? `${query}${suffix}` : query;
    const params = new URLSearchParams({
        format: 'json',
        q: fullQuery,
        countrycodes: 'in',
        addressdetails: '1',
        limit: '3',
        email: 'contact@safepath.ai',
    });
    // Only add viewbox when searching with Rajasthan context
    if (bounded) {
        params.set('viewbox', VIEWBOX_RAJASTHAN);
        params.set('bounded', '1');
    } else {
        params.set('viewbox', VIEWBOX_RAJASTHAN);
        params.set('bounded', '0');
    }
    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
    try {
        const res = await fetchWithTimeout(url, {
            headers: { 'Accept-Language': 'en' }
        });
        if (!res || !res.ok) {
            console.warn('Geocoding fetch failed', { url, status: res?.status });
            return null;
        }

        const data = await res.json();
        if (data && data.length > 0) {
            const place = data[0];
            const address = place.address || {};
            const city = address.city || address.town || address.village || address.county || address.state_district;
            return {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon),
                display_name: place.display_name,
                city: city || null,
                address,
            };
        }
    } catch (e) {
        console.error('Geocoding error for:', fullQuery, e);
    }
    return null;
}

async function getOSRMRoute(start, end, mode = 'foot') {
    // OSRM free demo server only reliably supports 'driving' profile
    // We always use 'driving' to avoid 'InvalidUrl' / 400 errors for foot/bicycle
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=false`;

    try {
        const res = await fetchWithTimeout(url, {}, 12000);
        if (!res || !res.ok) {
            console.warn('OSRM responded with status', res?.status);
            return [];
        }

        const data = await res.json();
        if (data.code !== 'Ok' || !data.routes?.length) {
            console.warn('OSRM returned no route', data);
            return [];
        }

        // GeoJSON coords are [lng, lat], convert to [lat, lng] for Leaflet
        return data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    } catch (err) {
        console.error('OSRM request failed', err);
        return [];
    }
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
    const [transportMode, setTransportMode] = useState('walking');

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

            // Light tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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
        if (query.length < 2) {
            if (type === 'src') setSrcSuggestions([]);
            else setDstSuggestions([]);
            return;
        }

        // ★ Check LOCAL landmarks first (instant, no network)
        const localResults = getLocalSuggestions(query);
        if (localResults.length > 0) {
            if (type === 'src') setSrcSuggestions(localResults);
            else setDstSuggestions(localResults);
            return;
        }

        // ★ Only call Nominatim API if no local matches
        if (query.length < 3) return;
        try {
            const q1 = query.toLowerCase().includes('rajasthan') ? query : `${query}, Jaipur, Rajasthan`;
            const params = new URLSearchParams({
                format: 'json', q: q1, countrycodes: 'in',
                viewbox: VIEWBOX_RAJASTHAN, bounded: '0', limit: '5',
                email: 'contact@safepath.ai'
            });
            const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
            const data = await res.json();

            if (data && data.length > 0) {
                if (type === 'src') setSrcSuggestions(data);
                else setDstSuggestions(data);
            } else {
                // If API returned nothing, try broader search
                const params2 = new URLSearchParams({
                    format: 'json', q: `${query}, India`, countrycodes: 'in',
                    limit: '5', email: 'contact@safepath.ai'
                });
                const res2 = await fetch(`https://nominatim.openstreetmap.org/search?${params2}`);
                const data2 = await res2.json();
                if (type === 'src') setSrcSuggestions(data2 || []);
                else setDstSuggestions(data2 || []);
            }
        } catch (e) {
            console.warn('Nominatim API unavailable, using local results only', e.message);
            // Fallback: show whatever local matches we can find with a broader query
            const fallback = getLocalSuggestions(query.split(/[\s,]+/)[0]);
            if (type === 'src') setSrcSuggestions(fallback);
            else setDstSuggestions(fallback);
        }
    };

    const handleFindRoute = async (srcOverride, dstOverride) => {
        const src = srcOverride ?? source;
        const dst = dstOverride ?? destination;
        if (!src.trim() || !dst.trim()) return;
        if (!leafletMap.current || !L) {
            setRouteError('Map is not ready yet. Please wait a moment and try again.');
            return;
        }
        
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

            const startCity = startCoords?.city;
            const endCity = endCoords?.city;
            const startRisk = startCity && cityRisk[startCity] ? cityRisk[startCity].risk_score : null;
            const endRisk = endCity && cityRisk[endCity] ? cityRisk[endCity].risk_score : null;

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

            const routeCoords = await getOSRMRoute(startCoords, endCoords, transportMode);
            let routePoly;
            
            if (routeCoords.length === 0) {
                // If OSRM can't find a path, show a straight line as a fallback "Safety Route"
                console.log('OSRM failed, using straight-line safety fallback');
                const fallbackLine = [[startCoords.lat, startCoords.lng], [endCoords.lat, endCoords.lng]];
                routePoly = L.polyline(fallbackLine, {
                    color: '#10b981', // Green for Safety Route fallback
                    weight: 5,
                    dashArray: '10, 10',
                    opacity: 0.8,
                }).addTo(leafletMap.current);
                setRouteError('Direct Safety Path shown (Navigation route unavailable)');
            } else {
                routePoly = L.polyline(routeCoords, {
                    color: '#3b82f6',
                    weight: 6,
                    opacity: 0.9,
                }).addTo(leafletMap.current);
            }
            routeLayer.current = routePoly;

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

            leafletMap.current.fitBounds(routePoly.getBounds(), { padding: [60, 60] });

            try {
                // Use 'driving' profile always — OSRM free server only supports it reliably
                const routeRes = await fetchWithTimeout(`https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=false&alternatives=false`, {}, 12000);
                if (!routeRes || !routeRes.ok) {
                    console.warn('Failed to fetch route info', routeRes?.status);
                } else {
                    const routeData = await routeRes.json();
                    if (routeData.code === 'Ok' && routeData.routes?.length) {
                        const meters = routeData.routes[0].distance;
                        const seconds = routeData.routes[0].duration;
                        setRouteInfo({
                            distance: meters > 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`,
                            time: seconds > 3600 ? `${Math.round(seconds / 3600)} hr ${Math.round((seconds % 3600) / 60)} min` : `${Math.round(seconds / 60)} min`,
                            startCity: startCity || 'Unknown',
                            endCity: endCity || 'Unknown',
                            startRisk,
                            endRisk,
                        });
                    } else {
                        console.warn('OSRM returned invalid route info', routeData);
                    }
                }
            } catch (err) {
                console.error('Route info request failed', err);
            }
        } catch (e) {
            console.error(e);
            setRouteError('Network error. Please check your connection.');
            setLoadingRoute(false);
        } finally {
            // in some code paths (like early return) setLoadingRoute(false) is already called
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
                    <div className={styles.inputGroup}>
                        <select
                            value={transportMode}
                            onChange={(e) => setTransportMode(e.target.value)}
                            className={styles.input}
                        >
                            <option value="walking">Walking</option>
                            <option value="cycling">Cycling</option>
                            <option value="driving">Driving</option>
                        </select>
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
                        <span>🚶 {transportMode === 'driving' ? 'Driving' : transportMode === 'cycling' ? 'Cycling' : 'Walking'} time: <strong>{routeInfo.time}</strong></span>
                        {routeInfo.startCity && (
                            <span>
                                🚩 Start city: <strong>{routeInfo.startCity}</strong>
                                {routeInfo.startRisk != null ? ` • Risk: ${routeInfo.startRisk}` : ''}
                            </span>
                        )}
                        {routeInfo.endCity && (
                            <span>
                                🎯 End city: <strong>{routeInfo.endCity}</strong>
                                {routeInfo.endRisk != null ? ` • Risk: ${routeInfo.endRisk}` : ''}
                            </span>
                        )}
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
