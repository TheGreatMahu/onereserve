-- ============================================================
--  OneReserve — Extended Data Insertions
--  Run AFTER schema.sql and seed.sql
-- ============================================================
USE onereserve;

-- ────────────────────────────────────────────────────────────
--  More Users (10 additional)
-- ────────────────────────────────────────────────────────────
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Karim Hossain',   'karim@example.com',   '$2b$12$placeholder003', '01812345678', 'user'),
('Nusrat Jahan',    'nusrat@example.com',  '$2b$12$placeholder004', '01912345678', 'user'),
('Arif Rahman',     'arif@example.com',    '$2b$12$placeholder005', '01612345678', 'user'),
('Sumaiya Islam',   'sumaiya@example.com', '$2b$12$placeholder006', '01512345678', 'user'),
('Tanvir Ahmed',    'tanvir@example.com',  '$2b$12$placeholder007', '01712345679', 'user'),
('Roksana Begum',   'roksana@example.com', '$2b$12$placeholder008', '01812345679', 'user'),
('Mehedi Hasan',    'mehedi@example.com',  '$2b$12$placeholder009', '01912345679', 'user'),
('Tania Sultana',   'tania@example.com',   '$2b$12$placeholder010', '01612345679', 'user'),
('Shahriar Khan',   'shahriar@example.com','$2b$12$placeholder011', '01512345679', 'user'),
('Dilruba Akter',   'dilruba@example.com', '$2b$12$placeholder012', '01312345679', 'user');

-- ────────────────────────────────────────────────────────────
--  More Schedules (different routes & dates)
-- ────────────────────────────────────────────────────────────

-- Dhaka → Rajshahi
INSERT INTO schedules (operator_id, type, from_location_id, to_location_id, departure_time, arrival_time, price, total_seats, available_seats, vehicle_number, class, amenities, status) VALUES
(1, 'bus', 1, 4, '2026-05-02 07:00:00', '2026-05-02 13:30:00',  600.00, 40, 35, 'SP-1122', 'AC',     '["wifi","ac"]',            'active'),
(4, 'bus', 1, 4, '2026-05-02 09:00:00', '2026-05-02 15:30:00',  450.00, 40, 28, 'SD-2234', 'Non-AC', '[]',                       'active'),
(7, 'train',1, 4, '2026-05-02 06:30:00', '2026-05-02 12:00:00', 320.00, 80, 55, 'Silk City', 'Shovon Chair', '["ac"]',          'active'),

-- Dhaka → Khulna
(3, 'bus', 1, 5, '2026-05-02 08:00:00', '2026-05-02 16:00:00',  700.00, 40, 30, 'GL-2050', 'AC',     '["wifi","ac","charging"]', 'active'),
(7, 'train',1, 5, '2026-05-02 09:15:00', '2026-05-02 17:45:00', 450.00, 90, 60, 'Sundarban Express', 'Snigdha', '["ac"]',       'active'),

-- Dhaka → Barishal
(2, 'bus', 1, 6, '2026-05-03 07:00:00', '2026-05-03 12:30:00',  500.00, 40, 38, 'HE-4401', 'AC',     '["ac"]',                  'active'),
(6, 'bus', 1, 6, '2026-05-03 20:00:00', '2026-05-04 01:30:00',  850.00, 30, 20, 'EN-5501', 'Sleeper AC','["wifi","ac"]',         'active'),

-- Chittagong → Cox's Bazar
(1, 'bus', 2, 10,'2026-05-03 06:00:00', '2026-05-03 10:00:00',  350.00, 40, 32, 'SP-3344', 'AC',     '["ac"]',                  'active'),
(3, 'bus', 2, 10,'2026-05-03 10:00:00', '2026-05-03 14:00:00',  400.00, 40, 25, 'GL-4455', 'AC',     '["wifi","ac"]',            'active'),

-- Dhaka → Rangpur (train)
(7, 'train',1, 7,'2026-05-04 09:00:00', '2026-05-04 17:00:00',  500.00, 80, 45, 'Rangpur Express', 'AC Berth', '["ac","wifi"]', 'active'),

