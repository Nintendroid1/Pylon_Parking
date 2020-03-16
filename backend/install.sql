drop table if exists users cascade;
drop table if exists transactions cascade;
drop table if exists time_slots cascade;
drop table if exists parking_spots cascade;
drop table if exists wallets cascade;

CREATE TABLE users
(
	PID VARCHAR(100) NOT NULL,
	pin INT,
	email VARCHAR(256),
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	admin_status VARCHAR(100),
	PRIMARY KEY (PID)
);

CREATE TABLE zones
(
	zone_ID INT NOT NULL,
	name VARCHAR(256),
	PRIMARY KEY (zone_ID)
);

CREATE TABLE parking_spots
(
	spot_ID INT NOT NULL,
	zone_ID INT,
	availability boolean,
	PRIMARY KEY (spot_ID),
	FOREIGN KEY (zone_ID) REFERENCES zones(zone_ID)
);

