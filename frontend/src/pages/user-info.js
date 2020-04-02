import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
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
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';
import { TimePicker } from './forms/parking-spot-components';
import {
  compareMilitaryTime,
  convertMilitaryToEpoch,
  convertEpochToMilitary,
  convertMilitaryTimeToNormal,
  isTimeMultipleOf15,
  roundUpToNearest15
} from './forms/time-filter';
import Box from '@material-ui/core/Box';
import { ConfirmationDialogFieldButton } from './forms/parking-spot-components';
import {
  withStyles,
  withTheme,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';

const UserInfo = ({socket, ...props}) => {

  const [message, updateMessage] = useState('Loading');
  const [userInfo, updateUserInfo] = useState(null);

  let getUserInfo = async () => {

    let url = `${apiprefix}/users/${localStorage.olivia_pid}`;
    let response = await makeAPICall('GET', url);
    let respbody = await response.json();

    if (response.status === 200) {
      // Extracting the date and leaving in UTC so no need for further conversion.
      // Converting epoch to military time.
      console.log(respbody);

      updateUserInfo(respbody.userInfo);
      updateMessage(null);
    } else {
      updateMessage(<div>Failed to get user.</div>);
      console.log(respbody);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    // data = {
    //  parkingId: parking spot sold off,
    //  money: # hokie tokens in wallet now.
    // }
    socket.on(`user-${localStorage.olivia_pid}`, data => {
      updateUserInfo({ ...userInfo, money: data.money });
    });
  }, []);

  return (
    <>
      {message ?  (
          <Typography>{message}</Typography>
        ) : (
        <Typography>
          <Box>{`PID: ${userInfo.pid}`}</Box>
          <Box>{`Email: ${userInfo.email}`}</Box>
          <Box>{`Hokie Coins: ${userInfo.money}`}</Box>
        </Typography>
      )}
    </>
  );
}

export default UserInfo;
