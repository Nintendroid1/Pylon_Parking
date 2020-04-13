import React, { useState, useEffect } from 'react';
import { makeAPICall, makePlateRecogAPICall } from '../api';
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
import QrReader from 'react-qr-reader';
import Camera from 'react-html5-camera-photo';
import { PNG } from "pngjs";
import 'react-html5-camera-photo/build/css/index.css';
import jsQR from "jsqr";
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

/*
Code for coverting base 64 image to unit8clampedarray
*/
const BASE64_MARKER = ';base64,';

const convertDataURIToBinary = (dataURI) => {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for(let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}


/*
for finding the width and height of the image, use:

var i = new Image(); 

i.onload = function(){
 alert( i.width+", "+i.height );
};

i.src = imageData; 
*/

/*
https://github.com/cozmo/jsQR/issues/96
has some example code for converting base 64 image to needed for jsqr.
*/

const CaptureImage = props => {
  const { handleCameraClick } = props;

  const handleTakePhoto = dataUri => {
    handleCameraClick(dataUri);
  }

  return (
    <>
      <Camera 
        onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
      />
    </>
  );
}

const QrReaderField = ({
  handleCameraClick
}) => {

  const handleOnScan = (data) => {
    handleCameraClick(data);
  };

  const handleOnError = err => {
    console.log(err);
  };

  /**
   * delay: the delay between scans in milliseconds, pass in false to disable.
   * legacyMode: default is false. Can allow user to upload photo.
   */
  return (
    <>
      <QrReader
        className={className}
        delay={300}
        onError={handleOnError}
        onScan={handleOnScan}
      />
    </>
  );
}

/*
const ReportField = ({
  info,
  updateInfo,
  makeReport,
  getInfo
}) => {

const ReportField = ({ classes, info, updateInfo, makeReport, getInfo }) => {
  const hasInfo = info.license_info === '' ? false : true;

  const [isOpen, updateIsOpen] = useState(false);
  const [snackbarMessage, updateSnackbarMessage] = useState({
    message: '',
    verticalPos: 'top',
    horizontalPos: 'center'
  });

  const handleOnChange = prop => event => {
    updateInfo({ ...info, [prop]: event.target.value });
  };

  const handleOnClickGetInfo = () => {
    updateSnackbarMessage({
      ...snackbarMessage,
      message: 'Getting License Number'
    });
    updateIsOpen(true);
    makeReport();
  };

  const handleOnClickReport = () => {
    updateSnackbarMessage({
      ...snackbarMessage,
      message: 'Report Sent'
    });
    updateIsOpen(true);
    getInfo();
  };

  // Default is qr reader.
  return (
    <>
      <CustomSnackbar
        isOpen={isOpen}
        updateIsOpen={updateIsOpen}
        verticalPos={snackbarMessage.verticalPos}
        horizontalPos={snackbarMessage.horizontalPos}
        message={snackbarMessage.message}
      />
      <QrReaderField updateData={updateInfo} className={classes.reader} />
      <TextField
        label="Zone ID"
        type="number"
        value={info.zone_id}
        onChange={handleOnChange('zone_id')}
        InputLabelProps={{
          shrink: true
        }}
        variant="outlined"
      />
      <TextField
        label="Spot ID"
        type="number"
        value={info.spot_id}
        onChange={handleOnChange('spot_id')}
        InputLabelProps={{
          shrink: true
        }}
        variant="outlined"
      />
      <TextField
        disabled
        label="License Number"
        type="text"
        value={info.license_info}
        variant="filled"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleOnClickGetInfo}
      >
        Get Info!
      </Button>
      <Button
        disabled={!hasInfo}
        variant="contained"
        color="secondary"
        onClick={handleOnClickReport}
      >
        Report!
      </Button>
    </>
  );
}
*/
const BountySystem = ({ classes, ...props }) => {
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
    };

    const response = await makeAPICall('GET', url, json);
    const respbody = await response.json();

    if (response.status === 200) {
      updateInfo({ ...info, license_info: respbody });
    } else {
      // Make some kind of error message.
    }
  };

  const handleReport = async () => {
    const url = `${apiprefix}/bounty/report`;
    const json = {
      zone_id: info.zone_id,
      spot_id: info.spot_id
    };

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();

    if (response.status === 200) {
      // make a toaster stating that the report has been received?
    } else {
      // there was an error in the report.
    }
  };

  const handleOnCameraClick = async (imageURI) => {
    const dataUri = imageURI;
    const png = PNG.sync.read(
      Buffer.from(dataUri.slice("data:image/png;base64,".length), "base64")
    );
    const code = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
    /*
    const rawImage = convertDataURIToBinary(imageURI);

    const temp = new Image();
    temp.src = imageURI;

    const imageWidth = temp.width;
    const imageHeight = temp.height;

    const code = jsQR(rawImage, imageWidth, imageHeight);
    console.log(code);*/

    const response = await makePlateRecogAPICall(imageURI);
    const respbody = await response.json();

    console.log(respbody);
  };

  return (
    <>
      <Typography>
        <CaptureImage 
          handleCameraClick={handleOnCameraClick}
        />
      </Typography>
    </>
  );
};

export default withTheme(withStyles(styles)(BountySystem));
