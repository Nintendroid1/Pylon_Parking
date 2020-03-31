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
import { TimeFilter, convertMilitaryToEpoch, convertEpochToMilitary } from './forms/time-filter';
import Button from '@material-ui/core/Button';
import {
  convertMilitaryTimeToNormal,
  sortByMilitaryTime,
  compareMilitaryTime
} from './forms/time-filter';

import {
  withStyles,
  withTheme,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';

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
  { id: 'id', label: 'Spot #' },
  { id: 'start_time', label: 'Next Available Start Time' },
  { id: 'end_time', label: 'Next Available End Time' }
  // { id: 'available', label: 'Is Available' }
  // { id: 'cost', label: 'Average Cost/15 minutes' }
];

function TableData({ classes, ...props }) {
  const data = props.parkingInfo.map(e => ({
    ...e
  }));

  return data.map(parkingSpot => {
    return (
      <>
        <TableRow>
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
              <Button variant="contained" color="primary" type="button">
                View
              </Button>
            </Link>
          </TableCell>
          <TableCell>{parkingSpot.spot_id}</TableCell>
          <TableCell>{parkingSpot.start_time}</TableCell>
          <TableCell>{parkingSpot.end_time}</TableCell>
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
  ...props
}) {
  return (
    <Table stickyHeader>
      <TableHead>
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

// Should cause a rerender to occur because of state change, so do not need to worry
// about sorting in this function.
// Need to take care if they are filtering by some time range.
const handleParkingSpotTimeChange = (
  parkingSpotsInfo,
  updateparkingSpotsInfo,
  parkingInfo,
  currentTimeFilter
) => {

  const year = currentTimeFilter.date.getFullYear();
  const month = currentTimeFilter.date.getMonth();
  const day = currentTimeFilter.date.getDate();
  const [startTimeHour, startTimeMin] = currentTimeFilter.startTime.split(':');
  const [endTimeHour, endTimeMin] = currentTimeFilter.endTime.split(':');

  const timeFilterStartTimeEpoch = new Date(Date.UTC(year, month, day, startTimeHour, startTimeMin));
  const timeFilterEndTimeEpoch = new Date(Date.UTC(year, month, day, endTimeHour, endTimeMin));  

  // Ensures that updated parking spot info is within the filtering options the client wants.
  if (timeFilterStartTimeEpoch <= parkingInfo.start_time && timeFilterEndTimeEpoch >= parkingInfo.end_time) {
    const index = parkingSpotsInfo.findIndex(
      e => e.spot_id === parkingInfo.spot_id
    );

    parkingInfo.start_time = convertEpochToMilitary(parkingInfo.start_time);
    parkingInfo.endTime = convertEpochToMilitary(parkingInfo.endTime);
    parkingSpotsInfo[index] = parkingInfo;
    updateparkingSpotsInfo(parkingSpotsInfo);
  }
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
  const [columnToSort, updatecolumnToSort] = useState('id');
  const [currentTimeFilter, updateCurrentTimeFilter] = useState({
    date: Date.now(),
    startTime: '00:00',
    endTime: '23:59'
  })

  // Expected url: ./list_parking_spots/:parkingLotId
  let tempUrl = window.location.pathname;
  let zoneId = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  const handleSortRequest = property => {
    const isAsc = columnToSort === property && order === 'asc';
    updateOrder(isAsc ? 'desc' : 'asc');
    updatecolumnToSort(property);
  };

  // GET   /api/zones/:zone_id
  const listParkingSpots = async () => {
    const url = `${apiprefix}/zones/${zoneId}`;
    let response = await makeAPICall('GET', url);
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

  const handleFiltering = async values => {
    const { date, startTime, endTime } = values;

    // the month starts numbering from 0, so 0 is January, and 1 is February.
    const url = 'zones/';

    // Converting military time to epoch from EDT to UTC.
    const startUTCEpoch = convertMilitaryToEpoch(date, startTime);
    const endUTCEpoch = convertMilitaryToEpoch(date, endTime);
    updateCurrentTimeFilter({
      date: date,
      startTime: startTime,
      endTime: endTime
    })

    const newURL = `${apiprefix}/zones/${zoneId}/?startTime=${startUTCEpoch}&endTime=${endUTCEpoch}`;
    let response = await makeAPICall('GET', newURL);
    let resbody = await response.json();

    if (response.status === 200) {
      // The functions acting upon this info expect the time to be in military time.
      // Suppose to send client a list of spots where the start and end time are open.
      resbody.parkingInfo.forEach(e => {
        e.start_time = convertEpochToMilitary(e.start_time)
        e.end_time = convertEpochToMilitary(e.end_time)
      });
      updateparkingSpotsInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
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
      handleParkingSpotTimeChange(
        parkingSpotsInfo,
        updateparkingSpotsInfo,
        data,
        currentTimeFilter
      )
    });
  }, []);

  return (
    <>
      <div>
        <Typography>
          {message ? (
            <div>{message}</div>
          ) : (
            <div>
              <TimeFilter onSubmit={handleFiltering} />
              <MakeTable
                parkingInfo={parkingSpotsInfo}
                onSortClick={handleSortRequest}
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
