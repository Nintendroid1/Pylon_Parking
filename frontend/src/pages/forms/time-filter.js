import React, { useState } from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { TimePicker } from './parking-spot-components.js';
// import { TimePicker as TimePicker } from '@material-ui/pickers'
import Button from '@material-ui/core/Button';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

// Number of seconds between UTC time and EST time.
const UTCToESTInSec = 4 * 60 * 60;

const militaryTimeDifference = (startTime, endTime) => {
  let [startTimeHour, startTimeMinute] = startTime
    .split(':')
    .map(e => Number(e));
  let [endTimeHour, endTimeMinute] = endTime.split(':').map(e => Number(e));

  let timeDiff = 60 - startTimeMinute;
  startTimeMinute = 0;
  startTimeHour += 1;

  timeDiff += endTimeHour - startTimeHour + (endTimeMinute - startTimeMinute);

  return timeDiff;
};

const isTimeMultipleOf15 = time => {
  const [, minute] = time.split(':').map(e => Number(e));

  return minute % 15 === 0;
};

const roundUpToNearest15 = time => {
  const [hour, minute] = time.split(':').map(e => Number(e));
  const newTime =
    hour.toString() + ':' + (15 - (minute % 15) + minute).toString();

  return newTime;
};

const convertMilitaryTimeToNormal = time => {
  let [hour, minutes] = time.split(':');
  let period = 'AM';

  if (hour > 12) {
    period = 'PM';
    hour -= 12;
  }

  return hour + ':' + minutes + ' ' + period;
};

// sortDirection === 'asc' means earliest to latest
// sortDirection === 'desc' means latest to earliest.
const sortByMilitaryTime = (data, sortDirection, columnToSort) => {
  const sortedData = data.sort(compareParkingSpotTimes(columnToSort));
  return sortDirection === 'asc' ? sortedData : sortedData.reverse();
};

const compareParkingSpotTimes = columnToSort => (spot1, spot2) => {
  return compareMilitaryTime(spot1[columnToSort], spot2[columnToSort]);
};

// If time1 earlier than time2, then return -1.
// If time2 earlier than time1, then return 1.
const compareMilitaryTime = (time1, time2) => {
  time1 = time1.split(':').map(e => Number(e));
  time2 = time2.split(':').map(e => Number(e));

  if (time1[0] < time2[0]) {
    return -1;
  } else if (time1[0] > time2[0]) {
    return 1;
  } else if (time1[1] < time2[1]) {
    return -1;
  } else if (time1[1] > time2[1]) {
    return 1;
  }

  return 0;
};

// const convertNormalToMilitary = time => {
//   let [hour, minute, temp] = time.split(':');
//   const [minute, period] = temp.split(' ');

//   if (period === 'PM') {
//     hour = Number(hour) + 12;
//   }

//   return hour + ':' + minute;
// };

const convertEpochToMilitary = epoch => {
  const option = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  };

  const temp_date = new Date(epoch * 1000);
  return temp_date.toLocaleTimeString('en-US', option);
};

// Expects military time.
const convertMilitaryToEpoch = (date, time) => {
  const [hour, minute] = time.split(':');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return new Date(Date.UTC(year, month, day, hour, minute)).getTime();
};

const convertEpochToNormal = epoch => {
  return new Date(epoch).toUTCString();
};

const DateFilter = ({ time, updateTime, handleDateFilter, ...props }) => {
  const handleOnClick = event => {
    event.preventDefault();
    handleDateFilter();
  };

  return (
    <>
      <CustomDatePicker updateTime={updateTime} time={time} />
      <Button variant="contained" color="primary" onClick={handleOnClick}>
        Filter!
      </Button>
    </>
  );
};

const CustomDatePicker = ({ time, updateTime, ...props }) => {
  const handleDateChange = newDate => {
    updateTime({ ...time, date: newDate });
  };

  return (
    <>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        label="Date"
        value={time.date}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date'
        }}
      />
    </>
  );
};

// Used by list-parking-spots.js.
// Filtering by date and time.
const TimeFilter = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  ...props
}) => {
  const { onSubmit } = props;

  let today = new Date();
  let timeSplit = today.toTimeString().split(':');
  let currTime = timeSplit[0].concat(':', timeSplit[1]);

  const [time, updateTime] = useState({
    date: today,
    startTime: currTime,
    endTime: '24:00',
    privateKey: '',
    showPrivateKey: false
  });

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(time);
  };

  const handleTimeChange = event => {
    let { name, value } = event.target;
    updateTime({ ...time, [name]: value });
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <form>
          <Grid container justify="space-around">
            <CustomDatePicker updateTime={updateTime} time={time} />
          </Grid>
          <Grid>
            <TimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={time.startTime}
              name={'startTime'}
              label={'Start Time'}
            />
            <TimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={time.endTime}
              name={'endTime'}
              label={'End Time'}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Filter!
            </Button>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    </>
  );
};

// Used by transaction.js to filter by days and time.
/*
const MultipleDaysTimeFilter = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  ...props
}) => {
  const { onSubmit } = props;

  let today = new Date();

  const [time, updateTime] = useState({
    startDate: today,
    endDate: today,
    startTime: '00:00',
    endTime: '24:00',
    privateKey: '',
    showPrivateKey: false
  });

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(time);
  };

  const handleTimeChange = event => {
    let { name, value } = event.target;
    updateTime({ ...time, [name]: value });
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <form>
          <Grid container justify="space-around">
            <CustomDatePicker
              time={time}
            />
          </Grid>
          <Grid>
            <TimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={time.startTime}
              name={'startTime'}
              label={'Start Time'}
            />
            <TimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={time.endTime}
              name={'endTime'}
              label={'End Time'}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Filter!
            </Button>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    </>
  );
};

*/
export {
  TimeFilter,
  compareMilitaryTime,
  convertMilitaryTimeToNormal,
  sortByMilitaryTime,
  militaryTimeDifference,
  isTimeMultipleOf15,
  roundUpToNearest15,
  CustomDatePicker,
  convertEpochToMilitary,
  convertEpochToNormal,
  convertMilitaryToEpoch,
  DateFilter
};

/*

const TimeFilter = props => {
  const { onSubmit, popUpTitle, popUpContent } = props;

  let today = new Date();
  let timeSplit = today.toTimeString().split(':');
  let currTime = timeSplit[0].concat(':', timeSplit[1]);

  const [time, updateTime] = useState({
    date: today,
    startTime: currTime,
    endTime: '24:00',
    privateKey: '',
    showPrivateKey: false
  });

  const handleDateChange = newDate => {
    updateTime({ ...time, date: newDate });
  };

  const handleSubmit = () => {
    onSubmit(time);
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <form>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              label="Date"
              value={time.date}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </Grid>
          <Grid>
            <StartEndTime
              time={time}
              buttonName={'Filter'}
              updateTime={updateTime}
              popUpTitle={popUpTitle}
              popUpContent={popUpContent}
              handleOnConfirm={handleSubmit}
            />
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    </>
  );
};

export default TimeFilter;
*/
