/**
 * Not used.
 */

import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import { Typography } from '@material-ui/core';
import apiprefix from './apiprefix';
import Box from '@material-ui/core/Box';

const UserInfo = ({ socket, isLoggedIn }) => {
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

      updateUserInfo(respbody);
      /*
        respbody.body = {
          pid: tempUser.pid,
          email: tempUser.email,
          first_name: tempUser.first_name,
          last_name: tempUser.last_name
          balance
        }
      */
      // updateUserInfo(respbody.body);
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
    // data = balance # hokie tokens in wallet now.
    socket.on(`userInfo-${localStorage.olivia_pid}`, data => {
      updateUserInfo({ ...userInfo, balance: data });
    });
  }, []);

  return (
    <>
      {message ? (
        <Typography>{message}</Typography>
      ) : (
        <Typography>
          <Box>{`PID: ${userInfo.pid}`}</Box>
          <Box>{`First Name: ${userInfo.first_name}`}</Box>
          <Box>{`Last Name: ${userInfo.last_name}`}</Box>
          <Box>{`Email: ${userInfo.email}`}</Box>
          <Box>{`Hokie Coins: ${userInfo.balance}`}</Box>
        </Typography>
      )}
    </>
  );
};

export default UserInfo;
