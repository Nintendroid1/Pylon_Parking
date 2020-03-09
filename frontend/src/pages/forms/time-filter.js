import React, { useState } from 'react';
//import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Check from '@material-ui/icons/Check';
import NavigateLeftIcon from '@material-ui/icons/NavigateBefore';
import NavigateRightIcon from '@material-ui/icons/NavigateNext';
import { Typography, CircularProgress } from '@material-ui/core';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
//import history from '../history';
import { Link } from 'react-router-dom';
//import apiprefix from './apiprefix';
import QueueIcon from '@material-ui/icons/Queue';
import orderBy from 'lodash/orderBy';
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { StartEndTime } from './parking-spot-components.js';

const TimeFilter = (...props) => {
  const { onSubmit, popUpTitle, popUpContent } = props;

  let today = new Date();
  let timeSplit = today.toTimeString().split(":");
  let currTime = timeSplit[0].concat(":", timeSplit[1]);
  
  const [time, updateTime] = useState({
    date: today,
    startTime: currTime,
    endTime: "24:00",
    privateKey: "",
    showPrivateKey: false,
  });

  const handleTimeChange = event => {
    let { name, value } = event.target;
    updateTime({ ...time, [name]: value });
  };

  const handleDateChange = newDate => {
    updateTime({ ...time, date: newDate })
  }

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
                "aria-label": "change date"
              }}
            />
          </Grid>
          <Grid>
            <StartEndTime  
              time={time} 
              buttonName={"Filter"} 
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