import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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

const ConfirmationDialogFieldButton = props => {
  const {
    buttonMessage,
    messageTitle,
    messageContent,
    handleOnConfirm,
    buttonColor,
    requireKey
  } = props;
  const [open, setOpen] = useState(false);

  if (requireKey === undefined) {
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
            {requireKey ? (
              <Grid>
                <PrivateKeyField
                  privateKey={privateKey}
                  updatePrivateKey={updatePrivateKey}
                />
              </Grid>
            ) : null
            }
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
  TimePicker
};
