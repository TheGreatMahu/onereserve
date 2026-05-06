-- ============================================================
--  OneReserve — MySQL Database Schema
--  CSE-3102 Database Management Systems Laboratory · Group 7
-- ============================================================

CREATE DATABASE IF NOT EXISTS onereserve CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE onereserve;

-- ============================================================
--  TABLE 1: users
-- ============================================================
CREATE TABLE users (
    id            INT           NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    phone         VARCHAR(20)   DEFAULT NULL,
    role          ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
);

-- ============================================================
--  TABLE 2: locations
-- ============================================================
CREATE TABLE locations (
    id         INT             NOT NULL AUTO_INCREMENT,
    slug       VARCHAR(60)     NOT NULL,          -- e.g. "cox_bazar"
    name       VARCHAR(100)    NOT NULL,          -- e.g. "Cox's Bazar"
    type       ENUM('domestic','international') NOT NULL DEFAULT 'domestic',
    latitude   DECIMAL(10,7)   DEFAULT NULL,
    longitude  DECIMAL(10,7)   DEFAULT NULL,
    created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_locations_slug (slug)
);

-- ============================================================
--  TABLE 3: operators  (bus companies / railways / airlines)
-- ============================================================
CREATE TABLE operators (
    id         INT           NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100)  NOT NULL,
    type       ENUM('bus','train','flight') NOT NULL,
    logo_url   VARCHAR(255)  DEFAULT NULL,
    rating     DECIMAL(2,1)  NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

-- ============================================================
--  TABLE 4: schedules  (individual trips/journeys)
-- ============================================================
CREATE TABLE schedules (
    id               INT           NOT NULL AUTO_INCREMENT,
    operator_id      INT           NOT NULL,
    type             ENUM('bus','train','flight') NOT NULL,
    from_location_id INT           NOT NULL,
    to_location_id   INT           NOT NULL,
    departure_time   DATETIME      NOT NULL,
    arrival_time     DATETIME      NOT NULL,
    price            DECIMAL(10,2) NOT NULL,
    total_seats      INT           NOT NULL,
    available_seats  INT           NOT NULL,
    vehicle_number   VARCHAR(50)   DEFAULT NULL,   -- bus no / train no / flight no
    class            VARCHAR(50)   DEFAULT NULL,   -- AC / Economy / Snigdha
    amenities        JSON          DEFAULT NULL,   -- ["wifi","ac","charging"]
    status           ENUM('active','cancelled','completed') NOT NULL DEFAULT 'active',
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_schedules_type             (type),
    KEY idx_schedules_from_to_date     (from_location_id, to_location_id, departure_time),
    KEY idx_schedules_operator         (operator_id),

    CONSTRAINT fk_schedules_operator  FOREIGN KEY (operator_id)      REFERENCES operators (id),
    CONSTRAINT fk_schedules_from      FOREIGN KEY (from_location_id) REFERENCES locations (id),
    CONSTRAINT fk_schedules_to        FOREIGN KEY (to_location_id)   REFERENCES locations (id)
);

-- ============================================================
--  TABLE 5: seats  (per-schedule seat map)
-- ============================================================
CREATE TABLE seats (
    id           INT         NOT NULL AUTO_INCREMENT,
    schedule_id  INT         NOT NULL,
    seat_number  VARCHAR(10) NOT NULL,   -- "4A", "12B"
    status       ENUM('available','booked','locked') NOT NULL DEFAULT 'available',
    locked_at    TIMESTAMP   DEFAULT NULL,
    locked_by    INT         DEFAULT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_seats_schedule_seat (schedule_id, seat_number),
    KEY idx_seats_schedule            (schedule_id),

    CONSTRAINT fk_seats_schedule   FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE,
    CONSTRAINT fk_seats_locked_by  FOREIGN KEY (locked_by)   REFERENCES users     (id) ON DELETE SET NULL
);

-- ============================================================
--  TABLE 6: hotels
-- ============================================================
CREATE TABLE hotels (
    id                   INT           NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(150)  NOT NULL,
    location_id          INT           NOT NULL,
    address              TEXT          NOT NULL,
    category             VARCHAR(30)   DEFAULT NULL,   -- "5 Star", "3 Star"
    rating               DECIMAL(2,1)  NOT NULL DEFAULT 0.0,
    review_count         INT           NOT NULL DEFAULT 0,
    amenities            JSON          DEFAULT NULL,   -- ["wifi","pool","gym"]
    images               JSON          DEFAULT NULL,   -- array of image URLs
    distance_from_center VARCHAR(60)   DEFAULT NULL,
    created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_hotels_location (location_id),
    KEY idx_hotels_rating   (rating),

    CONSTRAINT fk_hotels_location FOREIGN KEY (location_id) REFERENCES locations (id)
);

