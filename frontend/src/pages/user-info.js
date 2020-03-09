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
import history from '../../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';

const UserInfo = (props) => {

  const [message, updateMessage] = useState(null);

  let getUserInfo = async () => {
    let id = localStorage.blockchain_id; // change if necessary.

    let url = `${apiprefix}/user/${id}`
    let response = await makeAPICall('GET', url);
    let respbody = await response.json();

    if (response.status === 200) {
      // do something.
    } else {
      updateMessage(
        <div>
          Failed to get user.
        </div>
      );
    }
  }

  // Change to something more meaningful.
  return (
    <>
      <div>
        <Typography>
          {message}
        </Typography>
      </div>
    </>
  );
}