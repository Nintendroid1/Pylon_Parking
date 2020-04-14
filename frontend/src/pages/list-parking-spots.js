// All components used in the specific zones page expects the time to be military time.

import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Typography } from '@material-ui/core';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import orderBy from 'lodash/orderBy';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import { ConfirmationDialogFieldButton } from './forms/parking-spot-components';
import {
  TimeFilter,
  convertMilitaryToEpoch,
  convertEpochToMilitary,
  convertMilitaryTimeToNormal,
  sortByMilitaryTime,
  getCurrentTimeInUTC,
  compareMilitaryTime
} from './forms/time-filter';
import queryString from 'query-string';
import {
  withStyles,
  withTheme,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
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
  }
});

// const styles = theme => ({
//   root: {
//     display: 'flex',
//     flexGrow: 1
//   }
// });
// The time input is wrong format for lodash to sort in.
// Can code custom sorter for this if needed.
// const TempInput = [
//   { id: '1', time: '12:00', cost: 1 },
//   { id: '2', time: '13:00', cost: 1 },
//   { id: '3', time: '14:00', cost: 4 },
//   { id: '4', time: '1:00', cost: 9 },
//   { id: '5', time: '2:00', cost: 12 },
//   { id: '6', time: '6:00', cost: 1 }
// ];

const headerCells = [
  { id: 'spot_id', label: 'Spot #' },
  { id: 'price', label: 'Approximate Total Cost' },
  { id: 'start_time', label: 'Next Available Start Time' },
  { id: 'end_time', label: 'Next Available End Time' },
  { id: 'details', label: 'Spot Details' }
  // { id: 'available', label: 'Is Available' }
  // { id: 'cost', label: 'Average Cost/15 minutes' }
];

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

function TableData({ classes, ...props }) {
  const { parkingInfo, handleBuyRequest, zoneId, date } = props;
  const data = parkingInfo.map(e => ({
    ...e
  }));

  const handleOnConfirm = val => privateKey => {
    handleBuyRequest(val, privateKey);
  };

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
        value: convertMilitaryTimeToNormal(parkingSpot.start_time)
      },
      { name: 'Approximate Total', value: parkingSpot.price }
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
            {parkingSpot.price}
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
                  from: history.location
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

function MakeTable({
  columnToSort,
  order,
  onSortClick,
  parkingInfo,
  classes,
  handleBuyRequest,
  zoneId,
  date,
  ...props
}) {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>{`Date: ${date.toDateString()}`}</TableCell>
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
  );
}

/**
 * Called by socket when spot is made available.
 * 
 * @param {*} parkingSpotsInfo current list of parking spots.
 * @param {*} updateparkingSpotsInfo update current list of spots.
 * @param {*} parkingInfo new parking spot sent by socket.
 * @param {*} currentTimeFilter the current filtering client uses.
 */
const handleParkingSpotAvailable = (
  parkingSpotsInfo,
  updateparkingSpotsInfo,
  parkingInfo,
  currentTimeFilter
) => {
  const year = currentTimeFilter.date.getUTCFullYear();
  const month = currentTimeFilter.date.getUTCMonth();
  const day = currentTimeFilter.date.getUTCDate();
  const [startTimeHour, startTimeMin] = currentTimeFilter.startTime.split(':');
  const [endTimeHour, endTimeMin] = currentTimeFilter.endTime.split(':');

  const timeFilterStartTimeEpoch = new Date(
    Date.UTC(year, month, day, startTimeHour, startTimeMin)
  );
  const timeFilterEndTimeEpoch = new Date(
    Date.UTC(year, month, day, endTimeHour, endTimeMin)
  );

  // Ensures that updated parking spot info is within the filtering options the client wants.
  if (
    !(parkingInfo.end_time < timeFilterStartTimeEpoch) &&
    !(timeFilterEndTimeEpoch < parkingInfo.start_time)
  ) {

    // Get snippet of valid data.

    // For start time, if new data start time is after filter start time,
    // then keep it, otherwise, use filter time.
    parkingInfo.start_time = timeFilterStartTimeEpoch < parkingInfo.start_time ? parkingInfo.start_time : timeFilterStartTimeEpoch;

    // For end time, if new data end time is before filter end time, then
    // keep it, otherwise, use filter time.
    parkingInfo.end_time = parkingInfo.end_time < timeFilterEndTimeEpoch ? parkingInfo.end_time : timeFilterEndTimeEpoch;

    // check if spot is in the list.
    const index = parkingSpotsInfo.findIndex(
      e => Number(e.spot_id) === Number(parkingInfo.spot_id)
    );

    parkingInfo.start_time = convertEpochToMilitary(parkingInfo.start_time);
    parkingInfo.endTime = convertEpochToMilitary(parkingInfo.end_time);

    // the parking spot is in the list, concatentate if possible.
    if (index !== -1) {
      // For start time, if new data start time equals end time, then 
      // new start time is old start time and new end time is new end time.
      if (compareMilitaryTime(parkingInfo.start_time, parkingSpotsInfo[index].end_time) === 0) {
        parkingInfo.start_time = parkingSpotsInfo[index].start_time;
      }

      // For end time, if new data end time equals old start time, then
      // new start time is new start time and new end time is old end time.
      if (compareMilitaryTime(parkingInfo.end_time, parkingSpotsInfo[index].start_time) === 0) {
        parkingInfo.end_time = parkingSpotsInfo[index].end_time;
      }
    }
    parkingInfo.price = Number(parkingInfo.price).toFixed(3);

    if (index === -1) {
      parkingSpotsInfo.push(parkingInfo);
    } else {
      parkingSpotsInfo[index] = parkingInfo;
    }
    
    updateparkingSpotsInfo(parkingSpotsInfo);
  }
};

