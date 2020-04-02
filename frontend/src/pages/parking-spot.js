import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { StartEndTime } from './forms/parking-spot-components';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import apiprefix from './apiprefix';
import { makeAPICall } from '../api';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  compareMilitaryTime,
  militaryTimeDifference,
  convertMilitaryTimeToNormal,
  convertEpochToMilitary,
  convertMilitaryToEpoch,
  DateFilter
} from './forms/time-filter';
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

const TempInput = [
  { start_time: '7:00', end_time: '12:00', cost: '2' },
  { start_time: '12:00', end_time: '13:00', cost: '3' },
  { start_time: '13:00', end_time: '14:00', cost: '2' },
  { start_time: '14:00', end_time: '21:00', cost: '1' }
];

/*
const TableData = props => {

  if (props.parkingInfo !== null){
  return props.parkingInfo.map(parkingSpot => {
    return (
      <>
        <TableRow>
          <TableCell>{parkingSpot.start_time}</TableCell>
          <TableCell>{parkingSpot.end_time}</TableCell>
          <TableCell>{parkingSpot.cost}</TableCell>
        </TableRow>
      </>
    );
  });
}

return (<></>);
};
*/

// Issue where props.parkingInfo is null, meaning useEffect has not been called yet and error returns.
const TableData = props => {
  return props.parkingInfo.map(parkingSpot => {
    return (
      <>
        <TableRow>
          <TableCell>{parkingSpot.start_time}</TableCell>
          <TableCell>{parkingSpot.end_time}</TableCell>
          <TableCell>{parkingSpot.cost}</TableCell>
        </TableRow>
      </>
    );
  });
};

const MakeTable = props => {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell>Cost/15 minutes</TableCell>
          <TableCell>
            <span />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableData parkingInfo={props.parkingInfo} />
      </TableBody>
    </Table>
  );
};

const handleParkingInfoChanges = (
  updateparkingSpotInfo,
  newParkingSpotInfo
) => {
  newParkingSpotInfo.forEach(e => {
    e.start_time = convertEpochToMilitary(e.start_time);
    e.end_time = convertEpochToMilitary(e.end_time);
  });

  updateparkingSpotInfo(newParkingSpotInfo);
};

