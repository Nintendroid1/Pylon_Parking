/**
 * The component that shows the user profile, which includes the 
 * user's pid, total number of tokens, etc.
 */

import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, LinearProgress } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import Grid from '@material-ui/core/Grid';
import apiprefix from './apiprefix';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

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
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  }
});

/**
 * The component that is exported. Shows the user's profile in a table.
 * 
 * @param {Object} param0 
 */
let ProfilePage = ({ setOpenSnackbar, updateSnackbarOptions, snackbarOptions, classes, socket }) => {
  const [user, updateUser] = useState({
    pid: '',
    first_name: '',
    last_name: '',
    email: '',
    balance: ''
  });
  const [] = useState(false);
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
        email: rbody.email,
        balance: rbody.balance
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Socket logic.
  useEffect(() => {
    // Tells the user that a spot has been sold off.
    socket.on(`sell-${localStorage.olivia_pid}`, data => {
      setOpenSnackbar(false);

      // Make it so that the data variable stores the message.
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'You Got Rich! Go To Account To See How Much Disposable Income You Have.',
        severity: 'info'
      })
    });

    // data = money earned
    socket.on(`user-${localStorage.olivia_pid}`, data => {
      updateUser({ ...user, money: user.money + Number(data) });
    });
  }, []);
  return (
    <>
      <div className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={classes.paper}>
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
                          <Typography style={{ fontSize: 16 }}>
                            {user.pid}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography style={{ fontSize: 18 }}>
                          First Name:
                        </Typography>
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
                        <Typography style={{ fontSize: 18 }}>
                          Last Name:
                        </Typography>
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
                          <Typography style={{ fontSize: 16 }}>
                            {user.email}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography style={{ fontSize: 18 }}>
                          Account Balance:
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {isLoading ? (
                          <LinearProgress />
                        ) : (
                          <Typography style={{ fontSize: 16 }}>
                            {user.balance}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default withStyles(styles)(RequireAuthentication(ProfilePage));
