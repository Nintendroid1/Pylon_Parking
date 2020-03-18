import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
//import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 6,
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
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4
  },
  cancel: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4
  }
});

/* Form used for register new users. */
const UserForm = ({ onSubmit, message, classes, isLoading, messageColor }) => {
  // we are using controlled components as per
  // https://reactjs.org/docs/forms.html#controlled-components
  // although instead of setState etc. as in class-based components
  // we are using the Hooks API
  // internal state that represents current state of the form
  const [values, setValues] = useState({
    username: '',
    password: '',
    confpassword: '',
    firstname: '',
    lastname: '',
    email: ''
  });
  // a universal onChange handler that propagates user input to component state
  const handleChange = event => {
    let { name, value } = event.target; // name/value from input element that changed
    setValues({ ...values, [name]: value }); // update corresponding field in values object
  };
  const handleSubmit = event => {
    event.preventDefault();
    if (values.password !== values.confpassword) {
      alert('Passwords do not match!');
    } else {
      let tempUser = {
        username: values.username,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email
      };
      onSubmit(tempUser);
    }
  };

  return (
    <React.Fragment>
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <form id="regform" onSubmit={handleSubmit} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                onChange={handleChange}
                id="username"
                name="username"
                autoComplete="current-username"
                placeholder="username"
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
                placeholder="password"
                autoComplete="current-password"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Confirm Password</InputLabel>
              <Input
                onChange={handleChange}
                name="confpassword"
                type="password"
                id="confpassword"
                placeholder="confirm password"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="firstname">First Name</InputLabel>
              <Input
                onChange={handleChange}
                name="firstname"
                type="firstname"
                id="firstname"
                autoComplete="current-firstname"
                placeholder="first name"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="lastname">Last Name</InputLabel>
              <Input
                onChange={handleChange}
                name="lastname"
                type="lastname"
                id="lastname"
                autoComplete="current-lastname"
                placeholder="last name"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                onChange={handleChange}
                name="email"
                type="email"
                id="email"
                autoComplete="current-email"
                placeholder="email"
              />
            </FormControl>
            {message ? (
              <div
                align="center"
                style={{
                  paddingTop: '5px',
                  paddingBottom: '1px',
                  fontSize: '17px',
                  color: messageColor
                }}
              >
                {message}
              </div>
            ) : (
              ''
            )}
            {isLoading ? (
              <div align="center">
                <CircularProgress />{' '}
              </div>
            ) : (
              <Grid container spacing={20} justify="center">
                <Grid item className={classes.submit}>
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item className={classes.cancel}>
                  <Button
                    type="reset"
                    size="large"
                    variant="contained"
                    color="#9e9e9e"
                    component={Link}
                    to={{
                      pathname: '/'
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>
        </Paper>
      </main>
    </React.Fragment>
  );
};

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string
};

export default withStyles(styles)(UserForm);
