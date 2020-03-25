import React, { useState } from 'react';
import TabChooser from './ui/TabChooser';
import WelcomeTab from './pages/welcome';
import MainMap from './pages/MainMap';
//import RegisterTab from './tabs/register';
//import LoginTab from './tabs/login';
import { Route } from 'react-router';
import { Router } from 'react-router-dom';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
//import { withRouter, Switch as RRSwitch } from 'react-router';
//import { Link as RRLink } from 'react-router-dom';
import queryString from 'query-string';
import ListParkingSpots from './pages/list-parking-spots';
import ParkingSpot from './pages/parking-spot';

import Typography from '@material-ui/core/Typography';

import history from './history';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

const defaultTheme = createMuiTheme({
  palette: {
    primary: { main: '#6A2C3E' },
    secondary: { main: '#CF4520' },
    type: 'light' // Switching the dark mode on is a single property value change.
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});

const darkTheme = createMuiTheme({
  pallete: {
    primary: { main: '#6A2C3E' },
    type: 'light'
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});

const App = ({ classes, ...props }) => {
  let [isDark, switchThemeFunc] = useState(localStorage.isDark === true);
  let [isLoggedIn, updateLogin] = useState(localStorage.olivia_id > 0);
  let [currentUser, updateUser] = useState(() => {
    try {
      const token = localStorage.getItem('olivia_token');
      const [, payload] = token.split(/\./);
      const decodedpayload = atob(payload); // base64 decode
      let { id, username, admin } = JSON.parse(decodedpayload);
      return {
        id,
        username,
        admin,
        authenticated: true
      };
    } catch {
      return { authenticated: false };
    }
  });
  const [isAdmin, updateAdmin] = useState(0);
  //console.log(localStorage.olivia_id);
  //localStorage.lastTab = "/";
  // history.push(history.location);

  // eslint-disable-next-line
  // let [currentUser, updateUser] = useState(initialUser);

  return (
    <React.Fragment>
      <MuiThemeProvider theme={defaultTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <Router basename={`${process.env.PUBLIC_URL}`} history={history}>
            <TabChooser
              changeTheme={switchThemeFunc}
              isLoggedIn={isLoggedIn}
              updateLogin={updateLogin}
              updateUser={updateUser}
              currentUser={currentUser}
              updateAdmin={updateAdmin}
              isAdmin={isAdmin}
            >
              <Route
                exact
                path="/"
                label="Welcome"
                key="/"
                hidden={false}
                reqAdmin={false}
                reqLogin={false}
                component={WelcomeTab}
              />
              <Route
                exact
                path="/map"
                label="Map"
                key="/map"
                hidden={false}
                reqAdmin={false}
                reqLogin={false}
                component={MainMap}
              />
              <Route
                path="/list_parking_spots/:parking_id/parking_spot/:spot_id"
                hidden={true}
                reqAdmin={false}
                reqLogin={false}
                component={ParkingSpot}
              />
              <Route
                path="/list_parking_spots/:parking_id"
                label="List Parking Spots"
                key="/list_parking_spots"
                hidden={false}
                reqAdmin={false}
                reqLogin={false}
                component={ListParkingSpots}
              />
              <Route
                exact
                path="/profile"
                label="Profile"
                key="/profile"
                reqAdmin={false}
                reqLogin={true}
                hidden={false}
                component={WelcomeTab}
              />
              <Route
                path="/"
                reqAdmin={false}
                reqLogin={false}
                hidden={true}
                component={WelcomeTab}
              />
            </TabChooser>
          </Router>
        </div>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

export default withStyles(styles)(App);
