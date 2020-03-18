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

const TempInput = [
  { startTime: '7:00', endTime: '12:00', cost: '2' },
  { startTime: '12:00', endTime: '13:00', cost: '3' },
  { startTime: '13:00', endTime: '14:00', cost: '2' },
  { startTime: '14:00', endTime: '21:00', cost: '1' }
];

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

/*
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
*/

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

const ParkingSpot = () => {
  // To be used if paging
  /*
  const findCurrentPageBasedOnPath = (location) => {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }*/

  let today = new Date();
  let timeSplit = today.toTimeString().split(':');
  let currTime = timeSplit[0].concat(':', timeSplit[1]);
  let tempUrl = window.location.pathname;
  let id = Number(tempUrl.substring(tempUrl.lastIndexOf('/') + 1));

  let popUpMessage = `Are you sure you want to rent parking spot ${id} from ${
    time.startTime
  } to ${time.endTime} for ${calculatePrice(
    time.startTime,
    time.endTime
  )} hokie tokens?`;

  const [message, updateMessage] = useState(null);
  const [parkingSpotInfo, updateParkingSpotInfo] = useState(null);
  const [time, updateTime] = useState({
    startTime: currTime,
    endTime: '24:00'
  });

  /*
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
  */

  const listParkingSpotTimes = () => {
    updateMessage(null);
    updateParkingSpotInfo(TempInput);
  };

  const calculatePrice = (startTime, endTime) => {
    // Calculate the price for the spot.
  };

  // Buying option, confirmation message and so forth.
  const handleBuyRequest = async () => {
    // Redirect them to invoice page.
    //const url = `${apiprefix}/parking_spot/${id}/buy/?startTime=${time.startTime}&endTime=${time.endTime}`;

    // make smart contract and redirect to invoice.
    return 1;
  };

  useEffect(() => {
    listParkingSpotTimes();
  });

  return (
    <>
      <div>
        <Typography>
          {message ? (
            <div>{message}</div>
          ) : (
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form onSubmit={handleBuyRequest}>
                  <StartEndTime
                    time={time}
                    updateTime={updateTime}
                    buttonName={'Buy!'}
                    calculateCost={calculatePrice}
                    handleOnConfirm={handleBuyRequest}
                    popUpTitle={'Confirmation'}
                    popUpContent={popUpMessage}
                  />
                </form>
              </MuiPickersUtilsProvider>
              <MakeTable parkingInfo={parkingSpotInfo} />
            </div>
          )}
        </Typography>
      </div>
    </>
  );
};

export default ParkingSpot;
