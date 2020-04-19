/**
 * 
 */

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
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
  withTheme,
  useTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SimpleChart from '../ui/SimpleChart';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 300
  }
});

// Issue where props.parkingInfo is null, meaning useEffect has not been called yet and error returns.
const TableData = props => {
  return props.parkingInfo.map(parkingSpot => {
    return (
      <>
        <TableRow>
          <TableCell>{parkingSpot.start_time}</TableCell>
          <TableCell>{parkingSpot.end_time}</TableCell>
          <TableCell>{parkingSpot.price}</TableCell>
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
  parkingSpotInfo,
  updateparkingSpotInfo,
  newParkingSpotInfo
) => {
  newParkingSpotInfo.start_time = convertEpochToMilitary(newParkingSpotInfo.start_time);
  newParkingSpotInfo.end_time = convertEpochToMilitary(newParkingSpotInfo.end_time);
  
  parkingSpotInfo.splice(1, 0, newParkingSpotInfo);

  updateparkingSpotInfo(parkingSpotInfo);
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
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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

  // Data and options for price graph
  let [series, updateSeries] = useState([
    {
      name: 'series-1',
      data: []
    }
  ]);
  let options = {
    xaxis: {
      categories: []
    }
  };

  const listParkingSpotTimes = async () => {
    const url = `${apiprefix}/zones/${zone_id}/spot/${spot_id}`;
    let response = await makeAPICall('GET', url);
    let resbody = await response.json();

    if (response.status === 200) {
      resbody.parkingInfo.forEach(e => {
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
      });
      updateSeries([
        {
          name: 'prices',
          data: resbody.parkingInfo.map(spot => spot.price)
        }
      ]);

      // console.log(resbody.parkingInfo);
      updateparkingSpotInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
  };

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

    return (totalTimeWanted / 15) * timeSlot.price;
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
        start_time: `${Number(startUTCEpoch) / 1000}`,
        end_time: `${Number(endUTCEpoch) / 1000}`
      }
    };

    console.log(url);
    const response = await makeAPICall('POST', url, json);
    console.log('WAIT2');
    const respbody = await response.json();
    console.log(respbody);

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
      handleParkingInfoChanges(parkingSpotInfo, updateparkingSpotInfo, data)
    );
  }, []);

  function spotTimeChart() {
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
                    noButton={true}
                    //buttonName={'Buy!'}
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
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container alignContent="center" spacing={3}>
          {/* Chart */}
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <SimpleChart series={series} options={options} />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>{spotTimeChart()}</Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default withTheme(withStyles(styles)(ParkingSpot));