-- Dhaka → Cox's Bazar (flights)
(10,'flight',1,10,'2026-05-05 08:00:00','2026-05-05 09:00:00', 3800.00,120, 80, 'NV-210', 'Economy',  '["wifi","ac"]',            'active'),
(9, 'flight',1,10,'2026-05-05 16:00:00','2026-05-05 17:00:00', 4200.00,180,110, 'BS-288', 'Economy',  '["wifi","ac"]',            'active'),
(8, 'flight',1,10,'2026-05-06 10:00:00','2026-05-06 11:00:00', 6500.00,150, 60, 'BG-101', 'Business', '["wifi","ac","meal"]',     'active'),

-- Dhaka → Dubai (international flight)
(8, 'flight',1,12,'2026-05-10 02:00:00','2026-05-10 06:00:00',28000.00,250,120, 'BG-003', 'Economy',  '["wifi","ac","meal"]',     'active'),
(8, 'flight',1,12,'2026-05-15 23:00:00','2026-05-16 03:00:00',45000.00,250, 40, 'BG-005', 'Business', '["wifi","ac","meal","flat-bed"]','active');

-- ────────────────────────────────────────────────────────────
--  Seats for Schedules 10–12 (sample seat maps)
-- ────────────────────────────────────────────────────────────
INSERT INTO seats (schedule_id, seat_number, status) VALUES
-- Schedule 10: Dhaka→Cox's Bazar Novoair
(10,'1A','booked'),(10,'1B','available'),(10,'1C','available'),(10,'1D','booked'),
(10,'2A','available'),(10,'2B','booked'),(10,'2C','available'),(10,'2D','available'),
(10,'3A','locked'),(10,'3B','available'),(10,'3C','available'),(10,'3D','available'),

-- Schedule 11: Dhaka→Cox's Bazar US-Bangla
(11,'1A','booked'),(11,'1B','booked'),(11,'1C','available'),(11,'1D','available'),
(11,'2A','available'),(11,'2B','available'),(11,'2C','booked'),(11,'2D','booked'),
(11,'3A','available'),(11,'3B','available'),(11,'3C','available'),(11,'3D','locked');

-- ────────────────────────────────────────────────────────────
--  More Hotels (6 additional)
-- ────────────────────────────────────────────────────────────
INSERT INTO hotels (name, location_id, address, category, rating, review_count, amenities, distance_from_center) VALUES
('Sayeman Beach Resort',       10, 'Himchori Road, Cox\'s Bazar', '5 Star', 4.6, 1100, '["wifi","pool","gym","restaurant","spa","ac","parking"]', '500 m from beach'),
('Cox Today Hotel',            10, 'Hotel Motel Zone, Cox\'s Bazar','3 Star', 3.9,  310, '["wifi","ac","restaurant"]', '1 km from beach'),
('Hotel Sylhet Inn',            3, 'Dargah Gate, Sylhet',          '3 Star', 3.7,  220, '["wifi","ac","parking"]', 'City center'),
('Westin Dhaka',                1, 'Gulshan 2, Dhaka',             '5 Star', 4.9,  2100,'["wifi","pool","gym","restaurant","spa","ac","laundry"]', '3 km'),
('Hotel Khulna International',  5, 'KDA Avenue, Khulna',           '4 Star', 4.0,  400, '["wifi","restaurant","ac","parking"]', 'City center'),
('Hotel Rajshahi Palace',       4, 'Natore Road, Rajshahi',        '3 Star', 3.8,  280, '["wifi","ac","restaurant"]', '2 km');

-- ────────────────────────────────────────────────────────────
--  Rooms for new hotels (hotels 9–14)
-- ────────────────────────────────────────────────────────────
INSERT INTO hotel_rooms (hotel_id, room_type, price_per_night, max_guests, total_rooms, available_rooms) VALUES
(9,  'Deluxe Sea View',   5500.00, 2, 45, 18),
(9,  'Pool Villa',        9800.00, 4, 10,  3),
(10, 'Standard Room',     2500.00, 2, 30, 22),
(11, 'Single Room',       1500.00, 1, 25, 15),
(12, 'Signature Room',   12000.00, 2, 60, 20),
(12, 'Presidential Suite',35000.00,4,  5,  2),
(13, 'Executive Room',    3800.00, 2, 35, 12),
(14, 'Comfort Room',      2200.00, 2, 30, 18);

