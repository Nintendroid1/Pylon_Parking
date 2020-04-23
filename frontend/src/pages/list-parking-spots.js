/**
 * The default export component in this file is for the zones page, which handles the
 * listing of parking spots for a specific zone, time, and date. It also handles the
 * UI and logic for buying a spot.
 * */

import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CustomSnackbar from '../ui/snackbars';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Typography } from '@material-ui/core';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import orderBy from 'lodash/orderBy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import {
  ConfirmationDialogFieldButton,
  LoadingDialog,
  MessageDialog
} from './forms/parking-spot-components';
import {
  TimeFilter,
  convertMilitaryToEpoch,
  convertEpochToMilitary,
  convertMilitaryTimeToNormal,
  sortByMilitaryTime,
  compareMilitaryTime,
  timeDiffInEpoch15,
  increaseMTimeBy1Min,
  minusOneMinMT
} from './forms/time-filter';
import queryString from 'query-string';
import Invoice from './forms/invoice';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { withStyles, withTheme } from '@material-ui/core/styles';
import HokieKoinIcon from '../images/hokie_coin.js';

const styles = theme => ({
  root: {
    color: theme.palette.secondary.main
  },
  tabLink: {
    color: theme.palette.secondary.main
  },
  viewButton: {
    color: '#FF0000',
    textDecoration: 'none'
  },
  hokieKoin: {
    width: '15px',
    height: 'auto',
    marginLeft: '5px',
    fill: 'black'
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

/**
 * List storing the headers for the table being shown on this page.
 */
const headerCells = [
  { id: 'spot_id', label: 'Spot #' },
  { id: 'price', label: 'Approximate Total Cost' },
  { id: 'start_time', label: 'Next Available Start Time' },
  { id: 'end_time', label: 'Next Available End Time' },
  { id: 'details', label: 'Spot Details' }
];

/**
 * The content to be displayed on the confirmation of buy request page.
 *
 * @param {list} infoList
 */
const popUpContent = infoList => {
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

/**
 * A component that lists formats all the data to be listed in the table body.
 *
 * @param {Object} param0
 */
function TableData({ classes, ...props }) {
  const { parkingInfo, handleBuyRequest, zoneId, date } = props;
  const data = parkingInfo.map(e => ({
    ...e
  }));

  // Handles the buy request.
  const handleOnConfirm = val => privateKey => {
    handleBuyRequest(val, privateKey);
  };

  // Generates the React components for each row of the table.
  return data.map(parkingSpot => {
    const infoList = [
      { name: 'Zone ID', value: zoneId },
      { name: 'Spot ID', value: parkingSpot.spot_id },
      { name: 'Date', value: date.toDateString() },
      {
        name: 'Start Time',
        value: convertMilitaryTimeToNormal(parkingSpot.start_time)
      },
      {
        name: 'End Time',
        value: convertMilitaryTimeToNormal(parkingSpot.end_time)
      },
      { name: 'Total Price', value: parkingSpot.price }
    ];

    const requestParams = {
      zone_id: zoneId,
      date: date,
      spot_id: parkingSpot.spot_id,
      start_time: parkingSpot.start_time,
      end_time: parkingSpot.end_time
    };

    return (
      <>
        <TableRow>
          <TableCell>
            <ConfirmationDialogFieldButton
              buttonMessage={'Buy'}
              messageTitle={'Confirmation'}
              messageContent={popUpContent(infoList)}
              handleOnConfirm={handleOnConfirm(requestParams)}
              buttonColor="primary"
            />
          </TableCell>
          <TableCell>{parkingSpot.spot_id}</TableCell>
          <TableCell>
            {Number(parkingSpot.price).toFixed(3)}
            <HokieKoinIcon isInverted={true} className={classes.hokieKoin} />
          </TableCell>
          <TableCell>
            {convertMilitaryTimeToNormal(parkingSpot.start_time)}
          </TableCell>
          <TableCell>
            {convertMilitaryTimeToNormal(parkingSpot.end_time)}
          </TableCell>
          <TableCell>
            <Link
              className={classes.viewButton}
              to={{
                pathname: `/zones/${parkingSpot.zone_id}/spot/${parkingSpot.spot_id}`,
                state: {
                  from: history.location.pathname
                }
              }}
            >
              <IconButton>{<ExitToAppIcon />}</IconButton>
            </Link>
          </TableCell>
        </TableRow>
      </>
    );
  });
}

/**
 * The component that makes the entire table being shown on the page.
 *
 * @param {Object} param0
 */
function MakeTable({
  columnToSort,
  order,
  onSortClick,
  parkingInfo,
  classes,
  handleBuyRequest,
  zoneId,
  date
}) {
  return (
    <Paper className={classes.paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              colspan={6}
              align="center"
            >{`Date: ${date.toDateString()}`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span />
            </TableCell>
            {headerCells.map(headerCell => (
              <TableCell
                sortDirection={columnToSort === headerCell.id ? order : false}
              >
                <TableSortLabel
                  active={columnToSort === headerCell.id}
                  direction={columnToSort === headerCell.id ? order : 'asc'}
                  onClick={() => onSortClick(headerCell.id)}
                >
                  {headerCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableData
            classes={classes}
            handleBuyRequest={handleBuyRequest}
            zoneId={zoneId}
            date={date}
            parkingInfo={
              columnToSort === 'start_time' || columnToSort === 'end_time'
                ? sortByMilitaryTime(parkingInfo, order, columnToSort)
                : orderBy(parkingInfo, columnToSort, order)
            }
          />
        </TableBody>
      </Table>
    </Paper>
  );
}

/**
 * Called by socket when spot is made available and needs to add spot to list.
 *
 * @param {list} parkingSpotsInfo current list of parking spots.
 * @param {function} updateParkingSpotsInfo update current list of spots.
 * @param {object} parkingInfo new parking spot sent by socket.
 * @param {object} currentTimeFilter the current filtering client uses.
 */
const handleParkingSpotAvailable = (
  parkingSpotsInfo,
  updateParkingSpotsInfo,
  parkingInfo,
  currentTimeFilter
) => {
  // Convert the time to epoch time for usage later.
  const year = currentTimeFilter.date.getFullYear();
  const month = currentTimeFilter.date.getMonth();
  const day = currentTimeFilter.date.getDate();
  const [startTimeHour, startTimeMin] = currentTimeFilter.startTime.split(':');
  const [endTimeHour, endTimeMin] = currentTimeFilter.endTime.split(':');

  // All times stored are in second epoch, not ms.
  const timeFilterStartTimeEpoch =
    Date.UTC(year, month, day, startTimeHour, startTimeMin) / 1000;
  const timeFilterEndTimeEpoch =
    Date.UTC(year, month, day, endTimeHour, endTimeMin) / 1000;

  // Need to add one because it is one second off of the actual time: 3:59:59, instead of 4:00:00.
  parkingInfo.end_time++;

  // Ensures that updated parking spot info is within the filtering options the client wants.
  if (
    !(parkingInfo.end_time <= timeFilterStartTimeEpoch) &&
    !(timeFilterEndTimeEpoch <= parkingInfo.start_time)
  ) {
    parkingInfo.price = Number(parkingInfo.price);

    const spotPricePer15 =
      parkingInfo.price /
      timeDiffInEpoch15(parkingInfo.start_time, parkingInfo.end_time);

    // For start time, if new data start time is after filter start time,
    // then keep it, otherwise, use filter time.
    if (timeFilterStartTimeEpoch >= parkingInfo.start_time) {
      parkingInfo.price -=
        timeDiffInEpoch15(parkingInfo.start_time, timeFilterStartTimeEpoch) *
        spotPricePer15;
      parkingInfo.start_time = timeFilterStartTimeEpoch;
    }

    // For end time, if new data end time is before filter end time, then
    // keep it, otherwise, use filter time.
    if (parkingInfo.end_time >= timeFilterEndTimeEpoch) {
      parkingInfo.price -=
        timeDiffInEpoch15(timeFilterEndTimeEpoch, parkingInfo.end_time) *
        spotPricePer15;
      parkingInfo.end_time = timeFilterEndTimeEpoch;
    }

    // check if spot is in the list.
    let i = parkingSpotsInfo.length;
    let listedSpots = [];
    // If it is in the list, then remove it from the list.
    while (i--) {
      if (Number(parkingInfo.spot_id) === Number(parkingSpotsInfo[i].spot_id)) {
        listedSpots.push(parkingSpotsInfo.splice(i, 1));
      }
    }

    parkingInfo.start_time = convertEpochToMilitary(parkingInfo.start_time);
    // Subtract 1 second to conform to rest of data in list.
    parkingInfo.end_time = convertEpochToMilitary(parkingInfo.end_time - 1);

    // the parking spot is in the list, concatentate if possible
    // return a new list of spots not concatentated.
    listedSpots = listedSpots.filter(e => {
      const tempNewET = increaseMTimeBy1Min(parkingInfo.end_time);
      const tempOldET = increaseMTimeBy1Min(e.end_time);
      let retVal = true;

      // For start time, if new data start time equals end time, then
      // new start time is old start time and new end time is new end time.
      if (compareMilitaryTime(parkingInfo.start_time, tempOldET) === 0) {
        parkingInfo.start_time = e.start_time;
        parkingInfo.price += listedSpots.price;
        retVal = false; // Concatentated; therefore, do not include this list.
      }

      // For end time, if new data end time equals old start time, then
      // new start time is new start time and new end time is old end time.
      if (compareMilitaryTime(tempNewET, e.start_time) === 0) {
        parkingInfo.end_time = e.end_time;
        parkingInfo.price += listedSpots.price;
        retVal = false; // Concatentated; therefore, do not include this list.
      }

      return retVal;
    });

    parkingSpotsInfo.push(parkingInfo);

    listedSpots.forEach(e => parkingSpotsInfo.push(e));

    updateParkingSpotsInfo(parkingSpotsInfo);
  }
};

/**
 * Called when a parking spot is made unavailable, so removing this spot.
 *
 * @param {*} parkingSpotsInfo current list of parking spots.
 * @param {*} updateParkingSpotsInfo update current list of spots.
 * @param {*} parkingInfo parking spot that was made unavailable.
 * @param {*} currentTimeFilter the current filtering client uses.
 */
const handleParkingSpotUnavailable = (
  parkingSpotsInfo,
  updateParkingSpotsInfo,
  parkingInfo,
  currentTimeFilter
) => {
  const year = currentTimeFilter.date.getUTCFullYear();
  const month = currentTimeFilter.date.getUTCMonth();
  const day = currentTimeFilter.date.getUTCDate();
  const [startTimeHour, startTimeMin] = currentTimeFilter.startTime.split(':');
  const [endTimeHour, endTimeMin] = currentTimeFilter.endTime.split(':');

  // All times stored are in second epoch, not ms.
  const timeFilterStartTimeEpoch =
    Date.UTC(year, month, day, startTimeHour, startTimeMin) / 1000;
  const timeFilterEndTimeEpoch =
    Date.UTC(year, month, day, endTimeHour, endTimeMin) / 1000;

  // Need to add one because it is one second off of the actual time: 3:59:59, instead of 4:00:00.
  parkingInfo.end_time++;

  // Ensures that updated parking spot info is within the filtering options the client wants.
  if (
    !(parkingInfo.end_time <= timeFilterStartTimeEpoch) &&
    !(timeFilterEndTimeEpoch <= parkingInfo.start_time)
  ) {
    parkingInfo.start_time = convertEpochToMilitary(parkingInfo.start_time);
    parkingInfo.end_time = convertEpochToMilitary(parkingInfo.end_time - 1);

    // check if spot is in the list.
    let i = parkingSpotsInfo.length;
    let listedSpots = [];

    // Remove the spot from the list if it is in the list.
    while (i--) {
      if (
        Number(parkingInfo.spot_id) === Number(parkingSpotsInfo[i].spot_id) &&
        compareMilitaryTime(
          increaseMTimeBy1Min(parkingInfo.end_time),
          parkingSpotsInfo[i].start_time
        ) > 0 &&
        compareMilitaryTime(
          increaseMTimeBy1Min(parkingSpotsInfo[i].end_time),
          parkingInfo.start_time
        ) > 0
      ) {
        listedSpots.push(parkingSpotsInfo.splice(i, 1));
      }
    }

    // To store the additional spots that result from splitting a spot into two.
    let additionalSpots = [];

    // the parking spot is in the list, return times that are not completely removed.
    listedSpots = listedSpots.filter(e => {
      let retval = true;
      const tempNewET = increaseMTimeBy1Min(parkingInfo.end_time);
      const tempOldET = increaseMTimeBy1Min(e.end_time);

      // For a given spot, if the new spot's start time is at or before the given spot's start time,
      // then, if the new spot has an end time before the given spot's
      // end time, set the given spot's start time to be at the new spot's end time, otherwise,
      // set the given spot's start time to be at given spot's end time.
      if (compareMilitaryTime(parkingInfo.start_time, e.start_time) <= 0) {
        if (compareMilitaryTime(tempNewET, tempOldET) < 0) {
          const spotPricePer15 =
            e.price / timeDiffInEpoch15(e.start_time, tempOldET);

          // Update the price.
          e.price -=
            spotPricePer15 * timeDiffInEpoch15(e.start_time, tempNewET);
          e.start_time = tempNewET;
        } else {
          e.price = 0;
          e.start_time = e.end_time;
        }
      }

      // For a given spot, if the new spot's end time is at or after the given spot's
      // end time, then because the new spot's start time is after the given spot's start time,
      // move given spot's end time to new spot's start time,
      // otherwise, it should have been handled by the first if-statement.
      else if (compareMilitaryTime(tempNewET, tempOldET) >= 0) {
        const spotPricePer15 =
          e.price / timeDiffInEpoch15(e.start_time, tempOldET);
        e.price -=
          spotPricePer15 * timeDiffInEpoch15(parkingInfo.start_time, tempOldET);
        e.end_time = minusOneMinMT(parkingInfo.start_time);
      }

      // The last option is for the parking spot to be inside this spot; thus,
      // need to break this spot into two pieces.
      else {
        const spotPricePer15 =
          e.price / timeDiffInEpoch15(e.start_time, tempOldET);

        // New spot splitting at end of this spot.
        const newSpot = {
          start_time: increaseMTimeBy1Min(parkingInfo.end_time),
          end_time: e.end_time,
          spot_id: e.spot_id,
          price: spotPricePer15 * timeDiffInEpoch15(tempNewET, tempOldET)
        };

        additionalSpots.push(newSpot);

        // Old spot splitting at beginning of this spot.
        e.end_time = minusOneMinMT(parkingInfo.start_time);
        e.price =
          spotPricePer15 *
          timeDiffInEpoch15(e.start_time, parkingInfo.start_time);
      }

      // Check if given spot's end time equals start time for it to be removed from the list.
      if (compareMilitaryTime(e.start_time, e.end_time) === 0) {
        retval = false;
      }

      return retval;
    });

    listedSpots.forEach(e => parkingSpotsInfo.push(e));
    additionalSpots.forEach(e => parkingSpotsInfo.push(e));

    updateParkingSpotsInfo(parkingSpotsInfo);
  }
};

/**
 * The component being exported; The component for the entire zone page.
 * Handles the GET request for fetching the initial data, handles the filtering,
 * and the buying logic.
 *
 * @param {Object} param0
 */
const Zone = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  socket,
  userSocket
}) => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  // Initializing state information.
  const [message, updateMessage] = useState(null);
  const [parkingSpotsInfo, updateParkingSpotsInfo] = useState(null);
  const [order, updateOrder] = useState('asc');
  const [columnToSort, updatecolumnToSort] = useState('spot_id');
  const [loadingDialogField, updateLoadingDialogField] = useState({
    open: false,
    message: ''
  });
  const [openMessageDialog, updateOpenMessageDialog] = useState(false);
  const [messageDialogField, updateMessageDialogField] = useState({
    message: '',
    dialogTitle: '',
    redirectTo: null
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOptions, updateSnackbarOptions] = useState({
    verticalPos: 'top',
    horizontalPos: 'center',
    message: '',
    severity: 'info'
  });

  // Checks if the user wants a specific date, otherwise go with default (today).
  // Expected url: ./list_parking_spots/:parkingLotId/?date=month-day-year
  let tempUrl = window.location.pathname;
  let zoneId = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  let urlDate = queryString.parse(window.location.search.substring(1)).date;
  let tempDateEpoch = Date.now() - 4 * 60 * 60 * 1000; // UTC Epoch
  let tempDate = new Date(); // The date in local time.

  if (typeof urlDate !== 'undefined' && urlDate.length === 8) {
    let month = Number(urlDate.substring(0, 2));
    let day = Number(urlDate.substring(2, 4));
    let year = Number(urlDate.substring(4));

    // Time picker displays time in local time, so need to convert to EDT for now.
    // Gets the EDT for this date at time 00:00.
    tempDateEpoch = Date.UTC(year, month, day);
    tempDate = new Date(Date.UTC(year, month, day) + 4 * 60 * 60 * 1000);
  }

  // Initializing time filtering options.
  // Stores the date in EDT.
  const [currentTimeFilter, updateCurrentTimeFilter] = useState({
    date: tempDate,
    startTime: convertEpochToMilitary(Math.trunc(tempDateEpoch / 1000)),
    endTime: '23:59'
  });

  const handleSortRequest = property => {
    const isAsc = columnToSort === property && order === 'asc';
    updateOrder(isAsc ? 'desc' : 'asc');
    updatecolumnToSort(property);
  };

  // GET   /api/zones/:zone_id
  // API call for fetching the initial data.
  const listParkingSpots = async () => {
    // The backend expects times in utc, so need to convert to UTC.
    const startUTCEpoch = convertMilitaryToEpoch(
      new Date(tempDateEpoch),
      currentTimeFilter.startTime
    );
    const endUTCEpoch = convertMilitaryToEpoch(
      new Date(tempDateEpoch),
      '23:59'
    );
    const newURL = `${apiprefix}/zones/${zoneId}/?startTime=${startUTCEpoch}&endTime=${endUTCEpoch}`;

    let response = await makeAPICall('GET', newURL);
    let resbody = await response.json();
    console.log('RESPPPPP');
    // spot_id
    // start_time
    // end_time
    console.log(resbody.parkingInfo);

    if (response.status === 200) {
      // The components on this page expects the time to be in military time.
      resbody.parkingInfo.forEach(e => {
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
        e.price = Number(e.price);
      });
      updateParkingSpotsInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
  };

  const handleFiltering = async (value, checkBoxes) => {
    updateLoadingDialogField({
      open: true,
      message: 'Please Hold On While Our Team Fabricates Data'
    });

    // date is in local time.
    const { date, startTime, endTime } = value;

    // Parse the date for month, day, and year.
    const month =
      date.getMonth().toString().length === 1
        ? '0' + date.getMonth().toString()
        : date.getMonth().toString();
    const year = date.getFullYear();
    const day =
      date.getDate().toString().length === 1
        ? '0' + date.getDate().toString()
        : date.getDate().toString();

    // Update url to reflect the date.
    const newDate = `${month}${day}${year}`;
    history.push(`/zones/${zoneId}?date=${newDate}`);

    // Convert date to utc because function expects utc date.
    const UTCDate = new Date(date.getTime() - 4 * 60 * 60 * 1000);
    const startUTCEpoch = convertMilitaryToEpoch(UTCDate, startTime);
    const endUTCEpoch = convertMilitaryToEpoch(UTCDate, endTime);

    // URL for the backend.
    const newURL = `${apiprefix}/zones/${zoneId}/?startTime=${startUTCEpoch}&endTime=${endUTCEpoch}`;
    let response = await makeAPICall('GET', newURL);
    let resbody = await response.json();
    updateLoadingDialogField({
      open: false,
      message: ''
    });

    if (response.status === 200) {
      // Filtering the results for exact matches.
      resbody.parkingInfo.filter(e => {
        // Add 1 second to the end time because end time is one second
        // off from the endUTCEpoch.
        if (
          checkBoxes.startTimeBox &&
          checkBoxes.endTimeBox &&
          e.start_time === startUTCEpoch &&
          e.end_time + 1 === endUTCEpoch
        ) {
          return true;
        } else if (checkBoxes.startTimeBox && e.start_time === startUTCEpoch) {
          return true;
        } else if (checkBoxes.endTimeBox && e.end_time === endUTCEpoch) {
          return true;
        }
        return false;
      });

      // The functions acting upon this info expect the time to be in military time.
      // Suppose to send client a list of spots where the start and end time are open.
      resbody.parkingInfo.forEach(e => {
        e.start_time = convertEpochToMilitary(e.start_time);
        e.end_time = convertEpochToMilitary(e.end_time);
        e.price = Number(e.price);
      });

      updateParkingSpotsInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessageDialogField({
        dialogTitle: 'Error',
        message: resbody.message
      });
      updateOpenMessageDialog(true);
    }
  };

  /*
    Handles the buy requests.

    parkingInfo = {
      start_time,
      end_time,
      date,
      zone_id,
      spot_id
    }
  */
  const handleBuyRequest = async (parkingInfo, privateKey) => {
    updateLoadingDialogField({
      open: true,
      message:
        'Your Request Is Currently Being Processed By Our Elite Team Of Trained Monkeys'
    });

    // The date is in local time, but function expects utc, so need to convert.
    const UTCDate = new Date(parkingInfo.date.getTime() - 4 * 60 * 60 * 1000);
    const startUTCEpoch = convertMilitaryToEpoch(
      UTCDate,
      parkingInfo.start_time
    );
    const endUTCEpoch = convertMilitaryToEpoch(UTCDate, parkingInfo.end_time);

    // Make api call to carry out transaction.
    const url = `${apiprefix}/purchase`;
    const json = {
      key: privateKey,
      pid: localStorage.olivia_pid,
      spot: {
        spot_id: parkingInfo.spot_id,
        zone_id: parkingInfo.zone_id,
        start_time: `${startUTCEpoch}`,
        end_time: `${endUTCEpoch}`
      }
    };

    const response = await makeAPICall('POST', url, json);
    const respbody = await response.json();
    updateLoadingDialogField({
      open: false,
      message: ''
    });

    if (response.status === 200) {
      /*
      updateMessageDialogField({
        dialogTitle: 'Error',
        message:
          'You Used Bribery. It Was Super Effective! You Got The Parking Spot!'
      });
      updateOpenMessageDialog(true);
      console.log('Successfully purchased spot!');
      */

      // Displays the invoice instead of the tables.
      // updateMessage(<Invoice spotInfo={json} />);

      // Page redirect to the homepage.
      updateMessageDialogField({
        message: 'You successfully bought this spot.',
        dialogTitle: 'Success',
        redirectTo: '/'
      });
    } else {
      // Letting the user know that an error has occurred and what the error is.
      updateMessageDialogField({
        dialogTitle: 'Error',
        message: respbody.message
      });
      updateOpenMessageDialog(true);
    }
  };

  // Calls the function after the first render.
  useEffect(() => {
    listParkingSpots();
  }, []);

  // Contains the socket stuff, which will update the page or notify the user of changes.
  useEffect(() => {
    // Socket for handling user personal info.
    userSocket.on(`sell-${localStorage.olivia_pid}`, () => {
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

    // Socket for handling changes to parking spots for this zone.
    socket.on(`zone-${zoneId}`, data => {
      if (data.isAvail) {
        handleParkingSpotAvailable(
          parkingSpotsInfo,
          updateParkingSpotsInfo,
          data.parkingInfo,
          currentTimeFilter
        );
      } else {
        handleParkingSpotUnavailable(
          parkingSpotsInfo,
          updateParkingSpotsInfo,
          data.parkingInfo,
          currentTimeFilter
        );
      }
    });
  }, []);

  return (
    <>
      <div>
        <Typography>
          <CustomSnackbar
            isOpen={openSnackbar}
            updateIsOpen={setOpenSnackbar}
            verticalPos={snackbarOptions.verticalPos}
            horizontalPos={snackbarOptions.horizontalPos}
            message={snackbarOptions.message}
            severity={snackbarOptions.severity}
          />
          <MessageDialog
            redirectTo={messageDialogField.redirectTo}
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
            <div>{message}</div>
          ) : (
            <Container className={classes.container}>
              <Grid container alignContent="center" spacing={2}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <TimeFilter
                      onSubmit={handleFiltering}
                      currentTimeFilter={currentTimeFilter}
                      updateCurrentTimeFilter={updateCurrentTimeFilter}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <MakeTable
                    parkingInfo={parkingSpotsInfo}
                    date={currentTimeFilter.date}
                    zoneId={zoneId}
                    onSortClick={handleSortRequest}
                    handleBuyRequest={handleBuyRequest}
                    columnToSort={columnToSort}
                    order={order}
                    classes={classes}
                  />
                </Grid>
              </Grid>
            </Container>
          )}
        </Typography>
      </div>
    </>
  );
};

export default withTheme(withStyles(styles)(Zone));
