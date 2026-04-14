const io = require('socket.io-client');
const axios = require('axios');
const DIRECT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZGFfdXNlcl9pZCI6MzEsImVtYWlsIjoic2tjb2MwMDJjZWxsQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNzcyNTMyODI4LCJleHAiOjE3NzI1MzYzNjh9.EPf5eqnUPkoCkxsJ6tV_kQuP4Xs3gqyATyd7tJIX9j8'; // <-- for quick testing, replace with a valid token or set to null to use login flow'

const API_BASE = 'http://localhost:3000/api/pda';
const SOCKET_URL = 'http://localhost:3000';

const API_KEY = 'GTP_2026_PDA_V1_API_KEY_ASDF';

const USER_EMAIL = 'skcoc002cell@gmail.com';
const USER_PASSWORD = '1234567890';

const SEND_INTERVAL = 5000; // 5 sec instead of blocking 10 sec
const MAX_QUEUE = 500;

/* ================= ROUTE ================= */

const route = [
    { lat: 12.971598, lng: 77.594562 },
    { lat: 12.962500, lng: 77.602300 },
    { lat: 12.954200, lng: 77.613800 },
    { lat: 12.945800, lng: 77.625200 },
    { lat: 12.938500, lng: 77.618500 },
    { lat: 12.931200, lng: 77.611800 },
];

/* ================= STATE ================= */

let token, tripId, socket;
let routeIndex = 0;
let locationQueue = [];
let isConnected = false;

/* ================= HELPERS ================= */

function httpHeaders() {
    return {
        'x-api-key': API_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function enqueueLocation(payload) {
    locationQueue.push(payload);
    if (locationQueue.length > MAX_QUEUE) {
        locationQueue.shift();
    }
}

function flushQueue() {
    if (!isConnected || locationQueue.length === 0) return;

    while (locationQueue.length > 0) {
        const payload = locationQueue.shift();
        socket.emit('location:update', payload);
    }
}

/* ================= AUTH ================= */

async function login() {
    if (DIRECT_TOKEN) {
        token = DIRECT_TOKEN;
        console.log('Using provided token directly.');
        return;
    }

    const res = await axios.post(
        `${API_BASE}/auth/login`,
        { email: USER_EMAIL, password: USER_PASSWORD },
        { headers: { 'x-api-key': API_KEY } }
    );

    token = res.data.data.token;
    console.log('Logged in successfully.');
}

/* ================= TRIP ================= */

async function getActiveTrip() {
    try {
        const res = await axios.post(
            `${API_BASE}/transport/users/trips/active`,
            {},
            { headers: httpHeaders() }
        );

        if (!res.data.data) {
            console.log('No active trip found.');
            process.exit(1);
        }

        tripId = res.data.data.id;
        console.log('Active trip ID:', tripId);

    } catch (err) {
        console.error('Failed to fetch active trip:', err.response?.data || err.message);
        process.exit(1);
    }
}

/* ================= SOCKET ================= */

function connectSocket() {
    return new Promise((resolve, reject) => {

        socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            isConnected = true;
            socket.emit('trip:join', tripId);
            flushQueue();
            resolve();
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            isConnected = false;
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection failed:', err.message);
        });

        socket.on('location:ack', (data) => {
            const latency = Date.now() - data.clientTs;
            console.log(`✓ ack (${latency}ms)`);
        });

        socket.on('geofence:entered', (data) => {
            console.log(`⚠️ Geofence: ${data.franchiseName} — ${data.distance}m`);
        });

        socket.on('trip:eta', (data) => {
            console.log(`🕐 ETA: ${data.duration_text} to "${data.nextStopName}"`);
        });

        socket.on('trip:status', (data) => {
            console.log('Trip status:', data?.status, '| Progress:', data?.progress + '%');
        });
    });
}

/* ================= LOCATION LOOP ================= */

function startSending() {
    setInterval(() => {

        if (!tripId) return;

        const point = route[routeIndex % route.length];
        routeIndex++;

        const payload = {
            latitude: point.lat,
            longitude: point.lng,
            speed: 30 + Math.random() * 10,
            heading: Math.random() * 360,
            accuracy: 5,
            tripId,
            batteryLevel: 80,
            networkType: 'wifi',
            timestamp: new Date().toISOString(),
            clientTs: Date.now(),
        };

        enqueueLocation(payload);
        flushQueue();

        console.log(`[${routeIndex}] Sent: ${point.lat}, ${point.lng}`);

    }, SEND_INTERVAL);
}

/* ================= SHUTDOWN ================= */

function gracefulShutdown() {
    console.log('\nShutting down...');
    if (socket) socket.disconnect();
    process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

/* ================= MAIN ================= */

async function simulate() {
    await login();
    await getActiveTrip();
    await connectSocket();
    startSending();
}

simulate().catch((err) => {
    console.error('Fatal error:', err.message || err);
    process.exit(1);
});