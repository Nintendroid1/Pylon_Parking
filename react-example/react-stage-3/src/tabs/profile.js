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

let ProfileTab = ({ classes, ...props }) => {
  const [user, updateUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    id: ''
  });
  const [hasCalled, updateCall] = useState(false);
  const [isLoading, setLoading] = useState(false);

  let loadUser = async () => {
    const url = `${apiprefix}/users/${localStorage.olivia_id}`;
    setLoading(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    if (response.status === 200) {
      updateUser({
        username: rbody.username,
        firstname: rbody.firstname,
        lastname: rbody.lastname,
        email: rbody.email,
        id: rbody.id
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
              <TableCell><Typography style={{fontSize: 18}}>ID:</Typography></TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <Typography style={{fontSize: 16}}>{user.id}</Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography style={{fontSize: 18}}>Username:</Typography></TableCell>
              <TableCell align="left">
                {isLoading ? <LinearProgress /> : <Typography style={{fontSize: 16}}>{user.username}</Typography>}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography style={{fontSize: 18}}>First Name:</Typography></TableCell>
              <TableCell align="left">
                {isLoading ? <LinearProgress /> : <Typography style={{fontSize: 16}}>{user.firstname}</Typography>}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography style={{fontSize: 18}}>Last Name:</Typography></TableCell>
              <TableCell align="left">
                {isLoading ? <LinearProgress /> : <Typography style={{fontSize: 16}}>{user.lastname}</Typography>}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography style={{fontSize: 18}}>Email:</Typography></TableCell>
              <TableCell align="left">
                {isLoading ? <LinearProgress /> : <Typography style={{fontSize: 16}}>{user.email}</Typography>}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Grid container spacing={20} justify="center">
          <Grid item className={classes.editButton}>
            <Link
              to={{
                pathname: `/profile/edit/${user.id}`,
                state: {
                  from: props.history.location
                }
              }}
              style={{ textDecoration: 'none' }}
            >
              <Button size="large" variant="outlined" color="primary">
                Edit Profile
                <EditIcon className={classes.editIcon} />
              </Button>
            </Link>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default withStyles(styles)(RequireAuthentication(ProfileTab));
