insert into users(PID, pass, email, first_name, last_name, admin_status)
	values ('asenger', 'senger123', 'asenger@vt.edu', 'Allyson', 'Senger', 0),
		   ('nateg98', 'getzler123', 'nateg98@vt.edu', 'Nate', 'Getzler', 1),
		   ('evan1533', 'ott123', 'evan1533@vt.edu', 'Evan', 'Ott', 0),
	       ('stevenl4', 'lim123', 'stevenl4@vt.edu', 'Steven', 'Lim', 0),
	       ('naths99', 'salazar123', 'naths99@vt.edu', 'Nathaniel', 'Salazar', 1);

insert into zones(zone_ID, zone_name)
	values (DEFAULT, 'Litton Reaves'),
		   (DEFAULT, 'Derring Lot'),
		   (DEFAULT, 'Perry Street Lot #1'),
		   (DEFAULT, 'Perry Street Lot #2'),
		   (DEFAULT, 'Perry Street Lot #3'),
		   (DEFAULT, 'Lower Stanger Lot');

insert into parking_spots(spot_ID, zone_ID)
	values (10, 1),
		   (11, 1),
		   (12, 1),
		   (20, 2),
		   (21, 2),
		   (30, 3),
		   (31, 3),
		   (32, 3),
		   (34, 3),
		   (40, 4),
		   (50, 5),
		   (51, 5),
		   (52, 5),
		   (53, 5);