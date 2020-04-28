drop table if exists users cascade;
drop table if exists zones cascade;
drop table if exists parking_spots cascade;
drop table if exists parking_times cascade;

CREATE TABLE users
(
  PID VARCHAR(100) NOT NULL,
  pass VARCHAR(256),
  email VARCHAR(256),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  admin_status INT DEFAULT 0,
  PRIMARY KEY (PID)
);

CREATE TABLE zones
(
  zone_ID SERIAL,
  zone_name VARCHAR(256),
  PRIMARY KEY (zone_ID)
);

CREATE TABLE parking_spots
(
  spot_ID INT NOT NULL,
  zone_ID INT NOT NULL,
  PRIMARY KEY (spot_ID, zone_ID),
  FOREIGN KEY (zone_ID) REFERENCES zones(zone_ID)
);

CREATE TABLE parking_times
(
  zone_ID INT NOT NULL,
  spot_ID INT NOT NULL,
  time_code INT,
  user_PID VARCHAR(100) DEFAULT 'admin',
  availability boolean,
  price DECIMAL(16, 10) DEFAULT 4.20,
  seller_key VARCHAR(256),
  PRIMARY KEY (spot_ID, zone_ID, time_code),
  FOREIGN KEY (spot_ID, zone_ID) REFERENCES parking_spots(spot_ID, zone_ID),
  FOREIGN KEY (user_PID) REFERENCES users(PID)
);

CREATE VIEW spot_range AS
  (SELECT p1.zone_id,
          p1.spot_id,
          p1.time_code start_time,
          p2.time_code end_time,
          p1.user_pid,
          p1.availability,
          p1.price
   FROM parking_times p1,
        parking_times p2
   WHERE p1.time_code + 900 = p2.time_code
     AND p1.time_code >= (SELECT EXTRACT(epoch FROM date_trunc('day', NOW()))) AND p2.time_code <= (SELECT EXTRACT(epoch FROM date_trunc('day', NOW() + INTERVAL '1 day')))
     AND p1.zone_id = p2.zone_id
     AND p1.spot_id = p2.spot_id
     AND p1.availability = p2.availability
   ORDER BY p1.zone_id, p1.spot_id, p1.time_code)
