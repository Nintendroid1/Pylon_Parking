/**
 * Contains functions and components that are used by other components.
 */

import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isTimeMultipleOf15, roundUpToNearest15 } from './time-filter';
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

/*
  Component for displaying the cost.
*/
const CostField = props => {
  const { cost } = props;

  return (
    <>
      <TextField
        disabled
        id="filled-disabled"
        label="Approximate Price"
        defaultValue="Enter an End Time"
        value={cost}
        variant="filled"
      />
    </>
  );
};

// The private key is stored in the 'key' property of the privateKey object,
// which is a state and is the time state originally.
/*
  Creates the private key field to allow the user to enter
  their private key.
*/
const PrivateKeyField = props => {
  const { privateKey, updatePrivateKey } = props;

  const handleChange = event => {
    updatePrivateKey({ ...privateKey, privateKey: event.target.value });
  };

  const handleClickShowKey = () => {
    updatePrivateKey({
      ...privateKey,
      showPrivateKey: !privateKey.showPrivateKey
    });
  };

  return (
    <>
      <FormControl required variant="outlined">
        <InputLabel>Private Key</InputLabel>
        <OutlinedInput
          id="private-key"
          type={privateKey.showPrivateKey ? 'text' : 'password'}
          value={privateKey.privateKey}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowKey}
                edge="end"
              >
                {privateKey.showPrivateKey ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
      </FormControl>
    </>
  );
};

/*
  A component that allows the user to pick a time by selecting
  the hour, minutes, and AM/PM. Also updates the info.
*/
const TimePicker = ({
  handleTimeChange,
  time,
  name,
  label,
  hasError,
  errorMessage,
  isRequired,
  ...props
}) => {
  if (hasError === undefined) {
    hasError = false;
  }

  if (errorMessage === undefined) {
    errorMessage = '';
  }

  if (isRequired === undefined) {
    isRequired = false;
  }

  return (
    <TextField
      required={isRequired}
      error={hasError}
      label={label}
      name={name}
      type="time"
      value={time}
      onChange={handleTimeChange}
      helperText={errorMessage}
      InputLabelProps={{
        shrink: true
      }}
      inputProps={{
        step: 900
      }}
    />
  );
};

/*
  Component that displays the given message with the given
  dialog title in a Dialog component.
*/
const MessageDialog = (props) => {
  const { message, dialogTitle, open, setOpen } = props;
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/*
  A dialog component that displays the message and a loading
  icon in a dialog. There is no way for user to close it, coder
  has to manually close it.
*/
const LoadingDialog = (props) => {
  const { message, open } = props;

  return (
    <>
      <Dialog open={open}>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </>
  );
}

/*
  A custom dialog component that displays the given message and
  asks for the private key if needed.
*/
const ConfirmationDialogFieldButton = ({
  buttonMessage,
  messageTitle,
  messageContent,
  handleOnConfirm,
  buttonColor,
  requireKey,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  if (typeof requireKey === 'undefined') {
    requireKey = true;
  }

  const [privateKey, updatePrivateKey] = useState({
    privateKey: '',
    showPrivateKey: false
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    updatePrivateKey({
      privateKey: '',
      showPrivateKey: false
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setOpen(false);
    handleOnConfirm(privateKey.privateKey);
  };

  return (
    <div>
      <Button variant="outlined" color={buttonColor} onClick={handleClickOpen}>
        {buttonMessage}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{messageTitle}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid>{messageContent}</Grid>
            <Grid>
              {requireKey ? (
                <PrivateKeyField
                  privateKey={privateKey}
                  updatePrivateKey={updatePrivateKey}
                />
              ) : null}
            </Grid>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Confirm
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Used by parking-spot.js
/*
  A component that contains a start time time picker, an end time
  time picker, and a date picker. Also calculates the price for of
  the spots given the specified start time and end time.
*/
const StartEndTime = props => {
  const {
    time,
    buttonName,
    updateTime,
    popUpTitle,
    popUpContent,
    handleOnConfirm,
    calculateCost,
    noButton
  } = props;

  const [cost, updateCost] = useState('N/A');

  const handleTimeChange = event => {
    let { name, value } = event.target;

    if (!isTimeMultipleOf15(value)) {
      value = roundUpToNearest15(value);
    }

    updateTime({ ...time, [name]: value });
    updateCost(calculateCost(time.startTime, time.endTime));
  };

  return (
    <>
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
        {noButton ? null : (
          <ConfirmationDialogFieldButton
            buttonMessage={buttonName}
            messageTitle={popUpTitle}
            messageContent={popUpContent}
            handleOnConfirm={handleOnConfirm}
            buttonColor="primary"
          />
        )}
      </Grid>
      <Grid>
        <CostField cost={cost} />
      </Grid>
    </>
  );
};

export {
  StartEndTime,
  ConfirmationDialogFieldButton,
  PrivateKeyField,
  CostField,
  TimePicker,
  MessageDialog,
  LoadingDialog
};
