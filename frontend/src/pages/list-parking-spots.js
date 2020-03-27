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
import { TimeFilter } from './forms/time-filter';
import Button from '@material-ui/core/Button';
import { convertMilitaryTimeToNormal, sortByMilitaryTime } from './forms/time-filter';

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
          <TableCell>{convertMilitaryTimeToNormal(parkingSpot.time)}</TableCell>
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
        <TableData 
          parkingInfo={
            columnToSort === 'time' ? 
            sortByMilitaryTime(parkingInfo, order) : 
            orderBy(parkingInfo, columnToSort, order)
          } 
        />
      </TableBody>
    </Table>
  );
}

// Should cause a rerender to occur because of state change, so do not need to worry
// about sorting in this function.
const handleParkingSpotTimeChange = (parkingSpotsInfo, updateparkingSpotsInfo, parkingInfo) => {
  const index = parkingSpotsInfo.findIndex(e => e.parking_id === parkingInfo.parking_id);
  parkingSpotsInfo[index] = parkingInfo;
  updateparkingSpotsInfo(parkingSpotsInfo);
};

const ListParkingSpots = (props) => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  const { socket } = props;

  const [message, updateMessage] = useState(null);
  const [parkingSpotsInfo, updateparkingSpotsInfo] = useState(null);
  const [order, updateOrder] = useState('asc');
  const [columnToSort, updatecolumnToSort] = useState('id');

  // Expected url: ./list_parking_spots/:parkingLotId
  const url = `${apiprefix}/list_parking_spots`;
  let tempUrl = window.location.pathname;
  let parkingLotId = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  const handleSortRequest = property => {
    const isAsc = columnToSort === property && order === 'asc';
    updateOrder(isAsc ? 'desc' : 'asc');
    updatecolumnToSort(property);
  };

  /*
  const listParkingSpots = async () => {
    let temp = url + '/' + parkingLotId;
    let response = await makeAPICall('GET', temp);
    let resbody = await response.json();

    if (response.status === 200) {
      updateparkingSpotsInfo(resbody.parkingInfo);
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
    updateparkingSpotsInfo(TempInput);
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
    socket.on(`parkingLot-${parkingLotId}`, (data) => handleParkingSpotTimeChange(parkingSpotsInfo, updateparkingSpotsInfo, data));
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
              />
            </div>
          )}
        </Typography>
      </div>
    </>
  );
};

export default ListParkingSpots;
