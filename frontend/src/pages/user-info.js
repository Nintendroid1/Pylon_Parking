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
import history from '../../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import { TimePicker } from './forms/parking-spot-components';
import { compareMilitaryTime, isTimeMultipleOf15, roundUpToNearest15 } from './forms/time-filter';
import Box from '@material-ui/core/Box';
import { ConfirmationDialogFieldButton } from './forms/parking-spot-components';
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
  username: 'Bob',
  email: 'Bob@vt.edu',
  money: 15,
  parkingSpotsInfo: tempParkingSpots
}

const SellingMessageContent = (
  parkingSpotStartTime,
  parkingSpotEndTime,
  sellInfo,
  updateSellInfo
) => {

  const [ validCost, updateValidCost ] = useState({
    hasError: false,
    errorMessage: '',
  });

  const [ validTime, updateValidTime ] = useState({
    startTimeHasError: false,
    startTimeErrorMessage: '',
    endTimeHasError: false,
    endTimeErrorMessage: '',
  })

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
    else if (name === 'endTime' && compareMilitaryTime(value, parkingSpotEndTime) > 0) {
      updateValidTime({ 
        ...validTime, 
        endTimeHasError: true,
        startTimeErrorMessage: 'End Time Cannot Be After Purchased Time.' 
      });
    }
  };

  const handleOnChangeCost = (event) => {
    const cost = event.target.value;

    if (isNaN(cost)) {
      updateValidCost({
        hasError: true,
        errorMessage: 'Invalid characters detected. Must be a decimal number',
      });
    } else if (Number(cost) < 0) {
      updateValidCost({
        hasError: true,
        errorMessage: 'Cost must be at least 0',
      });
    } else {
      updateSellInfo({ ...sellInfo, cost: Number(cost) });
    }
  }

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
    parkingSpotId: -1,
    startTime: '24:00',
    endTime: '24:00',
    cost: 0,
    privateKey: '',
    showPrivateKey: false,
  });

  return (
    <>
      <TableBody>
        {parkingSpotsInfo.map((parkingSpot, i) => {
          return (
            <>
              <TableRow>
              <TableCell>{parkingSpot.id}</TableCell>
              <TableCell>{parkingSpot.startTime}</TableCell>
              <TableCell>{parkingSpot.endTime}</TableCell>
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
                  handleOnConfirm={handleSellRequest}
                  privateKey={sellInfo}
                  updatePrivateKey={updateSellInfo}
                  buttonColor='secondary'
                />
              </TableCell>
            </TableRow>
            </>
          )
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
          <TableCell><span /></TableCell>
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

const UserInfo = (props) => {

  const [message, updateMessage] = useState('Loading');
  const [userInfo, updateUserInfo] = useState(null);

  /*
  let getUserInfo = async () => {
    let id = localStorage.blockchain_id; // change if necessary.

    let url = `${apiprefix}/user/${id}`;
    let response = await makeAPICall('GET', url);
    let respbody = await response.json();

    if (response.status === 200) {
      updateUserInfo(respbody.userInfo);
    } else {
      updateMessage(<div>Failed to get user.</div>);
    }
  };
  */

  const getUserInfo = () => {
    updateUserInfo(tempInput);
    updateMessage(null);
  }

  const handleSellRequest = (sellInfo) => {

    // Make api request.
  }

  // Need another socket event for when parking spot is sold.
  useEffect(() => {
    getUserInfo();
  }, [])

  // Change to something more meaningful.
  return (
    <>
      <div>
        {message ?
          <Typography>{message}</Typography> :
          <>
            <SellingParkingSpotTable 
              parkingSpotsInfo={userInfo.parkingSpotsInfo}
              handleSellRequest={handleSellRequest}
            />
            <Typography>
              <Box>{`Username: ${userInfo.username}`}</Box>
              <Box>{`Email: ${userInfo.email}`}</Box>
              <Box>{`Hokie Coins: ${userInfo.money}`}</Box>
            </Typography>
          </>
        }
      </div>
    </>
  );
};

export default withStyles(styles)(UserInfo);
