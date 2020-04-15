import React, { useState, useEffect } from 'react';
import { makeAPICall, makeImageAPICall } from '../api';
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
import DialogContentText from '@material-ui/core/DialogContentText';
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import CustomSnackbar from '../ui/snackbars';
import { TimePicker } from './forms/parking-spot-components';
import CustomSnackbar from '../ui/snackbars';
// import QrReader from 'react-qr-reader';
import Camera from 'react-html5-camera-photo';
import { PNG } from 'pngjs';
import 'react-html5-camera-photo/build/css/index.css';
import jsQR from 'jsqr';
import {
  compareMilitaryTime,
  convertMilitaryToEpoch,
  convertEpochToMilitary,
  convertMilitaryTimeToNormal,
  isTimeMultipleOf15,
  roundUpToNearest15
} from './forms/time-filter';
import Box from '@material-ui/core/Box';
import { MessageDialog } from './forms/parking-spot-components';
import {
  withStyles,
  withTheme,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar
});

/*
Code for coverting base 64 image to unit8clampedarray
*/
const BASE64_MARKER = ';base64,';

const convertDataURIToBinary = dataURI => {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};

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
  };

  return (
    <>
      <Camera
        onTakePhoto={dataUri => {
          handleTakePhoto(dataUri);
        }}
      />
    </>
  );
};

const popUpContent = info => {
  const infoList = [
    { name: 'Zone ID', value: `${info.zone_id}` },
    { name: 'Spot ID', value: `${info.spot_id}` },
    { name: 'License Plate Number', value: `${info.license_info}` }
  ];

  return (
    <>
      <Table>
        <TableBody>
          {infoList.map(e => {
            return (
              <>
                <TableRow>
                  <TableCell>{`${e.name}: `}</TableCell>
                  <TableCell>{e.value}</TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

const ReportField = props => {
  const { handleReport, setOpenSnackbar, snackbarOptions, updateSnackbarOptions } = props;

  const [open, setOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  
  const [openInstrDialog, setOpenInstrDialog] = useState(true);
  const [errorMessage, updateErrorMessage] = useState('');
  const [info, updateInfo] = useState({
    zone_id: -1,
    spot_id: -1,
    license_info: ''
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    updateSnackbarOptions({
      ...snackbarOptions,
      message: 'Sending Info To Headquarters For Confirmation',
      severity: 'info'
    })
    setOpenSnackbar(true);
    setOpen(false);
    handleReport(info);
  };

  const handleOnCameraClick = async imageURI => {
    updateSnackbarOptions({
      ...snackbarOptions,
      message: 'Using Alien Technology To Analyze Image',
      severity: 'info'
    })
    const dataUri = imageURI;
    const png = PNG.sync.read(
      Buffer.from(dataUri.slice('data:image/png;base64,'.length), 'base64')
    );
    const code = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);

    // Do error checking of code where only make api call if qr code is valid.
    if (code === null) {
      // error message.
      console.log('no qr code found');
      setOpenSnackbar(false);
      updateErrorMessage('The QR Code was invalid. Please take a better picture you pleb.');
      setOpenErrorDialog(true);
    } else {
      // the data in the qr code will be of the form zone_id-spot_id.
      const [zone_id, spot_id] = code.data.split('-');
      // the data in the qr code will be of the form zone_id-spot_id.
      // const [zone_id, spot_id] = code.data.split('-');
      try {
        const url = `${apiprefix}/bounty-system`;
        const response = await makeImageAPICall('POST', url, imageURI);
        const respbody = await response.json();
        
        setOpenSnackbar(false);

        if (response.status === 200) {
          // make a dialog for confirmation of the info.
          updateInfo({
            zone_id: 2,
            spot_id: 1,
            license_info: respbody.results[0].plate
          });

          setOpen(true);
        } else {
          setOpenErrorDialog(true);
          updateErrorMessage('The license plate was unable to be read. I dare u take another picture, I double dog dare you.')
        }
        
      } catch (err) {
        console.log(err.stack);
      }
    }
  };

  return (
    <>
      <CaptureImage handleCameraClick={handleOnCameraClick} />
      <MessageDialog 
        message='Please take a picture that includes the a single license plate and a single qr code.'
        dialogTitle='Instructions'
        open={openInstrDialog}
        setOpen={setOpenInstrDialog}
      />
      <MessageDialog 
        message={errorMessage}
        dialogTitle='Error'
        open={openErrorDialog}
        setOpen={setOpenErrorDialog}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Report Info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Is the following information correct?
          </DialogContentText>
          <DialogContentText>
            <Table>{popUpContent(info)}</Table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const BountySystem = ({ classes, setOpenSnackbar, snackbarOptions, updateSnackbarOptions, ...props }) => {
  const [message, updateMessage] = useState(null);

  const handleReport = async info => {
    const url = `${apiprefix}/bounty-system/report`;
    const json = {
      zone_id: info.zone_id,
      spot_id: info.spot_id,
      license_info: info.license_info
    };

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();
    setOpenSnackbar(false);

    if (response.status === 200) {
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'Headquarters Successfully Received Your Report.',
        severity: 'success'
      })
      setOpenSnackbar(true);
    } else {
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'Oh no, the dog intercepted the message. Please take another picture',
        severity: 'error'
      })
    }
  };

  return (
    <>
      <Typography>
        <Paper>
          <ReportField 
            handleReport={handleReport}
            setOpenSnackbar={setOpenSnackbar}
            snackbarOptions={snackbarOptions}
            updateSnackbarOptions={updateSnackbarOptions}
          />
        </Paper>
      </Typography>
    </>
  );
};

export default withTheme(withStyles(styles)(BountySystem));
