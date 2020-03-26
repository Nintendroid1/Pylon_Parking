import React, { useState } from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { TimePicker } from './parking-spot-components.js';
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

const compareMilitaryTime = (time1, time2) => {
  time1 = time1.split(':');
  time2 = time2.split(':');

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

const TimeFilter = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  ...props
}) => {
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

  const handleSubmit = event => {
    console.log(typeof onSubmit);
    console.log(time);
    onSubmit(time);
  };

  const handleTimeChange = event => {
    let { name, value } = event.target;
    updateTime({ ...time, [name]: value });
    //updateCost(calculateCost(time.startTime, time.endTime));
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
            <TimePicker
              handleTimeChange={handleTimeChange}
              time={time.startTime}
              name={'startTime'}
              label={'Start Time'}
            />
            <TimePicker
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

// export default {
//   TimeFilter,
//   compareMilitaryTime
// };
export default withStyles(styles)(TimeFilter);

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
