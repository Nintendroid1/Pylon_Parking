import React, { useState } from 'react';
import { makeAPICall } from '../api';
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
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const TimePicker = (props) => {
  const{ handleTimeChange, time, name, label } = props;

  return (
    <TextField
      label={label}
      name={name}
      type="time"
      value={time.startTime}
      onChange={handleTimeChange}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step: 900,
      }}
    />
  )
}

const ConfirmationDialogButton = (props) => {
  const { buttonMessage, messageTitle, messageContent } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={handleClickOpen}
      >
        {buttonMessage}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {messageTitle}
        </DialogTitle>
        <DialogContentText>
          {messageContent}
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const StartEndTime = (props) => {
  const { time, buttonName, updateTime, popUpTitle, popUpContent } = props;

  const handleTimeChange = event => {
    let { name, value } = event.target;
    updateTime({ ...time, [name]: value });
  };

  return (
    <>
      <TimePicker 
        handleTimeChange={handleTimeChange} 
        time={time} 
        name={"startTime"} 
        label={"Start Time"} 
      />
      <TimePicker 
        handleTimeChange={handleTimeChange} 
        time={time} 
        name={"endTime"} 
        label={"End Time"} 
      />
      <ConfirmationDialogButton 
        buttonMessage={buttonName}
        messageTitle={popUpTitle}
        messageContent={popUpContent}
      />
    </>
  );
}

export {
  StartEndTime,
  ConfirmationDialogButton,
}