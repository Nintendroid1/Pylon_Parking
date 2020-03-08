import React, { useState } from 'react';
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
import { Typography, CircularProgress } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import TimeFilter from './forms/time-filter';
import { StartEndTime, CostField } from './forms/parking-spot-components';
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

const calculatePrice = (startTime, endTime) => {
  let temp = parkingSpotInfo.filter(e => (e.startTime <= startTime && e.endTime > startTime) ||
                                          e.startTime < endTime && e.endTime >= endTime)

  // Calculate the price for the spot.
};

const compareTime = (time1, time2) => {
  const t1 = time1.split(':');
  const t2 = time2.split(':');

  if (time1 === time2) {
    return 0;
  } else if (t1[0] > t2[0]) {
    return 1;
  } else if (t1[0] === t2[0] && t1[1] > t2[1]) {
    return 1;
  }

  return -1;
}

const TableData = (props) => {
  return props.parkingInfo.map((parkingSpot, index) => {
    <TableRow>
      <TableCell>{parkingSpot.startTime}</TableCell>
      <TableCell>{parkingSpot.endTime}</TableCell>
      <TableCell>{parkingSpot.cost}</TableCell>
    </TableRow>
  })
}

const MakeTable = (props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell>Cost/15 minutes</TableCell>
          <TableCell><span /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableData parkingInfo={props.parkingInfo} />
      </TableBody>
    </Table>
  );
}


const ParkingSpot = ({ ...props }) => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  let today = new Date();
  let timeSplit = today.toTimeString().split(":");
  let currTime = timeSplit[0].concat(":", timeSplit[1]);
  let tempUrl = window.location.pathname;
  let id = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  let popUpMessage = `Are you sure you want to rent parking spot ${id} from ${time.startTime} to ${time.endTime} for ${calculatePrice(time.startTime, time.endTime)} hokie tokens?`

  const [message, updateMessage] = useState(null);
  const [parkingSpotInfo, updateParkingSpotInfo] = useState(null);
  const [time, updateTime] = useState({
    startTime: currTime,
    endTime: "24:00",
  });
  
  const listParkingSpotTimes = async () => {
    const url = `${apiprefix}/parking_spot/${id}`;
    let response = await makeAPICall('GET', url);
    let resbody = await response.json();

    if (response.status === 200) {
      updateMessage(null);
      updateParkingSpotInfo(resbody.parkingInfo);
    } else {
      updateMessage(
        <div>
          Fail
        </div>
      );
    }
  };

  // Buying option, confirmation message and so forth.
  const handleBuyRequest = async () => {
    // Redirect them to invoice page.
    const url = `${apiprefix}/parking_spot/${id}/buy/?startTime=${time.startTime}&endTime=${time.endTime}`;

    // make smart contract and redirect to invoice.
  }

  listParkingSpotTimes();

  return (
    <>
      <div>
        <Typography>
          {message ? (
            <div>
              {message}
            </div>
          ) : <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <form onSubmit={handleBuyRequest}>
                <StartEndTime 
                  time={time} 
                  updateTime={updateTime} 
                  buttonName={"Buy!"} 
                  calculateCost={calculatePrice} 
                  handleOnConfirm={handleBuyRequest}
                  popUpTitle={"Confirmation"}
                  popUpContent={popUpMessage}
                />
              </form>
            </MuiPickersUtilsProvider>
            <MakeTable parkingInfo={parkingSpotInfo} />
          </div>
          }
        </Typography>
      </div>
    </>
  );
}

export default ParkingSpot;