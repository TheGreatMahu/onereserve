-- ============================================================
--  OneReserve — Seed / Sample Data
--  Run AFTER schema.sql
-- ============================================================
USE onereserve;

-- ────────────────────────────────────────────────────────────
--  Locations
-- ────────────────────────────────────────────────────────────
INSERT INTO locations (slug, name, type, latitude, longitude) VALUES
('dhaka',         'Dhaka',                      'domestic',      23.8103,  90.4125),
('chittagong',    'Chattogram (Chittagong)',     'domestic',      22.3569,  91.7832),
('sylhet',        'Sylhet',                     'domestic',      24.8949,  91.8687),
('rajshahi',      'Rajshahi',                   'domestic',      24.3636,  88.6241),
('khulna',        'Khulna',                     'domestic',      22.8456,  89.5403),
('barishal',      'Barishal',                   'domestic',      22.7010,  90.3535),
('rangpur',       'Rangpur',                    'domestic',      25.7439,  89.2752),
('mymensingh',    'Mymensingh',                 'domestic',      24.7471,  90.4203),
('cumilla',       'Cumilla',                    'domestic',      23.4607,  91.1809),
('cox_bazar',     "Cox's Bazar",                'domestic',      21.4272,  92.0058),
('kolkata',       'Kolkata, India',             'international', 22.5726,  88.3639),
('dubai',         'Dubai, UAE',                 'international', 25.2048,  55.2708),
('singapore',     'Singapore',                  'international',  1.3521, 103.8198);

-- ────────────────────────────────────────────────────────────
--  Operators
-- ────────────────────────────────────────────────────────────
INSERT INTO operators (name, type, rating) VALUES
('Shyamoli Paribahan',      'bus',    4.2),
('Hanif Enterprise',        'bus',    4.0),
('Green Line',              'bus',    4.5),
('Soudia',                  'bus',    3.8),
('Na-Stara',                'bus',    4.1),
('Ena Transport',           'bus',    3.9),
('Bangladesh Railway',      'train',  3.7),
('Biman Bangladesh Airlines','flight', 3.5),
('US-Bangla Airlines',      'flight', 4.1),
('Novoair',                 'flight', 4.0);

-- ────────────────────────────────────────────────────────────
--  Sample User (password: "password123" — bcrypt hash)
-- ────────────────────────────────────────────────────────────
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Admin User',  'admin@onereserve.com',  '$2b$12$examplehashplaceholder001', '01700000001', 'admin'),
('Rahim Uddin', 'rahim@example.com',     '$2b$12$examplehashplaceholder002', '01711223344', 'user'),
('Fatema Begum','fatema@example.com',    '$2b$12$examplehashplaceholder003', '01988776655', 'user');

-- ────────────────────────────────────────────────────────────
--  Sample Schedules (Dhaka → Chittagong, bus)
-- ────────────────────────────────────────────────────────────
INSERT INTO schedules
  (operator_id, type, from_location_id, to_location_id, departure_time, arrival_time,
   price, total_seats, available_seats, vehicle_number, class, amenities, status)
VALUES
(3, 'bus', 1, 2, '2026-05-01 06:00:00', '2026-05-01 11:30:00',
 650.00, 40, 36, 'GL-1045', 'AC',        '["wifi","ac","charging"]', 'active'),

(1, 'bus', 1, 2, '2026-05-01 08:00:00', '2026-05-01 13:30:00',
 550.00, 40, 28, 'SP-2211', 'Non-AC',    '["ac"]',                  'active'),

(3, 'bus', 1, 2, '2026-05-01 22:00:00', '2026-05-02 03:30:00',
 900.00, 30, 22, 'GL-1060', 'Sleeper AC','["wifi","ac","charging"]', 'active'),

-- Dhaka → Chittagong, train
(7, 'train', 1, 2, '2026-05-01 07:00:00', '2026-05-01 13:00:00',
 350.00, 80, 55, 'Subarna Express', 'Shovon Chair', '["ac"]', 'active'),

(7, 'train', 1, 2, '2026-05-01 10:30:00', '2026-05-01 16:30:00',
 650.00, 50, 30, 'Turna Nishitha', 'Snigdha', '["ac","wifi"]', 'active'),

-- Dhaka → Cox's Bazar, flight
(9, 'flight', 1, 10, '2026-05-01 09:00:00', '2026-05-01 10:00:00',
 4500.00, 120, 95, 'BS-143', 'Economy', '["wifi","ac"]', 'active'),

(8, 'flight', 1, 10, '2026-05-01 14:00:00', '2026-05-01 15:00:00',
 5200.00, 150, 80, 'BG-435', 'Economy', '["wifi","ac"]', 'active'),

-- Dhaka → Sylhet, bus
(2, 'bus', 1, 3, '2026-05-01 07:30:00', '2026-05-01 13:00:00',
 500.00, 40, 32, 'HE-3301', 'AC', '["ac","charging"]', 'active'),

-- Dhaka → Sylhet, train
(7, 'train', 1, 3, '2026-05-01 06:40:00', '2026-05-01 12:10:00',
 280.00, 90, 60, 'Parabat Express', 'Shovon', '[]', 'active');

-- ────────────────────────────────────────────────────────────
--  Sample Seats for Schedule 1 (bus GL-1045)
-- ────────────────────────────────────────────────────────────
INSERT INTO seats (schedule_id, seat_number, status) VALUES
(1,'1A','booked'),(1,'1B','booked'),(1,'1C','available'),(1,'1D','available'),
(1,'2A','booked'),(1,'2B','available'),(1,'2C','available'),(1,'2D','booked'),
(1,'3A','available'),(1,'3B','available'),(1,'3C','locked'),(1,'3D','available'),
(1,'4A','available'),(1,'4B','available'),(1,'4C','available'),(1,'4D','available');