-- ────────────────────────────────────────────────────────────
--  More Transport Bookings
-- ────────────────────────────────────────────────────────────
INSERT INTO transport_bookings (id, user_id, schedule_id, passengers, subtotal, tax_amount, total_amount, payment_method, status) VALUES
('OR-BK-000003', 4, 4,  1,  650.00,  48.75,   698.75, 'nagad',  'confirmed'),
('OR-BK-000004', 5, 7,  2,  900.00,  67.50,   967.50, 'bkash',  'confirmed'),
('OR-BK-000005', 6, 10, 1, 3800.00, 285.00,  4085.00, 'card',   'confirmed'),
('OR-BK-000006', 7, 5,  2,  900.00,  67.50,   967.50, 'rocket', 'completed'),
('OR-BK-000007', 3, 8,  1,  350.00,  26.25,   376.25, 'bkash',  'cancelled'),
('OR-BK-000008', 8, 15, 2,56000.00,4200.00, 60200.00, 'bank',   'confirmed'),
('OR-BK-000009', 2, 3,  1,  900.00,  67.50,   967.50, 'nagad',  'completed'),
('OR-BK-000010', 9, 12, 1, 4200.00, 315.00,  4515.00, 'bkash',  'confirmed');

-- ────────────────────────────────────────────────────────────
--  Passengers for new bookings
-- ────────────────────────────────────────────────────────────
INSERT INTO booking_passengers (booking_id, name, age, gender, seat_number, nid) VALUES
('OR-BK-000003', 'Nusrat Jahan',   22, 'female', '3A', '20032810112233'),
('OR-BK-000004', 'Arif Rahman',    35, 'male',   '1A', '19912810223344'),
('OR-BK-000004', 'Sumaiya Islam',  32, 'female', '1B', '19942810334455'),
('OR-BK-000005', 'Tanvir Ahmed',   28, 'male',   '5C', '20002810556677'),
('OR-BK-000006', 'Roksana Begum',  40, 'female', '2A', '19862810667788'),
('OR-BK-000006', 'Mehedi Hasan',   45, 'male',   '2B', '19812810778899'),
('OR-BK-000007', 'Fatema Begum',   25, 'female', '4C', '20012810667788'),
('OR-BK-000008', 'Shahriar Khan',  55, 'male',   '3A', '19712810889900'),
('OR-BK-000008', 'Dilruba Akter',  50, 'female', '3B', '19762810990011'),
('OR-BK-000009', 'Rahim Uddin',    28, 'male',   '8D', '19932810112345'),
('OR-BK-000010', 'Tania Sultana',  30, 'female', '7A', '19962810223456');

-- ────────────────────────────────────────────────────────────
--  More Hotel Bookings
-- ────────────────────────────────────────────────────────────
INSERT INTO hotel_bookings (id, user_id, hotel_id, room_id, check_in, check_out, nights, guests, subtotal, tax_amount, total_amount, payment_method, status) VALUES
('OR-HB-000002', 4, 9,  13, '2026-05-03','2026-05-06', 3, 2, 16500.00, 1237.50, 17737.50, 'bkash',  'confirmed'),
('OR-HB-000003', 5, 4,  7,  '2026-05-05','2026-05-07', 2, 2,  8400.00,  630.00,  9030.00, 'card',   'confirmed'),
('OR-HB-000004', 6, 3,  5,  '2026-05-02','2026-05-05', 3, 2, 12600.00,  945.00, 13545.00, 'nagad',  'completed'),
('OR-HB-000005', 7, 12, 17, '2026-05-10','2026-05-13', 3, 2, 36000.00, 2700.00, 38700.00, 'bank',   'confirmed'),
('OR-HB-000006', 2, 1,  1,  '2026-05-01','2026-05-03', 2, 2, 17000.00, 1275.00, 18275.00, 'card',   'completed'),
('OR-HB-000007', 8, 10, 15, '2026-05-05','2026-05-07', 2, 1,  5000.00,  375.00,  5375.00, 'bkash',  'confirmed'),
('OR-HB-000008', 9, 6,  10, '2026-05-08','2026-05-10', 2, 1,  4400.00,  330.00,  4730.00, 'rocket', 'confirmed');

