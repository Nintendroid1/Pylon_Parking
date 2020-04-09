import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Check from '@material-ui/icons/Check';
import NavigateLeftIcon from '@material-ui/icons/NavigateBefore';
import NavigateRightIcon from '@material-ui/icons/NavigateNext';
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import { TimePicker } from './forms/parking-spot-components';
import CustomSnackbar from '../ui/snackbars';
import {
  compareMilitaryTime,
  convertMilitaryToEpoch,
  convertEpochToMilitary,
  convertMilitaryTimeToNormal,
  isTimeMultipleOf15,
  roundUpToNearest15
} from './forms/time-filter';
import Box from '@material-ui/core/Box';
import { ConfirmationDialogFieldButton } from './forms/parking-spot-components';
import {
  withStyles,
  withTheme,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';

const ReportField = (
  info,
  updateInfo,
  makeReport,
  getInfo
) => {

  const hasInfo = info.license_info === '' ? false : true;

  const [isOpen, updateIsOpen] = useState(false);
  const [snackbarMessage, updateSnackbarMessage] = useState({
    message: '',
    verticalPos: 'top',
    horizontalPos: 'center'
  });

  const handleOnChange = prop => event => {
    updateInfo({ ...info, [prop]: event.target.value })
  }

  const handleOnClickReport = () => {
    updateSnackbarMessage({
      ...snackbarMessage,
      message: 'Getting License Number'
    });
    updateIsOpen(true);
    makeReport();
  }

  const handleOnClickReport = () => {
    updateSnackbarMessage({
      ...snackbarMessage,
      message: 'Report Sent'
    });
    updateIsOpen(true);
    getInfo();
  }

  return (
    <>
      <CustomSnackbar 
        isOpen={isOpen}
        updateIsOpen={updateIsOpen}
        verticalPos={snackbarMessage.verticalPos}
        horizontalPos={snackbarMessage.horizontalPos}
        message={snackbarMessage.message}
      />
      <TextField
        label="Zone ID"
        type="number"
        value={info.zone_id}
        onChange={handleOnChange('zone_id')}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
      <TextField
        label="Spot ID"
        type="number"
        value={info.spot_id}
        onChange={handleOnChange('spot_id')}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
      <TextField 
        disabled
        label='License Number'
        type='text'
        value={info.license_info}
        variant='filled'
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleOnClickGetInfo}
      >
        Get Info!
      </Button>
      <Button
        disabled={!hasInfo}
        variant='contained'
        color='secondary'
        onClick={handleOnClickReport}
      >
        Report!
      </Button>
    </>
  );
}

const BountySystem = () => {

  const [info, updateInfo] = useState({
    zone_id: 1,
    spot_id: 1,
    license_info: ''
  });

  const [message, updateMessage] = useState(null);

  const handleRequestLicenseInfo = async () => {
    const url = `${apiprefix}/bounty/info`;
    const json = {
      zone_id: info.zone_id,
      spot_id: info.spot_id
    }

    const response = await makeAPICall('GET', url, json);
    const respbody = await response.json();

    if (response.status === 200) {
      updateInfo({ ...info, license_info: respbody });
    } else {
      // Make some kind of error message.
    }
  }

  const handleReport = async () => {
    const url = `${apiprefix}/bounty/report`;
    const json = {
      zone_id: info.zone_id,
      spot_id: info.spot_id
    }

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();

    if (response.status === 200) {
      // make a toaster stating that the report has been received.
    } else {
      // there was an error in the report.
    }
  }

  return (
    <>
      <Typography>
        <CustomSnackbar 

        />
        <ReportField 
          info={info}
          updateInfo={updateInfo}
          makeReport={handleReport}
          getInfo={handleRequestLicenseInfo}
        />
      </Typography>
    </>
  );
}

export default BountySystem;