-- ────────────────────────────────────────────────────────────
--  Hotels
-- ────────────────────────────────────────────────────────────
INSERT INTO hotels
  (name, location_id, address, category, rating, review_count, amenities, distance_from_center)
VALUES
('Pan Pacific Sonargaon',
 1, 'Karwan Bazar, Dhaka', '5 Star', 4.8, 1240,
 '["wifi","pool","gym","restaurant","parking","ac","spa"]', '2.5 km'),

('Radisson Blu Dhaka',
 1, 'Airport Road, Dhaka', '5 Star', 4.7, 985,
 '["wifi","pool","gym","restaurant","ac","laundry"]', '4 km'),

('Long Beach Hotel',
 10, 'Kolatoli Beach Road, Cox\'s Bazar', '4 Star', 4.5, 820,
 '["wifi","pool","restaurant","ac","parking"]', '100 m from beach'),

('Hotel Seaview Cox\'s Bazar',
 10, 'Marine Drive, Cox\'s Bazar', '4 Star', 4.3, 632,
 '["wifi","restaurant","parking","ac"]', '300 m from beach'),

('Rose View Hotel',
 3, 'Ambarkhana, Sylhet', '4 Star', 4.2, 445,
 '["wifi","pool","restaurant","ac"]', '2 km'),

('Hotel Grand Sylhet',
 3, 'Zindabazar, Sylhet', '3 Star', 4.1, 390,
 '["wifi","restaurant","ac"]', 'City center'),

('Hotel Agrabad',
 2, 'Agrabad, Chittagong', '3 Star', 4.0, 510,
 '["wifi","restaurant","parking","ac"]', 'Port area'),

('Hotel 71',
 1, 'Shahbag, Dhaka', '3 Star', 3.8, 290,
 '["wifi","ac","parking"]', '1 km');

-- ────────────────────────────────────────────────────────────
--  Hotel Rooms
-- ────────────────────────────────────────────────────────────
INSERT INTO hotel_rooms (hotel_id, room_type, price_per_night, max_guests, total_rooms, available_rooms) VALUES
(1, 'Deluxe Room',       8500.00, 2, 50, 12),
(1, 'Executive Suite',  15000.00, 3, 20,  5),
(2, 'Superior Room',     7200.00, 2, 60, 18),
(2, 'Junior Suite',     12000.00, 3, 25,  8),
(3, 'Sea View Room',     4200.00, 2, 40, 15),
(3, 'Beach Suite',       6500.00, 4, 10,  3),
(4, 'Standard Room',     3500.00, 2, 35, 20),
(5, 'Deluxe Double',     3000.00, 2, 30, 12),
(6, 'Standard Single',   2200.00, 1, 25, 18),
(7, 'Standard Double',   2800.00, 2, 30, 15),
(8, 'Economy Room',      1800.00, 2, 40, 25);

-- ────────────────────────────────────────────────────────────
--  Sample Transport Booking
-- ────────────────────────────────────────────────────────────
INSERT INTO transport_bookings
  (id, user_id, schedule_id, passengers, subtotal, tax_amount, total_amount, payment_method, status)
VALUES
('OR-BK-000001', 2, 1, 1, 650.00, 48.75, 698.75, 'bkash',   'confirmed'),
('OR-BK-000002', 3, 6, 2, 9000.00, 675.00, 9675.00, 'nagad', 'completed');

INSERT INTO booking_passengers (booking_id, name, age, gender, seat_number, nid) VALUES
('OR-BK-000001', 'Rahim Uddin', 28, 'male', '2A', '19932810112345'),
('OR-BK-000002', 'Fatema Begum', 25, 'female', '5A', '20012810667788'),
('OR-BK-000002', 'Karim Hossain', 30, 'male', '5B', '19942810445566');

-- ────────────────────────────────────────────────────────────
--  Sample Hotel Booking
-- ────────────────────────────────────────────────────────────
INSERT INTO hotel_bookings
  (id, user_id, hotel_id, room_id, check_in, check_out, nights, guests,
   subtotal, tax_amount, total_amount, payment_method, status)
VALUES
('OR-HB-000001', 2, 3, 5, '2026-05-02', '2026-05-04', 2, 2,
 8400.00, 630.00, 9030.00, 'card', 'confirmed');

-- ────────────────────────────────────────────────────────────
--  Payments
-- ────────────────────────────────────────────────────────────
INSERT INTO payments (booking_id, booking_type, amount, method, transaction_id, status, paid_at) VALUES
('OR-BK-000001', 'transport', 698.75,  'bkash', 'TXN-BK-9921', 'success', '2026-04-25 10:15:00'),
('OR-BK-000002', 'transport', 9675.00, 'nagad', 'TXN-BK-4432', 'success', '2026-04-20 14:30:00'),
('OR-HB-000001', 'hotel',     9030.00, 'card',  'TXN-HB-7761', 'success', '2026-04-25 10:20:00');

-- ────────────────────────────────────────────────────────────
--  Sample Reviews
-- ────────────────────────────────────────────────────────────
INSERT INTO reviews (user_id, target_type, target_id, rating, comment) VALUES
(2, 'transport', 1, 5, 'Very comfortable AC bus. On time and clean!'),
(3, 'transport', 6, 4, 'Good flight, short and smooth. Would book again.'),
(2, 'hotel',     3, 5, 'Amazing sea view! Staff was very helpful.');