const ParkingSpot = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  ...props
}) => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  const { socket } = props;

  let today = new Date();
  let timeSplit = today.toTimeString().split(':');
  let currTime = timeSplit[0].concat(':', timeSplit[1]);
  let tempUrl = window.location.pathname.split('/'); // the first index is an empty string.
  let spot_id = Number(tempUrl[4]);
  let zone_id = Number(tempUrl[2]);

  const [message, updateMessage] = useState('Loading'); // Initial message cannot be null. See useEffect() for reason.
  const [parkingSpotInfo, updateparkingSpotInfo] = useState([]);
  const [time, updateTime] = useState({
    date: today,
    start_time: currTime,
    end_time: '24:00'
  });

  const listParkingSpotTimes = async () => {
    const url = `${apiprefix}/zones/${zone_id}/spot/${spot_id}`;
    let response = await makeAPICall('GET', url);
    let resbody = await response.json();

    if (response.status === 200) {
      resbody.parkingInfo.forEach(e => {
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
      });

      updateparkingSpotInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
  };

  /*
  const listParkingSpotTimes = () => {
    updateparkingSpotInfo(TempInput);
    updateMessage(null);
  };
  */

  const calculatePricePerTimeSlot = (timeSlot, start_time, end_time) => {
    // If timeSlot's start time is after the start time the client wants, then use
    // timeSlot's start time, otherwise, the client's start time is taken care of in
    // this timeSlot, so use client's start time.
    let timeToStartCalc =
      compareMilitaryTime(timeSlot.start_time, start_time) > 0
        ? timeSlot.start_time
        : start_time;

    // If timeSlot's end time is before the client's end time, then use timeSlot's
    // end time.
    let timeToEndCalc =
      compareMilitaryTime(timeSlot.end_time, end_time) < 0
        ? timeSlot.end_time
        : end_time;

    const totalTimeWanted = militaryTimeDifference(
      timeToStartCalc,
      timeToEndCalc
    );

    return (totalTimeWanted / 15) * timeSlot.cost;
  };

  const calculatePrice = (start_time, end_time) => {
    // Calculate the price for the spot.
    const listOfTimes = parkingSpotInfo.filter(
      e =>
        compareMilitaryTime(start_time, e.start_time) >= 0 &&
        compareMilitaryTime(end_time, e.start_time) <= 0
    );

    const totalCost = listOfTimes.reduce(
      (accumulator, currTimeSlot) =>
        accumulator +
        calculatePricePerTimeSlot(currTimeSlot, start_time, end_time),
      0
    );

    return totalCost;
  };

  const handleDateFiltering = async () => {
    const date = convertMilitaryToEpoch(time.date, '00:00');

    const url = `${apiprefix}/zones/${zone_id}/spot/${spot_id}/?date=${date}`;
    const response = await makeAPICall('GET', url);
    const resbody = await response.json();

    if (response.status === 200) {
      resbody.parkingInfo.forEach(e => {
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
      });

      updateparkingSpotInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>{resbody.message}</div>);
    }
  };

  // Buying option, confirmation message and so forth.
  // Make api call to make a transaction.
  const handleBuyRequest = async privateKey => {
    const startUTCEpoch = convertMilitaryToEpoch(time.date, time.start_time);
    const endUTCEpoch = convertMilitaryToEpoch(time.date, time.end_time);

    // Make api call to carry out transaction.
    const url = `${apiprefix}/purchase`;
    const json = {
      pid: localStorage.olivia_pid,
      spot: {
        spot_id: spot_id,
        zone_id: zone_id,
        start_time: startUTCEpoch,
        end_time: endUTCEpoch
      }
    };

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();

    if (response.status === 200) {
      // Redirect them to invoice page.
      console.log('Successfully purchased spot!');
      // Can have it as a snackbar that appears at the top of the page instead of redirection.
    } else {
      updateMessage(<div>{respbody.message}</div>);
    }

    // For testing purposes.
    console.log(`
      Start Time: ${time.start_time} \n
      End Time: ${time.end_time} \n
      Private Key: ${privateKey}
    `);
    // make smart contract and redirect to invoice.
    return 1;
  };

  let popUpMessage = `Are you sure you want to rent parking spot ${zone_id}-${spot_id} from ${convertMilitaryTimeToNormal(
    time.start_time
  )} to ${convertMilitaryTimeToNormal(time.end_time)} for ${calculatePrice(
    time.start_time,
    time.end_time
  )} hokie tokens?`;

  // Renders after first render.
  useEffect(() => {
    listParkingSpotTimes();
  }, []);

  useEffect(() => {
    // id should be the unique id for this parking spot, not the id of the parking spot
    // in this particular parking lot.
    //
    // expect data to be the entire information, not just the new info.
    // Like if an api get request was made.
    socket.on(`parkingSpot-${zone_id}-${spot_id}`, data =>
      handleParkingInfoChanges(updateparkingSpotInfo, data)
    );
  }, []);

  return (
    <>
      <div>
        <Typography>
          {message ? (
            <div>{message}</div>
          ) : (
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateFilter
                  updateTime={updateTime}
                  time={time}
                  handleDateFilter={handleDateFiltering}
                  updateTime={updateTime}
                />
                <StartEndTime
                  time={time}
                  updateTime={updateTime}
                  buttonName={'Buy!'}
                  calculateCost={calculatePrice}
                  handleOnConfirm={handleBuyRequest}
                  popUpTitle={'Confirmation'}
                  popUpContent={popUpMessage}
                />
              </MuiPickersUtilsProvider>
              <MakeTable parkingInfo={parkingSpotInfo} />
            </div>
          )}
        </Typography>
      </div>
    </>
  );
};

export default withStyles(styles)(ParkingSpot);
