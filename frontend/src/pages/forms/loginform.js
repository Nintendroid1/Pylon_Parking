/**
 * Form used by the login page to capture info that the user
 * enters.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  }
});

function LoginForm({ onSubmit, message, classes, isLoading }) {
  const [values, setValues] = useState({
    pid: '',
    password: ''
  });

  // a universal onChange handler that propagates user input to component state
  const handleChange = event => {
    let { name, value } = event.target; // name/value from input element that changed
    setValues({ ...values, [name]: value }); // update corresponding field in values object
  };
  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(values);
  };
  //const { classes } = props;

  return (
    <>
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper} component={'span'}>
          <Avatar className={classes.avatar} component={'span'}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component={'h1'} variant={'h5'}>
            Sign in
          </Typography>
          <form id="logform" onSubmit={handleSubmit} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">PID</InputLabel>
              <Input
                onChange={handleChange}
                id="pid"
                name="pid"
                autoComplete="current-pid"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={handleChange}
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </FormControl>
            {message}

            {isLoading ? (
              <div align="center" style={{ paddingTop: '4px' }}>
                <CircularProgress />{' '}
              </div>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign in
              </Button>
            )}
          </form>
        </Paper>
      </main>
    </>
  );
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginForm);