/**
 * Called when a parking spot is made unavailable.
 * 
 * @param {*} parkingSpotsInfo current list of parking spots.
 * @param {*} updateparkingSpotsInfo update current list of spots.
 * @param {*} parkingInfo list of new parking spots for change spot only.
 * @param {*} currentTimeFilter the current filtering client uses.
 */
const handleParkingSpotUnavailable = (
  parkingSpotsInfo,
  updateparkingSpotsInfo,
  parkingInfo,
  currentTimeFilter
) => {
  const year = currentTimeFilter.date.getUTCFullYear();
  const month = currentTimeFilter.date.getUTCMonth();
  const day = currentTimeFilter.date.getUTCDate();
  const [startTimeHour, startTimeMin] = currentTimeFilter.startTime.split(':');
  const [endTimeHour, endTimeMin] = currentTimeFilter.endTime.split(':');

  const timeFilterStartTimeEpoch = new Date(
    Date.UTC(year, month, day, startTimeHour, startTimeMin)
  );
  const timeFilterEndTimeEpoch = new Date(
    Date.UTC(year, month, day, endTimeHour, endTimeMin)
  );

  // Ensures that updated parking spot info is within the filtering options the client wants.
  /*
  if (
    !(parkingInfo.end_time < timeFilterStartTimeEpoch) &&
    !(timeFilterEndTimeEpoch < parkingInfo.start_time)
  ) {
    const index = parkingSpotsInfo.findIndex(
      e => Number(e.spot_id) === Number(parkingInfo.spot_id)
    );

    parkingInfo.start_time = convertEpochToMilitary(parkingInfo.start_time);
    parkingInfo.endTime = convertEpochToMilitary(parkingInfo.end_time);
    if (index !== -1) {
      
      if (compareMilitaryTime(parkingSpotsInfo[index].start_time, parkingInfo.start_time))

      parkingInfo.price = Number(parkingInfo.price).toFixed(3);
      parkingSpotsInfo[index] = parkingInfo;
      updateparkingSpotsInfo(parkingSpotsInfo);


    }
  }*/

  
};

