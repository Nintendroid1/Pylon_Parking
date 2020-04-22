import React, { useState, useEffect } from 'react';
import { makeAPICall, makeImageAPICall } from '../api';
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
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import ImageForm from './forms/image-form';
import { PNG } from 'pngjs';

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

let AccountPage = ({ classes, history, socket, ...props }) => {
  const [user, updateUser] = useState({
    pid: '',
    first_name: '',
    last_name: '',
    email: '',
    balance: ''
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
        email: rbody.email,
        balance: Number(rbody.balance).toFixed(3)
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  let changeUserAvatar = async imageURI => {
    try {
      const url = `${apiprefix}/users/${localStorage.olivia_pid}/avatar`;
      const response = await makeImageAPICall('POST', url, imageURI.imageData);
      if (response.status === 200) {
        localStorage.avatar = `/media/images/${localStorage.olivia_pid}_avatar.png`;
        history.go(0);
      }
    } catch (err) {
      console.log(err.stack);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    // data = {
    //  parkingId: parking spot sold off,
    //  money: # hokie tokens in wallet now.
    // }
    socket.on(`user-${localStorage.olivia_pid}`, data => {
      updateUser({ ...user, money: data.money });
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
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={classes.paper}>
                <ImageForm
                  onSubmit={values => {
                    changeUserAvatar(values);
                  }}
                  isLoading={isLoading}
                  setLoading={setLoading}
                  message={'TEST'}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default withStyles(styles)(RequireAuthentication(AccountPage));
