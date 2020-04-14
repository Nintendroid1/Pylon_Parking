import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Check from '@material-ui/icons/Check';
import NavigateLeftIcon from '@material-ui/icons/NavigateBefore';
import NavigateRightIcon from '@material-ui/icons/NavigateNext';
import { Typography, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import { TimePicker } from './forms/parking-spot-components';
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

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  circProgress: {
    marginTop: '200px'
  }
});

const tempParkingSpots = [
  {
    id: '1',
    start_time: '13:00',
    end_time: '15:00',
    cost: 3
  },
  {
    id: '2',
    start_time: '4:00',
    end_time: '5:00',
    cost: 3
  }
];

const SellingMessageContent = (
  parkingSpotstart_time,
  parkingSpotend_time,
  sellInfo,
  updateSellInfo
) => {
  const [validCost, updateValidCost] = useState({
    hasError: false,
    errorMessage: ''
  });

  const [validTime, updateValidTime] = useState({
    start_timeHasError: false,
    start_timeErrorMessage: '',
    end_timeHasError: false,
    end_timeErrorMessage: ''
  });

  const [totalCost, UpdateTotalCost] = useState(0);

  // Need to include error handling for time.
  const handleTimeChange = event => {
    let { name, value } = event.target;

    if (!isTimeMultipleOf15(value)) {
      value = roundUpToNearest15(value);
    }

    updateSellInfo({ ...sellInfo, [name]: value });

    let today = new Date();
    let timeSplit = today.toTimeString().split(':');
    let currTime = timeSplit[0].concat(':', timeSplit[1]);

    // chosen start time is before parking spot start time.
    if (name === 'start_time' && compareMilitaryTime(value, currTime) < 0) {
      updateValidTime({
        ...validTime,
        start_timeHasError: true,
        start_timeErrorMessage: 'Start Time Cannot Be Before Current Time.'
      });
    }

    // chosen end time is after parking spot end time.
    else if (
      name === 'end_time' &&
      compareMilitaryTime(value, parkingSpotend_time) > 0
    ) {
      updateValidTime({
        ...validTime,
        end_timeHasError: true,
        start_timeErrorMessage: 'End Time Cannot Be After Purchased Time.'
      });
    }
  };

  const handleOnChangeCost = event => {
    const cost = event.target.value;

    if (isNaN(cost)) {
      updateValidCost({
        hasError: true,
        errorMessage: 'Invalid characters detected. Must be a decimal number'
      });
    } else if (Number(cost) < 0) {
      updateValidCost({
        hasError: true,
        errorMessage: 'Cost must be at least 0'
      });
    } else {
      updateSellInfo({ ...sellInfo, price: Number(cost) });
      // update the total cost.
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
                time={sellInfo.start_time}
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
                error={validCost.hasError}
                label={'Cost Per 15 minutes'}
                value={sellInfo.price}
                helperText={validCost.errorMessage}
                onChange={handleOnChangeCost}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Price For Entire Time Period:</TableCell>
            <TableCell>
              <TextField
                disabled
                label={'Total Cost'}
                value={totalCost}
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
    date: Date.now(),
    spot_id: -1,
    zone_id: -1,
    start_time: '24:00',
    end_time: '24:00',
    cost: 0
  });

  const handleOnConfirm = privateKey => {
    handleSellRequest(sellInfo, privateKey);
  };

  const handleSellInfo = (spotInfo) => () => {
    console.log(sellInfo);
    const index = parkingSpotsInfo.findIndex(
      e => e.spot_id === spotInfo.spot_id && e.zone_id === spotInfo.zone_id
    );

    updateSellInfo({ ...sellInfo, date: parkingSpotsInfo[index].date });

    // Not sure if the sellInfo is update yet, last time it was not.
    let sellInfoList = [
      { name: 'Zone ID', value: sellInfo.zone_id },
      { name: 'Spot ID', value: sellInfo.spot_id },
      { name: 'Date', value: sellInfo.date.toDateString() },
      {
        name: 'Start Time',
        value: convertMilitaryTimeToNormal(sellInfo.start_time)
      },
      {
        name: 'End Time',
        value: convertMilitaryTimeToNormal(sellInfo.end_time)
      },
      { name: 'Price per 15 To Sell For', value: sellInfo.cost }
    ];

    return (
      <>
        <ConfirmationDialogFieldButton
          buttonMessage="Sell"
          messageTitle={`Sell Parking Spot ${parkingSpot.uniqueId}`}
          requireKey={true}
          messageContent={popUpContent(sellInfoList)}
          handleOnConfirm={handleOnConfirm}
          buttonColor="secondary"
        />
      </>
    );
  };

  return (
    <>
      <TableBody>
        {parkingSpotsInfo.map((parkingSpot, i) => {
          console.log(parkingSpot);
          return (
            <>
              <TableRow>
                <TableCell>
                  <ConfirmationDialogFieldButton
                    buttonMessage="Sell"
                    messageTitle={`Sell Parking Spot ${parkingSpot.zone_id}-${parkingSpot.spot_id}`}
                    requireKey={false}
                    messageContent={SellingMessageContent(
                      parkingSpot.start_time,
                      parkingSpot.end_time,
                      sellInfo,
                      updateSellInfo
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
          <TableCell>Average Price Per 15 minutes</TableCell>
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

const SellPage = ({ socket, isLoggedIn, classes, ...props }) => {
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
        e.dateString = new Date(Number(e.start_time) * 1000).toLocaleDateString('en-US', { timeZone: 'UTC' });
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
      });

      updateSpotsOwned(respbody.parkingSpotsInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Failed to get user.</div>);
      console.log(respbody);
    }
  };

  const handleSellRequest = async (sellInfo, privatekey) => {
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
    date: Date.now(),
    spot_id: -1,
    zone_id: -1,
    start_time: '24:00',
    end_time: '24:00',
    cost: 0
    */
    const url = `${apiprefix}/sell`;
    const json = {
      pid: localStorage.olivia_pid,
      spot: {
        spot_id: sellInfo.spot_id,
        zone_id: sellInfo.zone_id,
        start_time: startUTCEpoch,
        end_time: endUTCEpoch,
        price: cost // price is per 15.
      }
    }

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();

    if (response.status === 200) {
      // Do something.
    } else {
      // Do something.
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
    socket.on(`user-${localStorage.olivia_pid}`, data => {
      const index = spotsOwned.findIndex(
        e =>
          Number(e.zone_id) === Number(data.zone_id) &&
          Number(e.spot_id) === Number(data.spot_id)
      );

      spotsOwned = spotsOwned.splice(index, 1);
      updateSpotsOwned(spotsOwned);
    });
  }, []);

  // Change to something more meaningful.
  return (
    <>
      <div>
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
