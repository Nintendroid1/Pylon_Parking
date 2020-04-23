import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import CustomSnackbar from '../ui/snackbars';
import TableRow from '@material-ui/core/TableRow';
import { Typography, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import RequireAuthentication from '../RequireAuthentication';
import apiprefix from './apiprefix';
import {
  TimePicker,
  LoadingDialog,
  MessageDialog,
  ConfirmationDialogFieldButton,
  ConfirmationDialogWithPassword
} from './forms/parking-spot-components';
import {
  compareMilitaryTime,
  convertMilitaryToEpoch,
  convertEpochToMilitary,
  convertMilitaryTimeToNormal,
  isTimeMultipleOf15,
  roundUpToNearest15,
  militaryTimeDifference,
  minusOneMinMT,
  increaseMTimeBy1Min
} from './forms/time-filter';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  circProgress: {
    marginTop: '200px'
  }
});

const priceStyles = makeStyles({
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  }
});

const SellingMessageContent = (
  parkingSpotStartTime,
  parkingSpotEndTime,
  sellInfo,
  updateSellInfo,
  validTime,
  updateValidTime
) => {
  const today = new Date();
  let isToday = true;

  if (
    today.getFullYear() !== sellInfo.date.getUTCFullYear() ||
    today.getMonth() !== sellInfo.date.getUTCMonth() ||
    today.getDate() !== sellInfo.date.getUTCDate()
  ) {
    isToday = false;
  }

  const [hour, minutes] = today.toTimeString().split(':');
  const currTime = hour + minutes;

  const [validCost, updateValidCost] = useState({
    hasError: false,
    errorMessage: ''
  });

  const priceClasses = priceStyles();

  const [totalCost, UpdateTotalCost] = useState(0);

  // Need to include error handling for time.
  const handleTimeChange = event => {
    let { name, value } = event.target;

    if (!isTimeMultipleOf15(value)) {
      value = roundUpToNearest15(value);
    }

    // Make the end time one second less in the time.
    if (name === 'end_time') {
      value = minusOneMinMT(value);
    }

    updateSellInfo({ ...sellInfo, [name]: value });

    // chosen start time is before parking spot start time or before current time if
    // spot purchased for today.
    if (
      (name === 'start_time' &&
        compareMilitaryTime(value, parkingSpotStartTime) < 0) ||
      (isToday && compareMilitaryTime(value, currTime) < 0)
    ) {
      updateValidTime({
        ...validTime,
        start_timeHasError: true,
        start_timeErrorMessage: 'Start Time Cannot Be Before Current Time.'
      });
    }

    // chosen end time is after parking spot end time.
    else if (
      name === 'end_time' &&
      compareMilitaryTime(value, parkingSpotEndTime) > 0
    ) {
      updateValidTime({
        ...validTime,
        end_timeHasError: true,
        end_timeErrorMessage: 'End Time Cannot Be After Purchased Time.'
      });
    }

    // Chosen end time is before the chosen start time.
    else if (
      name === 'end_time' &&
      compareMilitaryTime(sellInfo.start_time, value) > 0
    ) {
      updateValidTime({
        ...validTime,
        end_timeHasError: true,
        end_timeErrorMessage: 'End Time Cannot Be Before Start Time.'
      });
    } else {
      updateValidTime({
        start_timeErrorMessage:
          '*Your Time Will Be Rounded Up To The Nearest 15 Minutes',
        start_timeHasError: false,
        end_timeHasError: false,
        end_timeErrorMessage: ''
      });
    }
  };

  const handleOnChangeCost = event => {
    const cost = event.target.value;

    if (Number(cost) < 0) {
      updateValidCost({
        hasError: true,
        errorMessage: 'Cost must be at least 0'
      });
    } else {
      updateSellInfo({ ...sellInfo, cost: cost });
      // Remove error message if there are none.
      updateValidCost({
        hasError: false,
        errorMessage: ''
      });
      // update the total cost.
      if (
        !validCost.hasError &&
        !validTime.start_timeHasError &&
        !validTime.end_timeHasError
      ) {
        const timeDiff = militaryTimeDifference(
          sellInfo.start_time,
          increaseMTimeBy1Min(sellInfo.end_time)
        );
        const totalCost = Number(cost) * (timeDiff / 15);
        UpdateTotalCost(totalCost);
      }
    }
  };

  return (
    <>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Start Time:</TableCell>
            <TableCell>
              <TimePicker
                isRequired={true}
                handleTimeChange={handleTimeChange}
                time={sellInfo.start_time}
                name={'start_time'}
                label={'Start Time'}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>End Time:</TableCell>
            <TableCell>
              <TimePicker
                isRequired={true}
                handleTimeChange={handleTimeChange}
                time={sellInfo.end_time}
                name={'end_time'}
                label={'End Time'}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price Per 15 To Sell At:</TableCell>
            <TableCell>
              <TextField
                required
                type="number"
                label={'Cost Per 15 minutes'}
                value={sellInfo.cost}
                helperText={validCost.errorMessage}
                onChange={handleOnChangeCost}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Price:</TableCell>
            <TableCell>
              <TextField
                disabled
                value={totalCost}
                InputProps={{ priceClasses }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

const popUpContent = sellInfoList => {
  return (
    <>
      <Table>
        <TableBody>
          {sellInfoList.map(e => {
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

const SellingParkingSpotTableBody = props => {
  const { parkingSpotsInfo, handleSellRequest } = props;
  const [sellInfo, updateSellInfo] = useState({
    date: new Date(),
    idx: -1,
    spot_id: -1,
    zone_id: -1,
    start_time: '24:00',
    end_time: '24:00',
    cost: 0
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [sellInfoList, updateSellInfoList] = useState([]);
  const [validTime, updateValidTime] = useState({
    start_timeHasError: false,
    start_timeErrorMessage:
      '*Your Time Will Be Rounded Up To The Nearest 15 Minutes',
    end_timeHasError: false,
    end_timeErrorMessage:
      '*Your Time Will Be Rounded Up To The Nearest 15 Minutes'
  });

  const handleOnConfirm = privateKey => {
    handleSellRequest(sellInfo, privateKey);
  };

  const handleSellInfo = spotInfo => () => {
    if (validTime.start_timeHasError || validTime.end_timeHasError) {
      return;
    }

    // console.log(sellInfo);
    const index = parkingSpotsInfo.findIndex(
      e => e.spot_id === spotInfo.spot_id && e.zone_id === spotInfo.zone_id
    );

    // Set the start time to be the current time if the date is today, that start time otherwise.
    let tempStartTime = parkingSpotsInfo[index].start_time;
    const currSpot = parkingSpotsInfo[index];
    const currDate = new Date();

    if (
      currSpot.date.getUTCFullYear() === currDate.getFullYear() &&
      currSpot.date.getUTCMonth() === currDate.getMonth() &&
      currSpot.date.getUTCDate() === currDate.getDate()
    ) {
      // Adding one minute to the current time so that it would always be a valid time.
      tempStartTime = roundUpToNearest15(
        convertEpochToMilitary(Date.now() / 1000 + 60)
      );
    }

    updateSellInfo({
      ...sellInfo,
      idx: index,
      date: parkingSpotsInfo[index].date,
      spot_id: spotInfo.spot_id,
      zone_id: spotInfo.zone_id
    });

    // info to be used when making the confirmation dialog.
    updateSellInfoList([
      { name: 'Zone ID', value: spotInfo.zone_id },
      { name: 'Spot ID', value: spotInfo.spot_id },
      { name: 'Date', value: parkingSpotsInfo[index].date.toDateString() },
      {
        name: 'Start Time',
        value: convertMilitaryTimeToNormal(sellInfo.start_time)
      },
      {
        name: 'End Time',
        value: convertMilitaryTimeToNormal(sellInfo.end_time)
      },
      { name: 'Price per 15 To Sell For', value: sellInfo.cost }
    ]);

    // Opens the confirmation dialog screen.
    setOpenConfirm(true);
  };

  const initSellInfo = (startTime, endTime) => () => {
    updateSellInfo({
      ...sellInfo,
      start_time: startTime,
      end_time: endTime
    });
  };

  return (
    <>
      <ConfirmationDialogWithPassword
        open={openConfirm}
        setOpen={setOpenConfirm}
        buttonMessage="Confirm"
        messageTitle={`Sell Parking Spot ${sellInfo.zone_id}-${sellInfo.spot_id}`}
        requireKey={true}
        messageContent={popUpContent(sellInfoList)}
        handleOnConfirm={handleOnConfirm}
        buttonColor="secondary"
      />
      <TableBody>
        {parkingSpotsInfo.map(parkingSpot => {
          console.log(parkingSpot);
          return (
            <>
              <TableRow>
                <TableCell>
                  <ConfirmationDialogFieldButton
                    buttonMessage="Sell"
                    messageTitle={`Sell Parking Spot ${parkingSpot.zone_id}-${parkingSpot.spot_id}`}
                    requireKey={false}
                    callOnOpen={initSellInfo(
                      parkingSpot.start_time,
                      parkingSpot.end_time
                    )}
                    messageContent={SellingMessageContent(
                      parkingSpot.start_time,
                      parkingSpot.end_time,
                      sellInfo,
                      updateSellInfo,
                      validTime,
                      updateValidTime
                    )}
                    handleOnConfirm={handleSellInfo(parkingSpot)}
                    buttonColor="secondary"
                  />
                </TableCell>
                <TableCell>{parkingSpot.uniqueId}</TableCell>
                <TableCell>{parkingSpot.zone_name}</TableCell>
                <TableCell>{parkingSpot.dateString}</TableCell>
                <TableCell>
                  {convertMilitaryTimeToNormal(parkingSpot.start_time)}
                </TableCell>
                <TableCell>
                  {convertMilitaryTimeToNormal(parkingSpot.end_time)}
                </TableCell>
                <TableCell>{parkingSpot.price}</TableCell>
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </>
  );
};

const SellingParkingSpotTableHeader = () => {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell>
            <span />
          </TableCell>
          <TableCell>Parking Spot ID</TableCell>
          <TableCell>Zone Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell>Total Price</TableCell>
        </TableRow>
      </TableHead>
    </>
  );
};

const SellingParkingSpotTable = props => {
  const { parkingSpotsInfo, handleSellRequest } = props;

  return (
    <>
      <Table stickyHeader>
        <SellingParkingSpotTableHeader />
        <SellingParkingSpotTableBody
          parkingSpotsInfo={parkingSpotsInfo}
          handleSellRequest={handleSellRequest}
        />
      </Table>
    </>
  );
};

const SellPage = ({ socket, isLoggedIn, classes }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOptions, updateSnackbarOptions] = useState({
    verticalPos: 'top',
    horizontalPos: 'center',
    message: '',
    severity: 'info'
  });
  const [loadingDialogField, updateLoadingDialogField] = useState({
    open: false,
    message: ''
  });
  const [openMessageDialog, updateOpenMessageDialog] = useState(false);
  const [messageDialogField, updateMessageDialogField] = useState({
    message: '',
    dialogTitle: ''
  });

  const [message, updateMessage] = useState(
    <>
      <Typography align="center">
        <CircularProgress size={100} className={classes.circProgress} />
      </Typography>
    </>
  );
  let [spotsOwned, updateSpotsOwned] = useState([]);

  let getUserParkingSpots = async () => {
    let url = `${apiprefix}/users/${localStorage.olivia_pid}/spots`;
    let response = await makeAPICall('GET', url);
    let respbody = await response.json();
    // console.log(respbody);

    if (response.status === 200) {
      // Extracting the date and leaving in UTC so no need for further conversion.
      // Converting epoch to military time.
      /*
        respbody = {
          parkingSpotsInfo: [
            {
              zone_name: zone name,
              spot_id: spot id,
              zone_id: zone id,
              price: price per 15,
              start_time: epoch,
              end_time: epoch
            }
          ]
        }
      */
      respbody.parkingSpotsInfo.forEach(e => {
        e.uniqueId = `${e.zone_id}-${e.spot_id}`;
        e.date = new Date(Number(e.start_time) * 1000);
        e.dateString = new Date(
          Number(e.start_time) * 1000
        ).toLocaleDateString('en-US', { timeZone: 'UTC' });
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
      });

      updateSpotsOwned(respbody.parkingSpotsInfo);
      updateMessage(null);
    } else {
      // Error message for when an error occurs.
      updateMessageDialogField({
        message: respbody.message,
        dialogTitle: 'Error'
      });
      updateOpenMessageDialog(true);
      console.log(respbody);
    }
  };

  const handleSellRequest = async (sellInfo, privatekey) => {
    updateLoadingDialogField({
      open: true,
      message:
        "Our Professional Team Of Robbers Is Escorting Your Request To Headquarters. Don't Worry, They Are Professionals..."
    });

    // Make sure that the date field is correct.
    console.log(sellInfo.date);
    const startUTCEpoch = convertMilitaryToEpoch(
      sellInfo.date,
      sellInfo.start_time
    );
    const endUTCEpoch = convertMilitaryToEpoch(
      sellInfo.date,
      sellInfo.end_time
    );

    // Make api request.
    /*
    sellInfo = {
      date: Date.now(),
      spot_id: -1,
      zone_id: -1,
      start_time: '24:00',
      end_time: '24:00',
      cost: 0
    }
    */
    const url = `${apiprefix}/sell`;
    const json = {
      key: privatekey,
      pid: localStorage.olivia_pid,
      spot: {
        spot_id: sellInfo.spot_id,
        zone_id: sellInfo.zone_id,
        start_time: startUTCEpoch,
        end_time: endUTCEpoch,
        price: Number(sellInfo.cost) // price is per 15.
      }
    };

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();
    updateLoadingDialogField({
      open: false,
      message: ''
    });

    if (response.status === 200) {
      let newList = [];
      let curr = null;
      respbody.rows.forEach(e => {
        if (curr === null) {
          curr = e;
          curr.start_time = Number(curr.time_code);
          curr.end_time = curr.start_time + 15 * 60; // epoch time in seconds, not ms
        } else {
          if (curr.end_time === Number(e.time_code)) {
            curr.end_time += 15 * 60;
          } else {
            // Is the end time greater than the current time, if so, then it is still
            // rented by the current user, otherwise, not so no need to list it.
            if (curr.end_time > Date.now()) {
              curr.start_time = convertEpochToMilitary(curr.start_time);
              curr.end_time = convertEpochToMilitary(curr.end_time);
              newList.append(curr);
            }
            curr = null;
          }
        }
      });

      // Remove old stuff from the list.
      //spotsOwned.splice(sellInfo.idx, 1);

      // Adding new stuff to the list.
      /*
      newList.forEach((e, idx) => {
        spotsOwned.splice(sellInfo.idx + idx, 0, e);
      });

      updateSpotsOwned(spotsOwned);
*/
      updateMessageDialogField({
        dialogTitle: 'Success',
        message:
          'Congrats, Your Request Has Been Granted! Mind Sharing Some Of That Wealth With Us? Please?'
      });
      updateOpenMessageDialog(true);
    } else {
      updateMessageDialogField({
        dialogTitle: 'Error',
        message: respbody.message
      });
      updateOpenMessageDialog(true);
      /*
      updateOpenMessageDialog(true);
      updateSnackbarOptions({
        ...snackbarOptions,
        message:
          'Oh no, the robbers found out you lied to them. Quick, fix the error before they find your credit card info.',
        severity: 'error'
      });*/
    }
  };

  // Need another socket event for when parking spot is sold.
  useEffect(() => {
    getUserParkingSpots();
  }, []);

  useEffect(() => {
    // data = {
    //  zone_id
    //  spot_id
    // }
    socket.on(`sell-${localStorage.olivia_pid}`, () => {
      setOpenSnackbar(false);

      // Make it so that the data variable stores the message.
      updateSnackbarOptions({
        ...snackbarOptions,
        message:
          'You Got Rich! Go To Account To See How Much Disposable Income You Have.',
        severity: 'info'
      });
      setOpenSnackbar(true);
    });

    /*
    // Not needed because the spot is taken care of once the seller sells,
       thus, preventing sellers from using the spot and avoids other complications.
    socket.on(`user-${localStorage.olivia_pid}`, data => {
      const index = spotsOwned.findIndex(e => {
        const tempStartTime = convertMilitaryToEpoch(e.date, e.start_time);
        const tempEndTime = convertMilitaryToEpoch(e.date, e.end_time);

        return (
          Number(e.zone_id) === Number(data.zone_id) &&
          Number(e.spot_id) === Number(data.spot_id) &&
          tempStartTime <= Number(data.start_time) &&
          tempEndTime >= Number(data.start_time)
        );
      });

      spotsOwned = spotsOwned.splice(index, 1);
      updateSpotsOwned(spotsOwned);
      */
    // });
  }, []);

  // Change to something more meaningful.
  return (
    <>
      <div>
        <CustomSnackbar
          isOpen={openSnackbar}
          updateIsOpen={setOpenSnackbar}
          verticalPos={snackbarOptions.verticalPos}
          horizontalPos={snackbarOptions.horizontalPos}
          message={snackbarOptions.message}
          severity={snackbarOptions.severity}
        />
        <MessageDialog
          message={messageDialogField.message}
          dialogTitle={messageDialogField.dialogTitle}
          open={openMessageDialog}
          setOpen={updateOpenMessageDialog}
        />
        <LoadingDialog
          message={loadingDialogField.message}
          open={loadingDialogField.open}
        />
        {message ? (
          <Typography>{message}</Typography>
        ) : (
          <>
            <SellingParkingSpotTable
              parkingSpotsInfo={spotsOwned}
              handleSellRequest={handleSellRequest}
            />
          </>
        )}
      </div>
    </>
  );
};

export default withStyles(styles)(RequireAuthentication(SellPage));
