import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeAPICall } from '../api';
import UserForm from './forms/userinformation';
import { Typography, LinearProgress } from '@material-ui/core';
import {Redirect, withRouter} from 'react-router';
import apiprefix from './apiprefix';


const styles = theme => ({
  main: {
    width: '200',
    display: 'block', // Fix IE 11 issue.
    marginLeft: 200,
    marginRight: 400,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 200,
      marginLeft: 200,
      marginRight: 400
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
    //padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
    marginLeft: 200,
    marginRight: 400
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

const RegisterTab = ({ isDark, updateLogin, updateUser, updateAdmin }) => {
  // an user message to be displayed, if any
  const [mess, updateMessage] = useState(null);
  const [isLoad, setLoading] = useState(false);
  const [messageColor, setMsgColor] = useState(isDark ? '#FFFFFF' : '#000000');
  const [isOk, updateOk] = useState(false);
 

  // handle user registeration
  const addNewUser = async values => {
    updateMessage(<LinearProgress />);
    setLoading(true);
    let res = await makeAPICall('POST', `${apiprefix}/users`, values);
    let body = await res.json();
    updateMessage(body.message);
    setLoading(false);
    if (res.status === 200) {
      setMsgColor(isDark ? '#FFFFFF' : '#000000');
      updateOk(true);
      localStorage.olivia_token = body.token;
      localStorage.olivia_id = body.user.id;
      console.log(body);
      updateUser({
        id: body.user.id,
        username: body.user.username,
        admin: body.user.admin,
        authenticated: true
      });
      updateAdmin(body.user.admin);

      updateLogin(true);
    }
    else {
      updateOk(false);
      setMsgColor('#fc3c3c')
    }
  };

  if (isOk) {
    return <Redirect to={"/"} />
  }
  
  return (
    <>
      <Typography align="center" variant="h5" gutterBottom>
        Register a New User
      </Typography>
      <Typography>
        <UserForm
          onSubmit={values => addNewUser(values)}
          //onSubmit={registerUser}
          message={mess}
          isLoading={isLoad}
          classes={styles}
          messageColor={messageColor}
        />
      </Typography>
    </>
  );
};

RegisterTab.propTypes = {
  updateLogin: PropTypes.func.isRequired
};

export default RegisterTab;


/*
// the following code must work independent of which state we're in,
// which means for all valid combinations of data/message/isOk/isError/isLoading
// isLoading and isError are drilled down/passed on to the UserForm component
// where error/status message and progress indicators are displayed
return (
  <div className={classes.root}>
    <Typography align="center" variant="h5" gutterBottom>
      Register a new user
    </Typography>
    <UserForm
      onSubmit={registerUser}
      message={message}
      isLoading={isLoading}
      isError={isError}
    />
  </div>
);
};

RegisterUser = withStyles(styles)(RegisterUser);



 const { data, isOk, isError, isLoading, errorMessage, request } = useDataApi(
    null, // we do not want the hook to run a HTTP request initially
    {},   // initial empty state
    data => data.token  // upon success, apply this function to extract token
  );
  
  // the data in both error/ok case may contain a message
  const message = data.message;
  
  // callback when user clicks submit
  const registerUser = values => {
    setMsgColor('#fc3c3c');
    // request just sets the "axiosConfig" state of the data api hook,
    // causing its effect hook to be re-run
    updateMessage(<LinearProgress />)
    setLoading(true);
    request({
      method: 'POST',
      url: '/api/users',
      data: values
    });
    setLoading(false);
    updateMessage(message);
  };
  if (isOk) {
    console.log(`User successfully registered!`)
    setMsgColor(isDark ? '#FFFFFF' : '#000000');
    localStorage.token = data.token;
    localStorage.id = data.user.id;
    return <Redirect to={"/"} />
    /* this would be a good time to update our application's state of who
     * the current user is (perhaps by calling a passed-in updateUser function)
     * We probably will want to navigate away from the registration page:
     * e.g., like so: return <Redirect to={'/'}  />
     *
  }

*/
