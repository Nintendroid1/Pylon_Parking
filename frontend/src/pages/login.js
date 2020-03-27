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

const LoginTab = ({
  isDark,
  updateLogin,
  selectTab,
  classes,
  updateUser,
  updateAdmin,
  ...props
}) => {
  // an user message to be displayed, if any
  const [message, updateMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const nextLocation =
    history.location.state !== undefined
      ? history.location.state.from
      : { pathname: '/' };

  console.log(history);
  console.log(props);
  // handle user login
  const userLogin = async values => {
    setLoading(true);
    console.log(`Making POST request to: ${apiprefix}/users/login`)
    console.log('Using values:')
    console.log(values)
    let res = await makeAPICall('POST', `${apiprefix}/users/login`, values);
    let body = await res.json();

    setLoading(false);
    if (res.status === 200) {
      localStorage.olivia_token = body.token;
      localStorage.olivia_id = body.id;
      console.log(res);
      updateUser({
        id: body.id,
        username: values.username,
        admin: res.body.admin,
        authenticated: true
      });
      updateAdmin(res.body.admin === 1);
      updateLogin(true);

      //if (prevLocation !== null) {
      console.log(nextLocation.pathname);
      if (nextLocation.pathname === '/login') {
        nextLocation.pathname = '/';
      }

      history.replace(nextLocation.pathname);
      window.location.href = `${process.env.PUBLIC_URL}${nextLocation.pathname}`;
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
