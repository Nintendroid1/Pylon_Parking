/**
 * Contains functions and components used in manipulating time.
 */

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
import { KeyboardTimePicker } from '@material-ui/pickers';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

/*
  Finds the difference in time between the two given military times.

  Returns the time in minutes.
*/
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

/*
  Returns true if the given military time is a multiple
  of 15 minutes, false otherwise.
*/
const isTimeMultipleOf15 = time => {
  const [, minute] = time.split(':').map(e => Number(e));

  return minute % 15 === 0;
};

/*
  Returns the given military time rounded up to the nearest 15
  minutes.
*/
const roundUpToNearest15 = time => {
  const [hour, minute] = time.split(':').map(e => Number(e));
  const newTime =
    hour.toString() + ':' + (15 - (minute % 15) + minute).toString();

  return newTime;
};

/*
  Converts the military time to standard US time in AM/PM.
*/
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
/*
  Sorts the list of military times given the direction to sort
  and the property in the object to sort.
*/
const sortByMilitaryTime = (data, sortDirection, columnToSort) => {
  const sortedData = data.sort(compareParkingSpotTimes(columnToSort));
  return sortDirection === 'asc' ? sortedData : sortedData.reverse();
};

/*
  Compares two parking spot times based on the property to compare.
  i.e. start_time or end_time.
*/
const compareParkingSpotTimes = columnToSort => (spot1, spot2) => {
  return compareMilitaryTime(spot1[columnToSort], spot2[columnToSort]);
};

// If time1 earlier than time2, then return -1.
// If time2 earlier than time1, then return 1.
/*
  Compares two military times.
*/
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

/*
  Converts the given epoch time to military time.
  If the time zone is not specified, then defaults to UTC.
*/
const convertEpochToMilitary = (epoch, timeZone='UTC') => {
  const option = {
    timeZone: timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  };

  const temp_date = new Date(epoch * 1000);
  return temp_date.toLocaleTimeString('en-US', option);
};

/*
  Finds the number of 15 minutes intervals between the 
  given start and end time, which are Epochs.
*/
const timeDiffInEpoch15 = (startTime, endTime) => {
  return (endTime - startTime) / (1000 * 60 * 15);
};

/*
  Returns the current time in UTC time, meaning the time is UTC,
  but read as if it was EDT.
*/
const getCurrentTimeInUTC = () => {
  // Date.now() returns UTC time.
  return new Date(Date.now() + (4 * 60 * 60 * 1000));
}

// Expects military time.
/*
  Converts military time to Epoch, expects the date to be
  UTC and the time to be correct in UTC.
*/
const convertMilitaryToEpoch = (date, time) => {
  const [hour, minute] = time.split(':');
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  return new Date(Date.UTC(year, month, day, hour, minute)).getTime() / 1000;
};

/*
  Converts Epoch to Standard US AM/PM time.
*/
const convertEpochToNormal = epoch => {
  return convertMilitaryTimeToNormal(convertEpochToMilitary(epoch));
};

/*
  Component used to filter the date.
*/
const DateFilter = ({ time, handleDateFilter, updateTime, ...props }) => {
  const handleOnClick = event => {
    event.preventDefault();
    handleDateFilter();
  };

  return (
    <>
      <CustomDatePicker time={time} updateTime={updateTime} />
      <Button variant="contained" color="primary" onClick={handleOnClick}>
        Filter!
      </Button>
    </>
  );
};

/*
  A component that displays a date component.
*/
const CustomDatePicker = ({ time, updateTime, handleDateChange, ...props }) => {
  return (
    <>
      <KeyboardDatePicker
        showTodayButton={true}
        disableToolbar
        variant="dialog"
        format="MM/dd/yyyy"
        margin="normal"
        label="Date"
        value={time.date}
        onChange={date => handleDateChange(date)}
        KeyboardButtonProps={{
          'aria-label': 'change date'
        }}
      />
    </>
  );
};

// Used by list-parking-spots.js.
// Filtering by date and time.
/*
  Component that allows for filtering by date, start time, and
  end time.
*/
const TimeFilter = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  onSubmit,
  currentTimeFilter,
  updateCurrentTimeFilter,
  ...props
}) => {

  const [checkBoxes, updateCheckBoxes] = useState({
    startTimeBox: false,
    endTimeBox: false
  });

  const handleChangeCheckBox = (event) => {
    updateCheckBoxes({ ...checkBoxes, [event.target.name]: event.target.checked });
  };

  // Handles the filtering.
  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(currentTimeFilter, checkBoxes);
  };

  const handleTimeChange = event => {
    let { name, value } = event.target;
    updateCurrentTimeFilter({ ...currentTimeFilter, [name]: value });
  };

  // Handles a change in date, which is an automatic filtering.
  const handleDateChange = newDate => {
    console.log(newDate);

    // newDate is in local time
    const newDateObj = {
      date: newDate,
      startTime: '00:00',
      endTime: '24:00'
    };

    const resetCheckBoxes = {
      startTimeBox: false,
      endTimeBox: false
    };

    updateCurrentTimeFilter(newDateObj);
    onSubmit(newDateObj, resetCheckBoxes);
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <form>
          <Grid container justify="space-around">
            <CustomDatePicker
              updateTime={updateCurrentTimeFilter}
              time={currentTimeFilter}
              handleDateChange={handleDateChange}
            />
          </Grid>
          <Grid>
            <TimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={currentTimeFilter.startTime}
              name={'startTime'}
              label={'Start Time'}
              variant="inline"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxes.startTimeBox}
                  onChange={handleChangeCheckBox}
                  name="startTimeBox"
                  color="primary"
                />
              }
              label="Exact Time"
            />
          </Grid>
          <Grid>
            <TimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={currentTimeFilter.endTime}
              name={'endTime'}
              label={'End Time'}
              variant="inline"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxes.endTimeBox}
                  onChange={handleChangeCheckBox}
                  name="endTimeBox"
                  color="primary"
                />
              }
              label="Exact Time"
            />
          </Grid>
            {/*<KeyboardTimePicker
              color="secondary"
              handleTimeChange={handleTimeChange}
              time={currentTimeFilter.endTime}
              name={'endTime'}
              label={'End Time'}
              type="hours"
              minutesStep={15}
              placeholder="05:00 AM"
            />*/}
          <Grid>
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
  getCurrentTimeInUTC,
  DateFilter,
  timeDiffInEpoch15
};
