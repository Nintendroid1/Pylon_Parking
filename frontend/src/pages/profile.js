import React, { useState } from 'react';
import { makeAPICall } from '../api';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, LinearProgress } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import apiprefix from './apiprefix';

const styles = theme => ({
  table: {
    width: '30%',
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  editButton: {
    marginTop: theme.spacing.unit * 5
  },
  editIcon: {
    marginLeft: theme.spacing.unit * 2
  }
});

let ProfilePage = ({ classes, ...props }) => {
  const [user, updateUser] = useState({
    pid: '',
    first_name: '',
    last_name: '',
    email: ''
  });
  const [hasCalled, updateCall] = useState(false);
  const [isLoading, setLoading] = useState(false);

  let loadUser = async () => {
    const url = `${apiprefix}/users/${localStorage.olivia_pid}`;
    setLoading(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    console.log(rbody);
    if (response.status === 200) {
      updateUser({
        pid: rbody.pid,
        first_name: rbody.first_name,
        last_name: rbody.last_name,
        email: rbody.email
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  if (!hasCalled) {
    updateCall(true);
    loadUser();
  }
  return (
    <>
      <div style={{ width: '100%' }}>
        <Typography align="center" variant="h4" gutterBottom>
          Current User Profile
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography style={{ fontSize: 18 }}>PID:</Typography>
              </TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Typography style={{ fontSize: 16 }}>{user.pid}</Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography style={{ fontSize: 18 }}>First Name:</Typography>
              </TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Typography style={{ fontSize: 16 }}>
                    {user.first_name}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography style={{ fontSize: 18 }}>Last Name:</Typography>
              </TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Typography style={{ fontSize: 16 }}>
                    {user.last_name}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography style={{ fontSize: 18 }}>Email:</Typography>
              </TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Typography style={{ fontSize: 16 }}>{user.email}</Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default withStyles(styles)(RequireAuthentication(ProfilePage));
