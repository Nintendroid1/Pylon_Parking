/**
 * Exports the component that handles the login page, which includes
 * redirecting users back to their old page.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeAPICall } from '../api';
import LoginForm from './forms/loginform';
import { Typography, LinearProgress } from '@material-ui/core';
import history from '../history';
import { withStyles, withTheme } from '@material-ui/core/styles';
import apiprefix from './apiprefix';
import { Link as RRLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  link: {
    color: theme.palette.secondary.main
  }
});

/**
 * The component that is exported. Handles the form used for
 * login and handles the API call for user login.
 *
 * @param {Object} param0
 */
const LoginTab = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  ...props
}) => {
  // a user message to be displayed, if any
  const [message, updateMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Finds the url of the next place to send the user.
  // For example, if the user wanted to view zones, but was not
  // logged in, then after login, redirect back to zones page.
  /* const nextLocation =
    history.location.state !== undefined
      ? history.location.state.from
      : { pathname: '/' }; */
  let nextLocation =
    typeof history.location.state !== 'undefined' &&
    typeof history.location.state.from !== 'undefined'
      ? history.location.state.from
      : '/';

  // Loads the avatar used by the user.
  let loadUserImage = async () => {
    let image_path = `/media/images/${localStorage.olivia_pid}_avatar.png`;
    let response = await makeAPICall('GET', image_path);
    if (response.status === 200) {
      localStorage.avatar = `/media/images/${localStorage.olivia_pid}_avatar.png`;
    }
  };

  // handle user login
  const userLogin = async values => {
    setLoading(true);
    console.log(`Making POST request to: ${apiprefix}/users/login`);
    console.log('Using values:');
    console.log(values);
    let res = await makeAPICall('POST', `${apiprefix}/users/login`, values);
    let body = await res.json();

    setLoading(false);
    if (res.status === 200) {
      localStorage.olivia_token = body.token;
      localStorage.olivia_pid = body.pid;
      updateUser({
        pid: values.pid,
        admin: res.body.admin,
        authenticated: true
      });
      await loadUserImage();
      console.log(res.body);
      updateAdmin(res.body.admin === 1);
      updateLogin(true);

      //if (prevLocation !== null) {
      console.log(nextLocation);
      if (nextLocation === '/login') {
        nextLocation = '/';
      }

      history.replace(nextLocation);
      window.location.href = `${process.env.PUBLIC_URL}${nextLocation}`;
      //history.goForward();
      /*} else {
        history.push('/');
        history.goForward();
      }*/
    } else {
      updateMessage(
        <Typography
          align="center"
          style={{
            paddingTop: '5px',
            paddingBottom: '1px',
            fontSize: '17px',
            color: props.theme.palette.error.main
          }}
        >
          {body.message}
        </Typography>
      );
    }
  };

  return (
    <>
      <Typography align="center" variant="h5">
        Login to change the current user
      </Typography>
      <Typography>
        <LoginForm
          onSubmit={values => userLogin(values)}
          isLoading={isLoading}
          message={message}
        />
        <div align="center" style={{ paddingTop: '30px', fontSize: '16px' }}>
          Don't have an account?{' '}
          <Link component={RRLink} to="/register" className={classes.link}>
            Sign up
          </Link>{' '}
          for one!
        </div>
      </Typography>
    </>
  );
};

LoginTab.propTypes = {
  updateLogin: PropTypes.func.isRequired
};

export default withTheme(withStyles(styles)(LoginTab));
