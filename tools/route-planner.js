// Route Planner JavaScript
// Handles map initialization, route plotting, and historical overlay

(function() {
    'use strict';

    // Global state
    let map;
    let waypoints = [];
    let routeLayer = null;
    let routeOutlineLayer = null; // Track outline separately
    let waypointMarkers = [];
    let baseLayer = null; // Track current base layer
    let historicalOverlay = null;
    let currentUnits = 'km';
    let isLoadingRoute = false;
    let routeMode = 'auto'; // 'auto' or 'direct'
    let routingEngine = 'brouter'; // Only using Brouter now

    // API Configuration
    const API_CONFIG = {
        brouter: {
            baseUrl: 'https://brouter.de/brouter',
            profile: 'trekking' // trekking, fastbike, safety, etc.
        }
    };

    // Base map layers configuration
    const BASE_MAPS = {
        'openstreetmap': {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            name: 'OpenStreetMap'
        },
        'opentopomap': {
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap',
            maxZoom: 17,
            name: 'OpenTopoMap (Hiking)'
        },
        'cyclosm': {
            url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors, CyclOSM',
            maxZoom: 20,
            name: 'CyclOSM (Cycling)'
        },
        'satellite': {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: '© Esri',
            maxZoom: 19,
            name: 'Satellite'
        }
    };

    // Configuration
    const CONFIG = {
        defaultCenter: [54.5, -4.0], // Center of UK
        defaultZoom: 6,
        maxZoom: 18,
        waypointIcon: {
            radius: 8,
            fillColor: '#FF6B35',
            color: '#FFE5B4',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        },
        routeStyle: {
            color: '#FF4500', // Ember orange-red
            weight: 6,
            opacity: 1,
            smoothFactor: 1,
            lineCap: 'round',
            lineJoin: 'round'
        },
        routeOutlineStyle: {
            color: '#FF6B35', // Brighter orange glow
            weight: 10,
            opacity: 0.5,
            smoothFactor: 1,
            lineCap: 'round',
            lineJoin: 'round'
        },
        walkingSpeedKmh: 5 // Average walking speed
    };

    // Historical map configurations
    const HISTORICAL_MAPS = {
        'os-6inch-1st-gb': {
            url: 'https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png',
            attribution: '© National Library of Scotland',
            maxZoom: 15,
            name: 'OS 6-inch Scotland 1888-1913'
        },
        'os-25inch-gb': {
            url: 'https://mapseries-tilesets.s3.amazonaws.com/25inch/{z}/{x}/{y}.png',
            attribution: '© National Library of Scotland',
            maxZoom: 17,
            name: 'OS 25-inch Scotland 1892-1914'
        },
        'os-1inch-gb': {
            url: 'https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png',
            attribution: '© National Library of Scotland',
            maxZoom: 15,
            name: 'OS One-Inch England & Wales'
        },
        'roy-lowlands': {
            url: 'https://mapseries-tilesets.s3.amazonaws.com/roy/{z}/{x}/{y}.png',
            attribution: '© National Library of Scotland',
            maxZoom: 14,
            name: 'Roy Military Survey 1747-1755'
        }
    };

    // Initialize the application
    function init() {
        console.log('Initializing Route Planner...');
        initMap();
        initControls();
        initMobileFeatures();
        initCTABanner();
        getUserLocation();
        
        // Load route from URL if present
        loadRouteFromURL();
    }

    // Initialize the map
    function initMap() {
        try {
            // Create map
            map = L.map('map', {
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: false, // Disable to prevent interference with waypoint placement
                boxZoom: true,
                keyboard: true,
                dragging: true,
                touchZoom: true
            }).setView(CONFIG.defaultCenter, CONFIG.defaultZoom);

            // Add default base layer (OpenStreetMap)
            baseLayer = L.tileLayer(BASE_MAPS.openstreetmap.url, {
                attribution: BASE_MAPS.openstreetmap.attribution,
                maxZoom: BASE_MAPS.openstreetmap.maxZoom
            }).addTo(map);

            // Add click handler for adding waypoints
            map.on('click', handleMapClick);

            console.log('Map initialized successfully with OpenStreetMap');
        } catch (error) {
            console.error('Error initializing map:', error);
            showError('Failed to initialize map. Please refresh the page.');
        }
    }

    // Get user's current location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13);
                    console.log('Centered map on user location');
                },
                (error) => {
                    console.log('Could not get user location, using default center');
                }
            );
        }
    }

    // Initialize control buttons
    function initControls() {
        // Share route button
        document.getElementById('shareRouteBtn').addEventListener('click', shareRoute);
        
        // Clear route button
        document.getElementById('clearRouteBtn').addEventListener('click', clearRoute);

        // Undo button
        document.getElementById('undoBtn').addEventListener('click', undoLastWaypoint);

        // Route mode toggle
        document.querySelectorAll('input[name="routeMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                routeMode = e.target.value;
                console.log('Route mode changed to:', routeMode);
                // Redraw route with new mode if we have waypoints
                if (waypoints.length >= 2) {
                    updateRoute();
                }
            });
        });

        // Unit toggle
        document.querySelectorAll('input[name="units"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentUnits = e.target.value;
                updateDistanceDisplay();
            });
        });

        // Historical overlay toggle
        document.getElementById('overlayToggle').addEventListener('change', (e) => {
            toggleHistoricalOverlay(e.target.checked);
        });

        // Opacity slider
        document.getElementById('opacitySlider').addEventListener('input', (e) => {
            updateOverlayOpacity(e.target.value);
        });

        // Historical map selector
        document.getElementById('historicalMapSelect').addEventListener('change', (e) => {
            changeHistoricalMap(e.target.value);
        });

        // Base map selector
        document.getElementById('baseMapSelect').addEventListener('change', (e) => {
            changeBaseMap(e.target.value);
        });

        // Panel toggle for mobile
        const panelToggleBtn = document.getElementById('panelToggleBtn');
        if (panelToggleBtn) {
            panelToggleBtn.addEventListener('click', toggleSidePanel);
        }
    }

    // Initialize mobile-specific features
    function initMobileFeatures() {
        // Check if mobile
        if (window.innerWidth <= 768) {
            // Side panel starts visible on mobile
            const sidePanel = document.getElementById('sidePanel');
            sidePanel.classList.remove('collapsed');
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (map) {
                map.invalidateSize();
            }
        });
    }

    // Handle map click to add waypoint
    function handleMapClick(e) {
        if (isLoadingRoute) return;

        const { lat, lng } = e.latlng;
        addWaypoint(lat, lng);
    }

    // Add a waypoint
    function addWaypoint(lat, lng) {
        waypoints.push({ lat, lng });
        console.log(`Added waypoint ${waypoints.length}:`, { lat, lng });

        // Add marker
        const marker = L.circleMarker([lat, lng], CONFIG.waypointIcon)
            .addTo(map)
            .bindPopup(`Waypoint ${waypoints.length}`);

        // Make marker draggable using Leaflet's built-in dragging
        marker.dragging = true;
        marker.on('dragend', function(e) {
            handleWaypointDrag(e, marker);
        });

        waypointMarkers.push(marker);

        // Update route if we have at least 2 waypoints
        if (waypoints.length >= 2) {
            console.log('Triggering route update with', waypoints.length, 'waypoints');
            updateRoute();
        } else {
            console.log('Need at least 2 waypoints to create route. Current:', waypoints.length);
        }

        updateUI();
        updateURLHash(); // Update URL with new waypoint
    }

    // Handle waypoint drag
    function handleWaypointDrag(e, marker) {
        const markerIndex = waypointMarkers.indexOf(marker);
        if (markerIndex !== -1) {
            const newLatLng = marker.getLatLng();
            waypoints[markerIndex] = { lat: newLatLng.lat, lng: newLatLng.lng };
            console.log(`Waypoint ${markerIndex + 1} dragged to:`, waypoints[markerIndex]);
            updateRoute();
        }
    }

    // Update route using OSRM or direct lines
    async function updateRoute() {
        if (waypoints.length < 2) {
            console.log('Not enough waypoints to create route:', waypoints.length);
            return;
        }
        
        if (isLoadingRoute) {
            console.log('Route already loading, skipping...');
            return;
        }

        // Use direct line mode or routing engine
        if (routeMode === 'direct') {
            drawDirectRoute();
        } else {
            // Use Brouter for all auto-routing
            await updateRouteBrouter();
        }
    }

    // Draw direct lines between waypoints
    function drawDirectRoute() {
        console.log('Drawing direct route between', waypoints.length, 'waypoints');
        
        // Create a simple LineString geometry
        const coordinates = waypoints.map(wp => [wp.lng, wp.lat]);
        const geometry = {
            type: 'LineString',
            coordinates: coordinates
        };
        
        drawRoute(geometry);
        
        // Calculate total distance
        let totalDistance = 0;
        for (let i = 0; i < waypoints.length - 1; i++) {
            const wp1 = waypoints[i];
            const wp2 = waypoints[i + 1];
            totalDistance += haversineDistance(wp1.lat, wp1.lng, wp2.lat, wp2.lng);
        }
        
        updateDistanceDisplay(totalDistance);
    }

    // Update route using Brouter
    async function updateRouteBrouter() {
        isLoadingRoute = true;
        showLoading(true);

        try {
            // Build Brouter request
            // Format: lon,lat|lon,lat|lon,lat
            const lonlats = waypoints.map(wp => `${wp.lng},${wp.lat}`).join('|');
            
            // Build URL with query parameters
            const params = new URLSearchParams({
                lonlats: lonlats,
                profile: API_CONFIG.brouter.profile,
                alternativeidx: '0', // 0 = best route
                format: 'geojson'
            });

            const url = `${API_CONFIG.brouter.baseUrl}?${params.toString()}`;

            console.log('Fetching route from Brouter...');
            console.log('Using "trekking" profile optimized for trails and footpaths');
            console.log('Waypoints:', waypoints);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            console.log('Brouter response received:', data);

            // Brouter returns a FeatureCollection with a single Feature
            if (data.type === 'FeatureCollection' && data.features && data.features.length > 0) {
                const feature = data.features[0];
                const geometry = feature.geometry;
                const properties = feature.properties;
                
                console.log('✓ Route found! Distance:', properties['track-length'], 'meters');
                console.log('Ascent:', properties['filtered ascend'], 'm');
                
                drawRoute(geometry);
                
                // Brouter returns distance in meters
                const distance = properties['track-length'] || 0;
                updateDistanceDisplay(distance);
            } else {
                console.error('✗ Brouter returned no valid routes:', data);
                alert('Could not find a route between these points using Brouter.\n\nThis might mean:\n- The points are too far apart\n- No connected path exists in OpenStreetMap\n\nTry:\n- Adding intermediate waypoints\n- Using "Direct line" mode\n- Switching to another routing engine');
            }
        } catch (error) {
            console.error('✗ Error fetching route from Brouter:', error);
            
            let errorMsg = 'Failed to calculate route with Brouter: ' + error.message;
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMsg = 'Brouter server may be down or slow.\n\nThe Brouter public server is community-run and can be unavailable at times.\n\nTry:\n- Waiting a moment and trying again\n- Using "Standard (OSRM)" routing\n- Using "Direct line" mode';
            }
            
            alert(errorMsg);
        } finally {
            isLoadingRoute = false;
            showLoading(false);
        }
    }

    // Update route using GraphHopper
    async function updateRouteGraphHopper() {
        // Check if API key is configured
        if (!API_CONFIG.graphhopper.apiKey || API_CONFIG.graphhopper.apiKey === 'YOUR_GRAPHHOPPER_API_KEY_HERE') {
            console.error('GraphHopper API key not configured');
            alert('GraphHopper API key not configured.\n\nPlease add your API key to route-planner.js:\n1. Open route-planner.js\n2. Find API_CONFIG.graphhopper.apiKey\n3. Replace YOUR_GRAPHHOPPER_API_KEY_HERE with your actual key');
            return;
        }

        // Check waypoint limit for free tier
        if (waypoints.length > 5) {
            console.warn('GraphHopper free tier only allows 5 waypoints, you have', waypoints.length);
            alert(`GraphHopper free tier only allows 5 waypoints.\n\nYou have ${waypoints.length} waypoints.\n\nOptions:\n- Remove ${waypoints.length - 5} waypoint(s)\n- Switch to "Direct line" mode (no limit)\n- Switch to "Standard (OSRM)" routing (no limit)`);
            return;
        }

        isLoadingRoute = true;
        showLoading(true);

        try {
            // Build GraphHopper request
            const points = waypoints.map(wp => [wp.lat, wp.lng]);
            
            // Build URL with query parameters
            const params = new URLSearchParams({
                key: API_CONFIG.graphhopper.apiKey,
                profile: 'foot', // Use 'foot' profile (hike requires paid plan)
                points_encoded: 'false',
                elevation: 'false'
            });

            // Add all waypoints as point parameters
            points.forEach(point => {
                params.append('point', `${point[0]},${point[1]}`);
            });

            const url = `${API_CONFIG.graphhopper.baseUrl}?${params.toString()}`;

            console.log('Fetching route from GraphHopper...');
            console.log('Using "foot" profile (free tier)');
            console.log('Waypoints:', waypoints);

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
            }
            
            const data = await response.json();

            console.log('GraphHopper response received:', data);

            if (data.paths && data.paths.length > 0) {
                const route = data.paths[0];
                console.log('✓ Route found! Distance:', route.distance, 'meters');
                console.log('Time:', route.time, 'ms');
                
                // Convert GraphHopper's geometry format to GeoJSON
                const geometry = {
                    type: 'LineString',
                    coordinates: route.points.coordinates
                };
                
                drawRoute(geometry);
                updateDistanceDisplay(route.distance);
            } else {
                console.error('✗ GraphHopper returned no valid routes:', data);
                alert('Could not find a route between these points using GraphHopper.\n\nTry:\n- Moving waypoints to mapped paths\n- Using "Direct line" mode\n- Switching to "Standard (OSRM)" routing');
            }
        } catch (error) {
            console.error('✗ Error fetching route from GraphHopper:', error);
            
            // Provide helpful error messages
            let errorMsg = 'Failed to calculate route with GraphHopper: ' + error.message;
            if (error.message.includes('Too many points')) {
                errorMsg = 'GraphHopper free tier only allows 5 waypoints.\n\nYou have ' + waypoints.length + ' waypoints.\n\nPlease remove some waypoints or use "Direct line" mode.';
            }
            
            alert(errorMsg + '\n\nYou can also try "Standard (OSRM)" routing which has no waypoint limit.');
        } finally {
            isLoadingRoute = false;
            showLoading(false);
        }
    }

    // Update route using OSRM
    async function updateRouteOSRM() {
        isLoadingRoute = true;
        showLoading(true);

        try {
            // Build OSRM coordinates string
            const coords = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
            
            // Use foot profile with relaxed parameters:
            // - continue_straight=false: allows routing to deviate and take any path
            // - snapping=any: snap to ANY edge in the graph (not just main roads)
            // Note: OSRM foot profile should include all walkable ways: footpaths, tracks, paths, roads
            const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson&continue_straight=false&snapping=any`;

            console.log('Fetching route from OSRM...');
            console.log('URL:', url);
            console.log('Waypoints:', waypoints);
            console.log('Note: Using foot profile with snapping=any for maximum path coverage');

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            console.log('OSRM response received:', data);

            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                console.log('✓ Route found! Distance:', route.distance, 'meters');
                console.log('Route geometry:', route.geometry);
                drawRoute(route.geometry);
                updateDistanceDisplay(route.distance);
            } else {
                console.error('✗ OSRM returned no valid routes:', data);
                console.warn('This might mean the paths in this area are not mapped in OpenStreetMap.');
                alert('Could not find a route between these points.\n\nThis might mean:\n- The footpaths aren\'t mapped in OpenStreetMap\n- The points are in an inaccessible area\n\nTry "Direct line" mode to manually trace the path.');
            }
        } catch (error) {
            console.error('✗ Error fetching route:', error);
            alert('Failed to calculate route: ' + error.message + '\n\nTry "Direct line" mode for unmapped areas.');
        } finally {
            isLoadingRoute = false;
            showLoading(false);
        }
    }

    // Draw route on map
    function drawRoute(geometry) {
        // Remove existing route layers
        if (routeOutlineLayer) {
            map.removeLayer(routeOutlineLayer);
            routeOutlineLayer = null;
        }
        if (routeLayer) {
            map.removeLayer(routeLayer);
            routeLayer = null;
        }

        // Create new outline layer (darker glow effect)
        routeOutlineLayer = L.geoJSON(geometry, {
            style: CONFIG.routeOutlineStyle
        }).addTo(map);

        // Then draw the main glowing ember route on top
        routeLayer = L.geoJSON(geometry, {
            style: CONFIG.routeStyle
        }).addTo(map);

        console.log('Route drawn successfully with', waypoints.length, 'waypoints');

        // Fit map to route bounds only on first route
        if (waypoints.length === 2) {
            map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
        }
    }

    // Calculate and update distance display
    function updateDistanceDisplay(distanceMeters = null) {
        let distance = 0;

        if (distanceMeters !== null) {
            distance = distanceMeters;
        } else if (routeLayer) {
            // Calculate from existing route
            const geojson = routeLayer.toGeoJSON();
            distance = calculateDistance(geojson);
        }

        // Convert to current units
        let displayDistance, unit;
        if (currentUnits === 'km') {
            displayDistance = (distance / 1000).toFixed(2);
            unit = 'km';
        } else {
            displayDistance = (distance / 1609.34).toFixed(2);
            unit = 'mi';
        }

        // Update distance display
        document.getElementById('totalDistance').textContent = `${displayDistance} ${unit}`;

        // Calculate walking time (in minutes)
        const timeMinutes = Math.round((distance / 1000) / CONFIG.walkingSpeedKmh * 60);
        const hours = Math.floor(timeMinutes / 60);
        const minutes = timeMinutes % 60;
        let timeDisplay = '';
        if (hours > 0) {
            timeDisplay = `${hours}h ${minutes}min`;
        } else {
            timeDisplay = `${minutes} min`;
        }
        document.getElementById('walkingTime').textContent = timeDisplay;
    }

    // Calculate distance from GeoJSON
    function calculateDistance(geojson) {
        // Simple distance calculation
        let totalDistance = 0;
        const coords = geojson.coordinates;

        for (let i = 0; i < coords.length - 1; i++) {
            const [lng1, lat1] = coords[i];
            const [lng2, lat2] = coords[i + 1];
            totalDistance += haversineDistance(lat1, lng1, lat2, lng2);
        }

        return totalDistance;
    }

    // Haversine distance formula
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    // Initialize CTA Banner
    function initCTABanner() {
        const ctaClose = document.getElementById('ctaClose');
        const ctaBanner = document.getElementById('ctaBanner');
        
        // Check if user has closed banner before
        const bannerClosed = localStorage.getItem('veilglassCTAClosed');
        if (bannerClosed === 'true') {
            ctaBanner.classList.add('hidden');
        }
        
        // Close button handler
        if (ctaClose) {
            ctaClose.addEventListener('click', () => {
                ctaBanner.classList.add('hidden');
                localStorage.setItem('veilglassCTAClosed', 'true');
            });
        }
    }

    // Share route - encode waypoints in URL
    function shareRoute() {
        if (waypoints.length === 0) {
            alert('Please create a route first before sharing!');
            return;
        }

        // Encode waypoints and settings into URL hash
        const routeData = {
            w: waypoints.map(wp => [wp.lat.toFixed(6), wp.lng.toFixed(6)]), // waypoints
            m: routeMode, // mode
            u: currentUnits // units
        };

        // Compress to URL-safe string
        const encoded = btoa(JSON.stringify(routeData));
        const shareURL = `${window.location.origin}${window.location.pathname}#route=${encoded}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareURL).then(() => {
            // Show success message
            const btn = document.getElementById('shareRouteBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-label">Link Copied!</span>';
            btn.style.background = 'rgba(76, 175, 80, 0.3)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);

            console.log('Shareable URL:', shareURL);
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback: show URL in prompt
            prompt('Copy this link to share your route:', shareURL);
        });
    }

    // Load route from URL hash
    function loadRouteFromURL() {
        const hash = window.location.hash;
        if (!hash || !hash.includes('route=')) return;

        try {
            const encoded = hash.split('route=')[1];
            const decoded = JSON.parse(atob(encoded));

            // Restore waypoints
            if (decoded.w && Array.isArray(decoded.w)) {
                decoded.w.forEach(([lat, lng]) => {
                    addWaypoint(parseFloat(lat), parseFloat(lng));
                });

                // Restore settings
                if (decoded.m) {
                    routeMode = decoded.m;
                    document.querySelector(`input[name="routeMode"][value="${decoded.m}"]`).checked = true;
                }
                if (decoded.u) {
                    currentUnits = decoded.u;
                    document.querySelector(`input[name="units"][value="${decoded.u}"]`).checked = true;
                }

                console.log('Route loaded from URL:', decoded.w.length, 'waypoints');
            }
        } catch (error) {
            console.error('Failed to load route from URL:', error);
        }
    }

    // Update URL hash when route changes
    function updateURLHash() {
        if (waypoints.length === 0) {
            // Clear hash if no waypoints
            if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname);
            }
            return;
        }

        const routeData = {
            w: waypoints.map(wp => [wp.lat.toFixed(6), wp.lng.toFixed(6)]),
            m: routeMode,
            u: currentUnits
        };

        const encoded = btoa(JSON.stringify(routeData));
        history.replaceState(null, '', `#route=${encoded}`);
    }

    // Clear entire route
    function clearRoute() {
        // Remove all markers
        waypointMarkers.forEach(marker => map.removeLayer(marker));
        waypointMarkers = [];

        // Remove route layers
        if (routeOutlineLayer) {
            map.removeLayer(routeOutlineLayer);
            routeOutlineLayer = null;
        }
        if (routeLayer) {
            map.removeLayer(routeLayer);
            routeLayer = null;
        }

        // Clear waypoints
        waypoints = [];

        updateUI();
        updateURLHash(); // Clear URL hash
    }

    // Undo last waypoint
    function undoLastWaypoint() {
        if (waypoints.length === 0) return;

        // Remove last waypoint
        waypoints.pop();

        // Remove last marker
        const lastMarker = waypointMarkers.pop();
        if (lastMarker) {
            map.removeLayer(lastMarker);
        }

        // Update route
        if (waypoints.length >= 2) {
            updateRoute();
        } else {
            // Remove route if less than 2 waypoints
            if (routeOutlineLayer) {
                map.removeLayer(routeOutlineLayer);
                routeOutlineLayer = null;
            }
            if (routeLayer) {
                map.removeLayer(routeLayer);
                routeLayer = null;
            }
        }

        updateUI();
        updateURLHash(); // Update URL
    }

    // Change base map
    function changeBaseMap(mapType) {
        const mapConfig = BASE_MAPS[mapType];
        if (!mapConfig) return;

        // Remove current base layer
        if (baseLayer) {
            map.removeLayer(baseLayer);
        }

        // Add new base layer
        baseLayer = L.tileLayer(mapConfig.url, {
            attribution: mapConfig.attribution,
            maxZoom: mapConfig.maxZoom
        }).addTo(map);

        // Ensure base layer is at the bottom
        baseLayer.bringToBack();

        console.log('Changed base map to:', mapConfig.name);
    }

    // Toggle historical overlay
    function toggleHistoricalOverlay(show) {
        const opacityControl = document.getElementById('opacityControl');
        const mapSelector = document.getElementById('mapSelector');
        const mapInfo = document.getElementById('mapInfo');

        if (show) {
            // Add mystical transition effect
            addFogTransition();
            
            // Show controls with slight delay for effect
            setTimeout(() => {
                opacityControl.style.display = 'flex';
                mapSelector.style.display = 'flex';
                mapInfo.style.display = 'block';
            }, 300);

            // Add overlay if not already added
            if (!historicalOverlay) {
                const selectedMap = document.getElementById('historicalMapSelect').value;
                setTimeout(() => addHistoricalOverlay(selectedMap), 400);
            }
        } else {
            // Hide controls
            opacityControl.style.display = 'none';
            mapSelector.style.display = 'none';
            mapInfo.style.display = 'none';

            // Remove overlay
            if (historicalOverlay) {
                map.removeLayer(historicalOverlay);
                historicalOverlay = null;
            }
        }
    }

    // Add fog transition effect
    function addFogTransition() {
        const fogOverlay = document.createElement('div');
        fogOverlay.className = 'fog-transition';
        fogOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle, rgba(232, 227, 211, 0.3) 0%, rgba(210, 129, 23, 0.1) 50%, transparent 100%);
            z-index: 1500;
            pointer-events: none;
            animation: fogFade 1s ease-out forwards;
        `;
        
        const mapContainer = document.querySelector('.map-container');
        mapContainer.appendChild(fogOverlay);
        
        // Add animation keyframes if not already present
        if (!document.querySelector('#fogAnimation')) {
            const style = document.createElement('style');
            style.id = 'fogAnimation';
            style.textContent = `
                @keyframes fogFade {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove fog overlay after animation
        setTimeout(() => {
            if (fogOverlay.parentNode) {
                fogOverlay.parentNode.removeChild(fogOverlay);
            }
        }, 1000);
    }

    // Add historical overlay
    function addHistoricalOverlay(mapType) {
        const mapConfig = HISTORICAL_MAPS[mapType];
        if (!mapConfig) return;

        const opacity = document.getElementById('opacitySlider').value / 100;

        historicalOverlay = L.tileLayer(mapConfig.url, {
            attribution: mapConfig.attribution,
            maxZoom: mapConfig.maxZoom,
            opacity: opacity
        }).addTo(map);
    }

    // Change historical map
    function changeHistoricalMap(mapType) {
        if (historicalOverlay) {
            map.removeLayer(historicalOverlay);
            historicalOverlay = null;
        }

        if (document.getElementById('overlayToggle').checked) {
            addHistoricalOverlay(mapType);
        }
    }

    // Update overlay opacity
    function updateOverlayOpacity(value) {
        document.getElementById('opacityValue').textContent = `${value}%`;
        
        if (historicalOverlay) {
            historicalOverlay.setOpacity(value / 100);
        }
    }

    // Update UI elements
    function updateUI() {
        // Update waypoint count
        document.getElementById('waypointCount').textContent = waypoints.length;

        // Enable/disable buttons
        document.getElementById('clearRouteBtn').disabled = waypoints.length === 0;
        document.getElementById('undoBtn').disabled = waypoints.length === 0;

        // Update distance display
        if (waypoints.length === 0) {
            document.getElementById('totalDistance').textContent = '0 km';
            document.getElementById('walkingTime').textContent = '0 min';
        } else if (waypoints.length === 1) {
            updateDistanceDisplay(0);
        }
    }

    // Toggle side panel (mobile)
    function toggleSidePanel() {
        const sidePanel = document.getElementById('sidePanel');
        sidePanel.classList.toggle('collapsed');
    }

    // Show/hide loading indicator
    function showLoading(show) {
        const indicator = document.getElementById('loadingIndicator');
        indicator.style.display = show ? 'flex' : 'none';
    }

    // Show error message
    function showError(message) {
        // Simple alert for now - could be enhanced with a custom modal
        console.error(message);
        // You could add a toast notification here
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

