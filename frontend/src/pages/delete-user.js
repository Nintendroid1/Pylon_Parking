import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import DeleteAccount from './forms/user-components';
import UpdatePasswordForm from './forms/update-user-form';
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

const DeleteUser = ({open, setOpen}) => {
  const [message, updateMessage] = useState(null);

  const handleDelete = async (password) => {
    const url = `${apiprefix}/users/delete`;
    
    const response = await makeAPICall('POST', url, {password: password});
    const respbody = await response.json();

    if (response.status === 200) {
      // redirection.
      // make sure the user is completely logged out, like clear local storage of only our stuff.
    } else {
      updateMessage(respbody.message);
    }
  }

  return (
    <>
      {message ? 
        <Typography>
          {message}
        </Typography>
      :
        <DeleteAccount 
          open={open}
          setOpen={setOpen}
          handleDelete={handleDelete}
        />
      }
    </>
  );
}

export default DeleteUser;