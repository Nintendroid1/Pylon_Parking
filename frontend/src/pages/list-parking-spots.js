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
import TimeFilter from './forms/time-filter';
import Button from '@material-ui/core/Button';

// The time input is wrong format for lodash to sort in.
// Can code custom sorter for this if needed.
const TempInput = [
  { id: '1', time: '12:00', cost: 1 },
  { id: '2', time: '13:00', cost: 1 },
  { id: '3', time: '14:00', cost: 4 },
  { id: '4', time: '1:00', cost: 9 },
  { id: '5', time: '2:00', cost: 12 },
  { id: '6', time: '6:00', cost: 1 }
];

const headerCells = [
  { id: 'id', label: 'Spot #' },
  { id: 'time', label: 'Earliest Time Available' },
  { id: 'cost', label: 'Average Cost/15 minutes' }
];

function TableData(props) {
  const data = props.parkingInfo.map(e => ({
    ...e,
    id: e.id.replace('/.', '-')
  }));
  return data.map(parkingSpot => {
    return (
      <>
        <TableRow>
          <TableCell>
            <Link
              to={{
                pathname: `/parking_spot/${parkingSpot.id}`,
                state: {
                  from: history.location
                }
              }}
            >
              <Button type="button">View</Button>
            </Link>
          </TableCell>
          <TableCell>{parkingSpot.id}</TableCell>
          <TableCell>{parkingSpot.time}</TableCell>
          <TableCell>{parkingSpot.cost}</TableCell>
        </TableRow>
      </>
    );
  });
}

function MakeTable(props) {
  const { columnToSort, order, onSortClick, parkingInfo } = props;

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
        <TableData parkingInfo={orderBy(parkingInfo, columnToSort, order)} />
      </TableBody>
    </Table>
  );
}

const ListParkingSpots = () => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  const [message, updateMessage] = useState(null);
  const [parkingSpotInfo, updateParkingSpotInfo] = useState(null);
  const [order, updateOrder] = useState('asc');
  const [columnToSort, updatecolumnToSort] = useState('id');

  const url = `${apiprefix}/list_parking_spots`;

  const handleSortRequest = property => {
    const isAsc = columnToSort === property && order === 'asc';
    updateOrder(isAsc ? 'desc' : 'asc');
    updatecolumnToSort(property);
  };

  /*
  const listParkingSpots = async () => {
    let response = await makeAPICall('GET', url);
    let resbody = await response.json();

    if (response.status === 200) {
      updateParkingSpotInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(
        <div>
          Fail
        </div>
      );
    }
  };*/

  const listParkingSpots = () => {
    updateParkingSpotInfo(TempInput);
    updateMessage(null);
  };

  const handleFiltering = async values => {
    const { date, startTime, endTime } = values;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const newURL = `${url}/?month=${month}&day=${day}&year=${year}&startTime=${startTime}&endTime=${endTime}`;
    let response = await makeAPICall('GET', newURL);
    let resbody = await response.json();

    if (response.status === 200) {
      updateParkingSpotInfo(resbody.parkingInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Fail</div>);
    }
  };

  useEffect(() => {
    listParkingSpots();
  });

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
                parkingInfo={parkingSpotInfo}
                onSortClick={handleSortRequest}
                columnToSort={columnToSort}
                order={order}
              />
            </div>
          )}
        </Typography>
      </div>
    </>
  );
};

export default ListParkingSpots;
