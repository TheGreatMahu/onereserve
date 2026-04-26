// ─── Bangladesh Locations ─────────────────────────────────────────────────────
export const BD_LOCATIONS = [
  { value: "dhaka", label: "Dhaka", coords: [23.8103, 90.4125] },
  { value: "chittagong", label: "Chattogram (Chittagong)", coords: [22.3569, 91.7832] },
  { value: "sylhet", label: "Sylhet", coords: [24.8949, 91.8687] },
  { value: "rajshahi", label: "Rajshahi", coords: [24.3636, 88.6241] },
  { value: "khulna", label: "Khulna", coords: [22.8456, 89.5403] },
  { value: "barishal", label: "Barishal", coords: [22.701, 90.3535] },
  { value: "rangpur", label: "Rangpur", coords: [25.7439, 89.2752] },
  { value: "mymensingh", label: "Mymensingh", coords: [24.7471, 90.4203] },
  { value: "cumilla", label: "Cumilla", coords: [23.4607, 91.1809] },
  { value: "cox_bazar", label: "Cox's Bazar", coords: [21.4272, 92.0058] },
  { value: "gazipur", label: "Gazipur", coords: [23.9999, 90.4203] },
  { value: "narayanganj", label: "Narayanganj", coords: [23.6238, 90.4996] },
];

export const INTERNATIONAL_LOCATIONS = [
  { value: "kolkata", label: "Kolkata, India", coords: [22.5726, 88.3639] },
  { value: "delhi", label: "New Delhi, India", coords: [28.6139, 77.209] },
  { value: "mumbai", label: "Mumbai, India", coords: [19.076, 72.8777] },
  { value: "dubai", label: "Dubai, UAE", coords: [25.2048, 55.2708] },
  { value: "doha", label: "Doha, Qatar", coords: [25.2854, 51.531] },
  { value: "singapore", label: "Singapore", coords: [1.3521, 103.8198] },
  { value: "kuala_lumpur", label: "Kuala Lumpur, Malaysia", coords: [3.139, 101.6869] },
  { value: "bangkok", label: "Bangkok, Thailand", coords: [13.7563, 100.5018] },
  { value: "london", label: "London, UK", coords: [51.5074, -0.1278] },
  { value: "new_york", label: "New York, USA", coords: [40.7128, -74.006] },
];

export const ALL_LOCATIONS = [...BD_LOCATIONS, ...INTERNATIONAL_LOCATIONS];

// ─── Transport Types ──────────────────────────────────────────────────────────
export const TRANSPORT_TYPES = [
  { value: "bus", label: "Bus", icon: "FaBus" },
  { value: "train", label: "Train", icon: "FaTrain" },
  { value: "flight", label: "Flight", icon: "FaPlane" },
];

// ─── Bus Operators ─────────────────────────────────────────────────────────────
export const BUS_OPERATORS = [
  "Shyamoli Paribahan",
  "Hanif Enterprise",
  "Green Line",
  "Soudia",
  "Na-Stara",
  "Ena Transport",
];

export const TRAIN_OPERATORS = [
  "Bangladesh Railway",
];

export const AIRLINES = [
  "Biman Bangladesh Airlines",
  "US-Bangla Airlines",
  "Novoair",
  "Air Arabia",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
];

// ─── Seat Classes ─────────────────────────────────────────────────────────────
export const BUS_CLASSES = ["AC", "Non-AC", "Sleeper AC", "Business"];
export const TRAIN_CLASSES = ["Shovon", "Shovon Chair", "First Berth", "First Seat", "Snigdha", "AC Berth", "AC Seat"];
export const FLIGHT_CLASSES = ["Economy", "Business", "First Class"];

// ─── Hotel Amenities ──────────────────────────────────────────────────────────
export const HOTEL_AMENITIES = [
  { key: "wifi", label: "Free WiFi" },
  { key: "parking", label: "Parking" },
  { key: "pool", label: "Swimming Pool" },
  { key: "gym", label: "Gym" },
  { key: "restaurant", label: "Restaurant" },
  { key: "ac", label: "Air Conditioning" },
  { key: "laundry", label: "Laundry" },
  { key: "spa", label: "Spa" },
];

// ─── Status Labels ────────────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  completed: { label: "Completed", color: "bg-teal-100 text-teal-800" },
};

// ─── Price Ranges ─────────────────────────────────────────────────────────────
export const PRICE_RANGES = [
  { label: "Under ৳500", min: 0, max: 500 },
  { label: "৳500 – ৳1,000", min: 500, max: 1000 },
  { label: "৳1,000 – ৳3,000", min: 1000, max: 3000 },
  { label: "Above ৳3,000", min: 3000, max: Infinity },
];

export const APP_NAME = "OneReserve";
export const CURRENCY = "৳";