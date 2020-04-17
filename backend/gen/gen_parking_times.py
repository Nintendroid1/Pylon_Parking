#!/usr/bin/python3
from datetime import datetime
from datetime import timedelta
from dateutil.relativedelta import *


today = datetime.today()
cur_month = datetime.strptime("%d-%02d-01" % (today.year, today.month), "%Y-%m-%d")
next_month_end = cur_month + relativedelta(months=+2) - timedelta(days=1)

start_datestr = "2020-04-01"
# end_datestr = "2020-05-31"
end_datestr = "2020-05-31"
start_date = datetime.strptime(start_datestr, "%Y-%m-%d")
end_date = datetime.strptime(end_datestr, "%Y-%m-%d")

START_DATE_EPOCH = int(cur_month.timestamp())
END_DATE_EPOCH = int(next_month_end.timestamp())
# START_DATE_EPOCH = int(start_date.timestamp())
# END_DATE_EPOCH = int(end_date.timestamp())
TIME_SLOT = int(timedelta(minutes=15).total_seconds())

num_zones = 8
spots_per_zone = 15
admin_key = "16JMcUaYJqzB9DNigWgLKxQZQqza5pkeyf"

query_header = "INSERT INTO parking_times(zone_id, spot_id, time_code, user_pid, availability, price, seller_key)\r\nVALUES"
query_string = "(%d, %d, %d, '%s', %s, %f, '%s')"

print(query_header)
for z in range(1, num_zones + 1):
    for s in range(1, spots_per_zone + 1):
        for cur_time in range(START_DATE_EPOCH, END_DATE_EPOCH + TIME_SLOT, TIME_SLOT):
            print("  " + query_string % (z, s, cur_time, "admin", "true", 1.000, admin_key), end="")
            if (cur_time >= END_DATE_EPOCH and s == spots_per_zone and z == num_zones):
                print(";")
            else:
                print(",")