const Zone = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  socket,
  ...props
}) => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  const [message, updateMessage] = useState(null);
  const [parkingSpotsInfo, updateparkingSpotsInfo] = useState(null);
  const [order, updateOrder] = useState('asc');
  const [columnToSort, updatecolumnToSort] = useState('spot_id');

  // Expected url: ./list_parking_spots/:parkingLotId/?date=month-day-year
  let tempUrl = window.location.pathname;
  let zoneId = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  let urlDate = queryString.parse(window.location.search.substring(1)).date;
  let tempDate = getCurrentTimeInUTC();

  if (urlDate !== undefined && urlDate.length === 8) {
    let month = Number(urlDate.substring(0, 2));
    let day = Number(urlDate.substring(2, 4));
    let year = Number(urlDate.substring(4));

    // Time picker displays time in local time, so need to convert to EDT for now.
    tempDate = new Date(Date.UTC(year, month, day) + 4 * 60 * 60 * 1000);
  }

  const [currentTimeFilter, updateCurrentTimeFilter] = useState({
    date: tempDate,
    startTime: '00:00',
    endTime: '23:59'
  });

  const handleSortRequest = property => {
    const isAsc = columnToSort === property && order === 'asc';
    updateOrder(isAsc ? 'desc' : 'asc');
    updatecolumnToSort(property);
  };

  // GET   /api/zones/:zone_id
  const listParkingSpots = async () => {
    const startUTCEpoch = convertMilitaryToEpoch(tempDate, '00:00');
    const endUTCEpoch = convertMilitaryToEpoch(tempDate, '23:59');
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
        e.price = Number(e.price).toFixed(3);
      });
      updateparkingSpotsInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
  };

  // const listParkingSpots = ({ ...props }) => {
  //   updateParkingSpotInfo(TempInput);
  //   updateMessage(null);
  // };

  const handleFiltering = async (value, checkBoxes) => {
    const { date, startTime, endTime } = value;

    const month =
      date.getMonth().toString().length === 1
        ? '0' + date.getMonth().toString()
        : date.getMonth().toString();
    const year = date.getFullYear();
    const day =
      date.getDate().toString().length === 1
        ? '0' + date.getDate().toString()
        : date.getDate().toString();
    const newDate = `${month}${day}${year}`;
    history.push(`/zones/${zoneId}?date=${newDate}`);

    const startUTCEpoch = convertMilitaryToEpoch(date, startTime);
    const endUTCEpoch = convertMilitaryToEpoch(date, endTime);

    const newURL = `${apiprefix}/zones/${zoneId}/?startTime=${startUTCEpoch}&endTime=${endUTCEpoch}`;
    let response = await makeAPICall('GET', newURL);
    let resbody = await response.json();

    if (response.status === 200) {
      resbody.parkingInfo.filter(e => {
        if (
          checkBoxes.startTimeBox &&
          checkBoxes.endTimeBox &&
          e.start_time === startUTCEpoch &&
          e.end_time === endUTCEpoch
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
        e.price = Number(e.price).toFixed(3);
      });
      updateparkingSpotsInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
  };

  const handleBuyRequest = async (parkingInfo, privateKey) => {
    const startUTCEpoch = convertMilitaryToEpoch(
      parkingInfo.date,
      parkingInfo.start_time
    );
    const endUTCEpoch = convertMilitaryToEpoch(
      parkingInfo.date,
      parkingInfo.end_time
    );

    // Make api call to carry out transaction.
    const url = `${apiprefix}/purchase`;
    const json = {
      pid: localStorage.olivia_pid,
      spot: {
        spot_id: parkingInfo.spot_id,
        zone_id: parkingInfo.zone_id,
        start_time: `${startUTCEpoch}`,
        end_time: `${endUTCEpoch}`
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
    // console.log(`
    //   Start Time: ${time.start_time} \n
    //   End Time: ${time.end_time} \n
    //   Private Key: ${privateKey}
    // `);
    // make smart contract and redirect to invoice.
  };

  useEffect(() => {
    listParkingSpots();
  }, []);

  useEffect(() => {
    console.log(zoneId);
    console.log(socket);
    socket.on(`zone-${zoneId}`, data => {
      //console.log("Big Test ASDFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
      //console.log(data);
      // data should also include info on whether it is a spot being made available or unavailable.
      handleParkingSpotTimeChange(
        parkingSpotsInfo,
        updateparkingSpotsInfo,
        data,
        currentTimeFilter
      );
    });
  }, []);

  // There might be an issue with the date that is displayed on confirmation page
  // because it is created in EDT, but never converted to UTC time.
  return (
    <>
      <div>
        <Typography>
          {message ? (
            <div>{message}</div>
          ) : (
            <div>
              <TimeFilter
                onSubmit={handleFiltering}
                currentTimeFilter={currentTimeFilter}
                updateCurrentTimeFilter={updateCurrentTimeFilter}
              />
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
            </div>
          )}
        </Typography>
      </div>
    </>
  );
};

export default withTheme(withStyles(styles)(Zone));
