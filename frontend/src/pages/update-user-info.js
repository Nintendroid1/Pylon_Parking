/**
 * Allows the user to update their password.
 */

import React, { useState } from 'react';
import { makeAPICall } from '../api';
import { UpdatePasswordForm } from './forms/update-user-form';
import { Typography } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import apiprefix from './apiprefix';
import history from '../history';
import {
  withStyles} from '@material-ui/core/styles';
const styles = () => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

/*
  The component that is exported, which handles updating the
  user's password.
*/
const UpdateUserInfo = () => {
  const [message, updateMessage] = useState(null);

  const handleUpdate = async password => {
    let url = `${apiprefix}/users/${localStorage.olivia_pid}`;

    /*
      password = {
        password: current password,
        newPassword: new password
      }
    */
    let response = await makeAPICall('POST', url, password);
    let respbody = await response.json();

    if (response.status === 200) {
      // Redirect to profile page if successful.
      history.push('/profile');
      window.location.href = `${process.env.PUBLIC_URL}/profile`;
    } else {
      // Let them know that an error has occurred.
      updateMessage(respbody.message);
    }
  };

  return (
    <>
      <Typography>{message}</Typography>
      <Typography>
        <UpdatePasswordForm onSubmit={handleUpdate} />
      </Typography>
    </>
  );
};
export default withStyles(styles)(RequireAuthentication(UpdateUserInfo));
