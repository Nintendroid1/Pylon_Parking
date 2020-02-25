import React, { useState } from 'react';
import { makeAPICall } from '../api';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {
  Typography,
  LinearProgress,
  CircularProgress
} from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import EditableField from './forms/EditableField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import apiprefix from './apiprefix';

const styles = theme => ({
  table: {
    width: '40%',
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  submit: {
    marginTop: theme.spacing.unit * 6,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4
  },
  cancel: {
    marginTop: theme.spacing.unit * 6,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4
  },
  fixed: {
    color: theme.palette.grey[700]
  },
  inputCell: {
    whiteSpace: 'nowrap'
  },
  input: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    fontColor: theme.palette.secondary.main,
  },
});

let EditProfileTab = ({ classes, ...props }) => {
  const [user, updateUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    id: ''
  });
  const [hasCalled, updateCall] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, updateMessage] = useState(null);
  const [isAuthorized, checkAuthorization] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isEditable, setEditable] = useState(true);

  let loadUser = async () => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    console.log(props.theme);
    checkAuthorization(
      Number(localStorage.olivia_id) === Number(id) || Number(localStorage.olivia_id) === 1
    );
    if (
      Number(localStorage.olivia_id) === Number(id) ||
      Number(localStorage.olivia_id) === 1
    ) {
      const url = `${apiprefix}/users/${id}`;
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
      } else if (response.status === 404) {
        updateMessage(
          <div key="fail" style={{ color: props.theme.palette.error.main }}>
            User Not Found
          </div>
        );
      }
      setLoading(false);
    } else {
      updateMessage(
        <Typography
          key="fail"
          style={{
            fontSize: 25,
            color: props.theme.palette.error.main,
            marginTop: props.theme.spacing.unit * 5
          }}
        >
          Only an Admin can modify other user accounts
        </Typography>
      );
    }
  };

  //POST  /api/question/:qid/vote
  let editUser = async () => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/users/${id}`;
    let response = await makeAPICall('PUT', url, user);
    let rbody = await response.json();
    //let response = {status: 503};
    if (response.status === 200) {
      updateUser(rbody.user);
      if(Number(localStorage.olivia_id) === Number(rbody.user.id)) {
        localStorage.olivia_token = rbody.token;
      }
    }
    //alert(rbody.message);
  };

  if (!hasCalled && !isLoading) {
    updateCall(true);
    loadUser();
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setEditable(false);
    editUser();
    setSubmitting(false);
    props.history.push({
      pathname: '/profile',
      state: {
        from: props.history.location
      }
    });
  };

  const handleChange = name => event => {
    console.log(user);
    updateUser({ ...user, [name]: event.target.value });
  };

  return (
    <>
      {isLoading ? (
        <div style={{ paddingTop: '50px' }} align="center">
          <CircularProgress />
        </div>
      ) : isAuthorized && !message ? (
        <form
          id="editprofile"
          onSubmit={handleSubmit}
          style={{ width: '100%' }}
        >
          <Typography align="center" variant="h4" gutterBottom>
            Edit User Profile
          </Typography>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography style={{ fontSize: 18 }}>ID:</Typography>
                </TableCell>
                <TableCell align="left" className={classes.fixed}>
                  <Typography variant="h6" className={classes.fixed}>
                    {user.id}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography style={{ fontSize: 18 }}>Username:</Typography>
                </TableCell>
                <TableCell align="left" className={classes.fixed}>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <Typography variant="h6" className={classes.fixed}>
                      {user.username}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography style={{ fontSize: 18 }}>First Name:</Typography>
                </TableCell>
                <TableCell align="left" className={classes.inputCell}>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <TextField
                      required
                      className={classes.input}
                      label={'Firstname'}
                      type={'firstname'}
                      id={'firstname-field'}
                      value={user.firstname}
                      fontSize={25}
                      variant="outlined"
                      onChange={handleChange('firstname')}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography style={{ fontSize: 18 }}>Last Name:</Typography>
                </TableCell>
                <TableCell align="left" className={classes.inputCell}>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <TextField
                      required
                      className={classes.input}
                      label={'Lastname'}
                      type={'lastname'}
                      id={'lastname-field'}
                      value={user.lastname}
                      fontSize={25}
                      variant="outlined"
                      onChange={handleChange('lastname')}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography style={{ fontSize: 18 }}>Email:</Typography>
                </TableCell>
                <TableCell align="left" className={classes.inputCell}>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <TextField
                      className={classes.input}
                      required
                      label={'Email'}
                      type={'email'}
                      id={'email-field'}
                      value={user.email}
                      fontSize={25}
                      variant="outlined"
                      onChange={handleChange('email')}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography style={{ fontSize: 18 }}>Password:</Typography>
                </TableCell>
                <TableCell align="left" className={classes.inputCell}>
                  <TextField
                    className={classes.input}
                    label={'Password'}
                    type={'password'}
                    id={'password-field'}
                    value={user.password}
                    fontSize={25}
                    variant="outlined"
                    onChange={handleChange('password')}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid container spacing={20} justify="center">
            <Grid item className={classes.submit}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Grid>
            <Grid item className={classes.cancel}>
              <Button
                type="reset"
                size="large"
                variant="contained"
                color="#9e9e9e"
                onClick={() => {
                  props.history.goBack();
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Typography align="center" variant="h6" gutterBottom>
          {message}
        </Typography>
      )}
    </>
  );
};

export default withStyles(styles)(
  withTheme()(RequireAuthentication(EditProfileTab))
);

/*
<Link
                to={{
                  pathname: props.history.location.state.from.pathname,
                  state: {
                    from: props.history.location
                  }
                }}
                style={{ textDecoration: 'none' }}
              >
*/
