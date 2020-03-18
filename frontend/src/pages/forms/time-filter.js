import React, { useState } from "react";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { TimePicker } from "./parking-spot-components.js";
import Button from '@material-ui/core/Button';

const TimeFilter = props => {
  const { onSubmit, popUpTitle, popUpContent } = props;

  let today = new Date();
  let timeSplit = today.toTimeString().split(":");
  let currTime = timeSplit[0].concat(":", timeSplit[1]);

  const [time, updateTime] = useState({
    date: today,
    startTime: currTime,
    endTime: "24:00",
    privateKey: "",
    showPrivateKey: false
  });

  const handleDateChange = newDate => {
    updateTime({ ...time, date: newDate });
  };

  const handleSubmit = event => {
    console.log(typeof onSubmit)
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
                "aria-label": "change date"
              }}
            />
          </Grid>
          <Grid>
            <TimePicker
              handleTimeChange={handleTimeChange}
              time={time.startTime}
              name={"startTime"}
              label={"Start Time"}
            />
            <TimePicker
              handleTimeChange={handleTimeChange}
              time={time.endTime}
              name={"endTime"}
              label={"End Time"}
            />
            <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            >
              Filter!
            </Button>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    </>
  );
};

export default TimeFilter;

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