-- ============================================================
--  TABLE 7: hotel_rooms  (room types per hotel)
-- ============================================================
CREATE TABLE hotel_rooms (
    id               INT           NOT NULL AUTO_INCREMENT,
    hotel_id         INT           NOT NULL,
    room_type        VARCHAR(100)  NOT NULL,    -- "Deluxe Double", "Suite"
    price_per_night  DECIMAL(10,2) NOT NULL,
    max_guests       INT           NOT NULL,
    total_rooms      INT           NOT NULL,
    available_rooms  INT           NOT NULL,
    amenities        JSON          DEFAULT NULL,
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_hotel_rooms_hotel (hotel_id),

    CONSTRAINT fk_hotel_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE CASCADE
);

-- ============================================================
--  TABLE 8: transport_bookings
-- ============================================================
CREATE TABLE transport_bookings (
    id             VARCHAR(20)   NOT NULL,          -- "OR-BK-000001"
    user_id        INT           NOT NULL,
    schedule_id    INT           NOT NULL,
    passengers     INT           NOT NULL DEFAULT 1,
    subtotal       DECIMAL(10,2) NOT NULL,
    tax_amount     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount   DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50)   NOT NULL,          -- "bkash","nagad","card"
    status         ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_tb_user     (user_id),
    KEY idx_tb_schedule (schedule_id),
    KEY idx_tb_status   (status),

    CONSTRAINT fk_tb_user     FOREIGN KEY (user_id)     REFERENCES users     (id),
    CONSTRAINT fk_tb_schedule FOREIGN KEY (schedule_id) REFERENCES schedules (id)
);

-- ============================================================
--  TABLE 9: booking_passengers  (one row per passenger)
-- ============================================================
CREATE TABLE booking_passengers (
    id          INT         NOT NULL AUTO_INCREMENT,
    booking_id  VARCHAR(20) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    age         INT          NOT NULL,
    gender      ENUM('male','female','other') NOT NULL,
    seat_number VARCHAR(10)  DEFAULT NULL,
    nid         VARCHAR(50)  DEFAULT NULL,

    PRIMARY KEY (id),
    KEY idx_bp_booking (booking_id),

    CONSTRAINT fk_bp_booking FOREIGN KEY (booking_id) REFERENCES transport_bookings (id) ON DELETE CASCADE
);

-- ============================================================
--  TABLE 10: hotel_bookings
-- ============================================================
CREATE TABLE hotel_bookings (
    id             VARCHAR(20)   NOT NULL,          -- "OR-HB-000001"
    user_id        INT           NOT NULL,
    hotel_id       INT           NOT NULL,
    room_id        INT           NOT NULL,
    check_in       DATE          NOT NULL,
    check_out      DATE          NOT NULL,
    nights         INT           NOT NULL,
    guests         INT           NOT NULL DEFAULT 1,
    subtotal       DECIMAL(10,2) NOT NULL,
    tax_amount     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount   DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50)   NOT NULL,
    status         ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_hb_user   (user_id),
    KEY idx_hb_hotel  (hotel_id),
    KEY idx_hb_status (status),

    CONSTRAINT fk_hb_user  FOREIGN KEY (user_id)  REFERENCES users        (id),
    CONSTRAINT fk_hb_hotel FOREIGN KEY (hotel_id) REFERENCES hotels       (id),
    CONSTRAINT fk_hb_room  FOREIGN KEY (room_id)  REFERENCES hotel_rooms  (id)
);

-- ============================================================
--  TABLE 11: payments
-- ============================================================
CREATE TABLE payments (
    id             INT           NOT NULL AUTO_INCREMENT,
    booking_id     VARCHAR(20)   NOT NULL,
    booking_type   ENUM('transport','hotel') NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    method         VARCHAR(50)   NOT NULL,
    transaction_id VARCHAR(100)  DEFAULT NULL,
    status         ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
    paid_at        TIMESTAMP     DEFAULT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_payments_booking (booking_id),
    KEY idx_payments_status  (status)
);

-- ============================================================
--  TABLE 12: reviews  (hotel + transport reviews)
-- ============================================================
CREATE TABLE reviews (
    id            INT           NOT NULL AUTO_INCREMENT,
    user_id       INT           NOT NULL,
    target_type   ENUM('hotel','transport') NOT NULL,
    target_id     INT           NOT NULL,     -- hotel_id or schedule_id
    rating        TINYINT       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment       TEXT          DEFAULT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_reviews_target (target_type, target_id),
    KEY idx_reviews_user   (user_id),

    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
