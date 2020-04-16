#!/usr/bin/python3
from datetime import datetime
from datetime import timedelta

start_datestr = "2020-03-01"
end_datestr = "2020-05-31"
start_date = datetime.strptime(start_datestr, "%Y-%m-%d")
end_date = datetime.strptime(end_datestr, "%Y-%m-%d")
START_DATE = int(start_date.timestamp())
END_DATE = int(end_date.timestamp())
TIME_SLOT = int(timedelta(minutes=15).total_seconds())

num_zones = 8
spots_per_zone = 15
admin_key = "16JMcUaYJqzB9DNigWgLKxQZQqza5pkeyf"

query_header = "INSERT INTO parking_times(zone_id, spot_id, time_code, user_pid, availability, price, seller_key)\r\nVALUES"
query_string = "(%d, %d, %d, '%s', %s, %f, '%s')"

print(query_header)
for z in range(1, num_zones + 1):
    for s in range(1, spots_per_zone + 1):
        for cur_time in range(START_DATE, END_DATE + TIME_SLOT, TIME_SLOT):
            print("  " + query_string % (z, s, cur_time, "admin", "true", 1.000, admin_key), end="")
            if (cur_time >= END_DATE and s == spots_per_zone and z == num_zones):
                print(";")
            else:
                print(",")