-- ────────────────────────────────────────────────────────────
--  Payments for all bookings
-- ────────────────────────────────────────────────────────────
INSERT INTO payments (booking_id, booking_type, amount, method, transaction_id, status, paid_at) VALUES
('OR-BK-000003','transport',   698.75, 'nagad',  'TXN-NG-1001', 'success', '2026-04-26 09:00:00'),
('OR-BK-000004','transport',   967.50, 'bkash',  'TXN-BK-1002', 'success', '2026-04-26 10:30:00'),
('OR-BK-000005','transport',  4085.00, 'card',   'TXN-CD-1003', 'success', '2026-04-26 11:00:00'),
('OR-BK-000006','transport',   967.50, 'rocket', 'TXN-RK-1004', 'success', '2026-04-20 08:00:00'),
('OR-BK-000007','transport',   376.25, 'bkash',  'TXN-BK-1005', 'refunded','2026-04-22 14:00:00'),
('OR-BK-000008','transport', 60200.00, 'bank',   'TXN-BN-1006', 'success', '2026-04-24 16:00:00'),
('OR-BK-000009','transport',   967.50, 'nagad',  'TXN-NG-1007', 'success', '2026-04-18 12:00:00'),
('OR-BK-000010','transport',  4515.00, 'bkash',  'TXN-BK-1008', 'success', '2026-04-25 17:00:00'),
('OR-HB-000002','hotel',     17737.50, 'bkash',  'TXN-BK-2001', 'success', '2026-04-26 09:15:00'),
('OR-HB-000003','hotel',      9030.00, 'card',   'TXN-CD-2002', 'success', '2026-04-26 10:45:00'),
('OR-HB-000004','hotel',     13545.00, 'nagad',  'TXN-NG-2003', 'success', '2026-04-19 09:00:00'),
('OR-HB-000005','hotel',     38700.00, 'bank',   'TXN-BN-2004', 'success', '2026-04-24 17:00:00'),
('OR-HB-000006','hotel',     18275.00, 'card',   'TXN-CD-2005', 'success', '2026-04-16 11:00:00'),
('OR-HB-000007','hotel',      5375.00, 'bkash',  'TXN-BK-2006', 'success', '2026-04-25 18:00:00'),
('OR-HB-000008','hotel',      4730.00, 'rocket', 'TXN-RK-2007', 'success', '2026-04-26 13:00:00');

-- ────────────────────────────────────────────────────────────
--  More Reviews
-- ────────────────────────────────────────────────────────────
INSERT INTO reviews (user_id, target_type, target_id, rating, comment) VALUES
(2,  'hotel',     1,  5, 'Best hotel in Dhaka. Exceptional service and food.'),
(3,  'hotel',     3,  5, 'Perfect location near the beach. Very clean rooms.'),
(4,  'hotel',     9,  5, 'Sayeman is outstanding! Pool view is gorgeous.'),
(5,  'transport', 4,  4, 'Green Line is always reliable. Comfortable AC seats.'),
(6,  'transport', 5,  4, 'Sundarban Express was on time. Good for family travel.'),
(7,  'hotel',    12,  5, 'Westin Dhaka is world class. Worth every taka.'),
(8,  'transport',15,  5, 'Biman business class was excellent. Very smooth flight.'),
(9,  'hotel',     6,  4, 'Grand Sylhet is solid value. Staff very welcoming.'),
(10, 'transport', 7,  3, 'Bus was delayed by 30 mins. Seats were okay though.'),
(2,  'transport',10,  4, 'Novoair was clean and punctual. Great budget flight.'),
(3,  'hotel',     4,  4, 'Comfortable sea view room. Breakfast was delicious.'),
(5,  'transport', 1,  5, 'Green Line top class! AC was perfect, seat comfortable.'),
(6,  'hotel',     3,  4, 'Nice hotel, good beach access. Pool needs cleaning.'),
(7,  'transport',12,  4, 'US-Bangla is good value. Seats a bit tight but ok.'),
(9,  'hotel',    10,  3, 'Average hotel. WiFi was slow. Location is convenient.');
