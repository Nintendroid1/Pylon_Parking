drop table if exists users cascade;
drop table if exists zones cascade;
drop table if exists parking_spots cascade;

CREATE TABLE users
(
	PID VARCHAR(100) NOT NULL,
	pass VARCHAR(256),
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
	user_PID VARCHAR(100),
	PRIMARY KEY (spot_ID),
	FOREIGN KEY (zone_ID) REFERENCES zones(zone_ID),
	FOREIGN KEY (user_PID) REFERENCES users(PID)
);

CREATE TABLE parking_times
(
	spot_ID INT NOT NULL,
	time_code VARCHAR(100),
	PRIMARY KEY (spot_ID, time_code),
	FOREIGN KEY (spot_ID) REFERENCES parking_spots(spot_ID)
);
