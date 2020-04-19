/**
 * Exports the component that handles the Bounty System.
 * 
 * The Bounty System uses a third-party service: https://platerecognizer.com/#introduction
 * This link is to their api: http://docs.platerecognizer.com/#introduction
 * 
 * The Bounty System also uses a QR reader and expects the user to take
 * a single picture containing both the QR code and the license plate.
 */

import React, { useState, useEffect } from 'react';
import { makeAPICall, makeImageAPICall } from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import apiprefix from './apiprefix';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { LoadingDialog } from './forms/parking-spot-components';
import Camera from 'react-html5-camera-photo';
import { PNG } from 'pngjs';
import 'react-html5-camera-photo/build/css/index.css';
import jsQR from 'jsqr';
import { MessageDialog } from './forms/parking-spot-components';
import {
  withStyles,
  withTheme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar
});

/*
  Component containing the camera.
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

/*
  The content to be displayed in the confirmation message.
*/
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

/*
  Handles the logic for what happens after a picture is taken.

  Makes an API call to our backend requesting for the license plate in the image to be read.
  Then, displays a confirmation message for the user to confirm the info, if incorrect,
  then expects user to retake the photo.
*/
const ReportField = props => {
  const { handleReport, setOpenSnackbar, snackbarOptions, updateSnackbarOptions, updateLoadingDialogField } = props;

  // Used to open the dialog for confirming info.
  const [open, setOpen] = useState(false);

  // Used to open the dialog for displaying error info.
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  
  // Used to open the dialog for giving instructions on how to use.
  const [openInstrDialog, setOpenInstrDialog] = useState(true);

  // Stores the error message.
  const [errorMessage, updateErrorMessage] = useState('');

  // Stores the information read from the photo.
  const [info, updateInfo] = useState({
    zone_id: -1,
    spot_id: -1,
    license_info: ''
  });

  const handleClose = () => {
    setOpen(false);
  };

  // Closes all dialogs and sends info to the backend.
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

  // Handles processing the info from the image.
  const handleOnCameraClick = async imageURI => {
    updateLoadingDialogField({
      open: true,
      message: 'Using Alien Technology To Analyze Image. Please Wait.'
    });
    updateSnackbarOptions({
      ...snackbarOptions,
      message: 'Using Alien Technology To Analyze Image',
      severity: 'info'
    });

    // Attempts to read the QR code in the picture, if it exists.
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
        // Request the backend to read the license plate in the image.
        const url = `${apiprefix}/bounty-system`;
        const response = await makeImageAPICall('POST', url, imageURI);
        const respbody = await response.json();
        
        setOpenSnackbar(false);
        updateLoadingDialogField({
          open: false,
          message: ''
        });

        if (response.status === 200) {
          // Checks if there exists multiple license plates and confidence level of ML model;
          // if there are, then retake the photo.
          if (respbody.results.length !== 1 || 
              respbody.results[0].dscore < 0.5 || 
              respbody.results[0].score < 0.5) {

            updateErrorMessage('Our machine does not understand the language your license plate is in. Please translate it or take another picture.');
            setOpenErrorDialog(true);
          } else {
            updateInfo({
              zone_id: zone_id,
              spot_id: spot_id,
              license_info: respbody.results[0].plate
            });
  
            setOpen(true);
          }
        } else {
          updateErrorMessage('The license plate was unable to be read. I dare u take another picture, I double dog dare you.')
          setOpenErrorDialog(true);
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
            Is the following information correct? If not, please retake photo.
          </DialogContentText>
          <DialogContentText>
            <Table>{popUpContent(info)}</Table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/*
  The component that is exported. Makes the API call to send a report.
*/
const BountySystem = ({ classes, userSocket, setOpenSnackbar, snackbarOptions, updateSnackbarOptions }) => {
  const [message, updateMessage] = useState({
    message: '',
    dialogTitle: ''
  });
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [loadingDialogField, updateLoadingDialogField] = useState({
    open: false,
    message: ''
  });

  // Sends the info captured by the camera to the backend for further processing.
  const handleReport = async info => {
    updateLoadingDialogField({
      open: true,
      message: 'Getting Someone Fired'
    });
    const url = `${apiprefix}/bounty-system/report`;
    const json = {
      zone_id: info.zone_id,
      spot_id: info.spot_id,
      license_info: info.license_info
    };

    const response = await makeAPICall('POST', url, json);
    setOpenSnackbar(false);
    updateLoadingDialogField({
      open: false,
      message: ''
    });

    if (response.status === 200) {
      // Let the user know that the backend has received the info.
      updateMessage({
        message: 'Thank you for the extra work. We will now check if the driver is illegal',
        dialogTitle: 'Success!!!!'
      });
      setOpenMessageDialog(true);
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'Headquarters Successfully Received Your Report.',
        severity: 'success'
      })
      setOpenSnackbar(true);
    } else {
      // Let the user know that an error has occurred.
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'Oh no, the dog intercepted the message. Please take another picture',
        severity: 'error'
      })
    }
  };

  useEffect(() => {
    // Socket used to notify the client something personal.
    userSocket.on(`sell-${localStorage.olivia_pid}`, () => {
      setOpenSnackbar(false);

      // Make it so that the data variable stores the message.
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'You Got Rich! Go To Account To See How Much Disposable Income You Have.',
        severity: 'info'
      })
    });
  });

  return (
    <>
      <Typography>
        <MessageDialog 
          open={openMessageDialog}
          setOpen={setOpenMessageDialog}
          message={message.message}
          dialogTitle={message.dialogTitle}
        />
        <LoadingDialog 
          open={loadingDialogField.open}
          message={loadingDialogField.message}
        />
        <Paper>
          <ReportField 
            handleReport={handleReport}
            setOpenSnackbar={setOpenSnackbar}
            snackbarOptions={snackbarOptions}
            updateSnackbarOptions={updateSnackbarOptions}
            updateLoadingDialogField={updateLoadingDialogField}
          />
        </Paper>
      </Typography>
    </>
  );
};

export default withTheme(withStyles(styles)(BountySystem));
