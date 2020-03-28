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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { compareMilitaryTime, militaryTimeDifference, convertMilitaryTimeToNormal } from './forms/time-filter';
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
  { startTime: '7:00', endTime: '12:00', cost: '2' },
  { startTime: '12:00', endTime: '13:00', cost: '3' },
  { startTime: '13:00', endTime: '14:00', cost: '2' },
  { startTime: '14:00', endTime: '21:00', cost: '1' }
];

/*
const TableData = props => {

  if (props.parkingInfo !== null){
  return props.parkingInfo.map(parkingSpot => {
    return (
      <>
        <TableRow>
          <TableCell>{parkingSpot.startTime}</TableCell>
          <TableCell>{parkingSpot.endTime}</TableCell>
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
          <TableCell>{parkingSpot.startTime}</TableCell>
          <TableCell>{parkingSpot.endTime}</TableCell>
          <TableCell>{parkingSpot.cost}</TableCell>
        </TableRow>
      </>
    );
  })
}


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

const handleParkingInfoChanges = (updateparkingSpotInfo, newParkingSpotInfo) => {
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
  let tempUrl = window.location.pathname;
  let id = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  const [message, updateMessage] = useState('Loading'); // Initial message cannot be null. See useEffect() for reason.
  const [parkingSpotInfo, updateparkingSpotInfo] = useState([]);
  const [time, updateTime] = useState({
    startTime: currTime,
    endTime: '24:00',
  });

  /*
  const listParkingSpotTimes = async () => {
    const url = `${apiprefix}/parking_spot/${id}`;
    let response = await makeAPICall('GET', url);
    let resbody = await response.json();

    if (response.status === 200) {
      updateMessage(null);
      updateparkingSpotInfo(resbody.parkingInfo);
    } else {
      updateMessage(
        <div>
          Fail
        </div>
      );
    }
  };
  */

  const listParkingSpotTimes = () => {
    updateparkingSpotInfo(TempInput);
    updateMessage(null);
  };

  const calculatePricePerTimeSlot = (timeSlot, startTime, endTime) => {
    // If timeSlot's start time is after the start time the client wants, then use
    // timeSlot's start time, otherwise, the client's start time is taken care of in
    // this timeSlot, so use client's start time.
    let timeToStartCalc = compareMilitaryTime(timeSlot.startTime, startTime) > 0 ? timeSlot.startTime : startTime;
    
    // If timeSlot's end time is before the client's end time, then use timeSlot's
    // end time.
    let timeToEndCalc = compareMilitaryTime(timeSlot.endTime, endTime) < 0 ? timeSlot.endTime : endTime;

    const totalTimeWanted = militaryTimeDifference(timeToStartCalc, timeToEndCalc);

    return (totalTimeWanted / 15) * timeSlot.cost;
  };

  const calculatePrice = (startTime, endTime) => {
    // Calculate the price for the spot.
    const listOfTimes = parkingSpotInfo.filter((e) => compareMilitaryTime(startTime, e.startTime) >= 0 && compareMilitaryTime(endTime, e.startTime) <= 0);

    const totalCost = listOfTimes.reduce(
      (accumulator, currTimeSlot) =>
        accumulator +
        calculatePricePerTimeSlot(currTimeSlot, startTime, endTime),
      0
    );

    return totalCost;
  };

  // Buying option, confirmation message and so forth.
  // Make api call to make a transaction.
  const handleBuyRequest = async (privateKey) => {
    // Redirect them to invoice page.
    //const url = `${apiprefix}/parking_spot/${id}/buy/?startTime=${time.startTime}&endTime=${time.endTime}`;

    console.log(`
      Start Time: ${time.startTime} \n
      End Time: ${time.endTime} \n
      Private Key: ${privateKey}
    `)
    // make smart contract and redirect to invoice.
    return 1;
  };

  let popUpMessage = `Are you sure you want to rent parking spot ${id} from ${
    convertMilitaryTimeToNormal(time.startTime)
  } to ${convertMilitaryTimeToNormal(time.endTime)} for ${calculatePrice(
    time.startTime,
    time.endTime
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
    socket.on(`parkingSpot-${id}`, (data) => handleParkingInfoChanges(updateparkingSpotInfo, data));

    return () => {
      socket.disconnect();
    };
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
