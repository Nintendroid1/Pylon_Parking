import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
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
  }
});

const tempParkingSpots = [
  {
    id: '1',
    startTime: '13:00',
    endTime: '15:00',
    cost: 3
  },
  {
    id: '2',
    startTime: '4:00',
    endTime: '5:00',
    cost: 3
  }
];

const tempInput = {
  pid: 'Bob',
  email: 'Bob@vt.edu',
  money: 15,
  parkingSpotsInfo: tempParkingSpots
};

const SellingMessageContent = (
  parkingSpotStartTime,
  parkingSpotEndTime,
  sellInfo,
  updateSellInfo
) => {

  const [ validCost, updateValidCost ] = useState({
    hasError: false,
    errorMessage: ''
  });

  const [validTime, updateValidTime] = useState({
    startTimeHasError: false,
    startTimeErrorMessage: '',
    endTimeHasError: false,
    endTimeErrorMessage: ''
  });

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
    if (name === 'startTime' && compareMilitaryTime(value, currTime) < 0) {
      updateValidTime({
        ...validTime,
        startTimeHasError: true,
        startTimeErrorMessage: 'Start Time Cannot Be Before Current Time.'
      });
    }

    // chosen end time is after parking spot end time.
    else if (
      name === 'endTime' &&
      compareMilitaryTime(value, parkingSpotEndTime) > 0
    ) {
      updateValidTime({
        ...validTime,
        endTimeHasError: true,
        startTimeErrorMessage: 'End Time Cannot Be After Purchased Time.'
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
      updateSellInfo({ ...sellInfo, cost: Number(cost) });
    }
  };

  return (
    <>
      <TimePicker
        isRequired={true}
        handleTimeChange={handleTimeChange}
        time={sellInfo.startTime}
        name={'startTime'}
        label={'Start Time'}
      />
      <TimePicker
        isRequired={true}
        handleTimeChange={handleTimeChange}
        time={sellInfo.endTime}
        name={'endTime'}
        label={'End Time'}
      />
      <TextField
        required
        error={validCost.hasError}
        label={'Cost Per 15 minutes'}
        value={sellInfo.cost}
        helperText={validCost.errorMessage}
        onChange={handleOnChangeCost}
      />
    </>
  );
};

const SellingParkingSpotTableBody = props => {
  const { parkingSpotsInfo, handleSellRequest } = props;
  const [sellInfo, updateSellInfo] = useState({
    date: Date.now(),
    parkingSpotId: -1,
    startTime: '24:00',
    endTime: '24:00',
    cost: 0,
  });
  const [privateKey, updatePrivateKey] = useState({
    privateKey: '',
    showPrivateKey: false
  })

  const handleOnConfirm = () => {
    const index = parkingSpotsInfo.findIndex(e => e.id === sellInfo.parkingSpotId);
    const date = parkingSpotsInfo[index].date;
    updateSellInfo({ ...sellInfo, date: date });
    handleSellRequest(sellInfo, privateKey.privateKey);
  }

  return (
    <>
      <TableBody>
        {parkingSpotsInfo.map((parkingSpot, i) => {
          return (
            <>
              <TableRow>
                <TableCell>{parkingSpot.id}</TableCell>
                <TableCell>{convertMilitaryTimeToNormal(parkingSpot.startTime)}</TableCell>
                <TableCell>{convertMilitaryTimeToNormal(parkingSpot.endTime)}</TableCell>
                <TableCell>{parkingSpot.cost}</TableCell>
                <TableCell>
                  <ConfirmationDialogFieldButton 
                    buttonMessage='Sell'
                    messageTitle={`Sell Parking Spot ${parkingSpot.id}`}
                    messageContent={SellingMessageContent(
                      parkingSpot.startTime,
                      parkingSpot.endTime,
                      sellInfo,
                      updateSellInfo
                    )}
                    handleOnConfirm={handleOnConfirm}
                    privateKey={privateKey}
                    updatePrivateKey={updatePrivateKey}
                    buttonColor='secondary'
                  />
                </TableCell>
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
          <TableCell>Parking Spot ID</TableCell>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell>Average Price Per 15 minutes</TableCell>
          <TableCell>
            <span />
          </TableCell>
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

const UserInfo = ({ socket, ...props } ) => {
  const [message, updateMessage] = useState('Loading');
  const [userInfo, updateUserInfo] = useState([]);

  // Changes epoch to military time.
  let getUserInfo = async () => {
    let pid = localStorage.olivia_pid; // change if necessary.

    let url = `${apiprefix}/users/${pid}`;
    let response = await makeAPICall('GET', url);
    let respbody = await response.json();

    if (response.status === 200) {
      // Extracting the date and leaving in UTC so no need for further conversion.
      // Converting epoch to military time.
      respbody.userInfo.parkingSpotsInfo.forEach(e => {
        e.date = new Date(Date.UTC(e.startTime));
        e.startTime = convertEpochToMilitary(e.startTime);
        e.endTime = convertEpochToMilitary(e.endTime);
      });

      updateUserInfo(respbody.userInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Failed to get user.</div>);
    }
  };

  const handleSellRequest = (sellInfo, privatekey) => {
    // Make sure that the date field is correct.
    console.log(sellInfo.date);
    const startUTCEpoch = convertMilitaryToEpoch(sellInfo.date, sellInfo.startTime);
    const endUTCEpoch = convertMilitaryToEpoch(sellInfo.date, sellInfo.endTime);
    
    // Make api request.
  };

  // Need another socket event for when parking spot is sold.
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    socket.on(`user-${userInfo.pid}`, function() {});
    // data = {
    //  parkingId: parking spot sold off,
    //  money: # hokie tokens in wallet now. 
    // }
    socket.on(`user-${userInfo.pid}`, data => {
      const index = userInfo.findIndex(e => e.parkingId = data.parkingId);

      userInfo = userInfo.splice(index, 1);
      userInfo.money = data.money;

      updateUserInfo(userInfo);
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
              parkingSpotsInfo={userInfo.parkingSpotsInfo}
              handleSellRequest={handleSellRequest}
            />
            <Typography>
              <Box>{`PID: ${userInfo.pid}`}</Box>
              <Box>{`Email: ${userInfo.email}`}</Box>
              <Box>{`Hokie Coins: ${userInfo.money}`}</Box>
            </Typography>
          </>
        )}
      </div>
    </>
  );
};

export default withStyles(styles)(UserInfo);
