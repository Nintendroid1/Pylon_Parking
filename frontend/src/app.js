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
import Zone from './pages/list-parking-spots';
import ParkingSpot from './pages/parking-spot';
import TransactionHistory from './pages/transactions';
import io from 'socket.io-client';
import UserInfo from './pages/user-info';

import Typography from '@material-ui/core/Typography';
import history from './history';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

const lightTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#6A2C3E'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#CF4520',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00'
    },
    type: 'light',
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});
const darkTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#6A2C3E'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#CF4520',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00'
    },
    type: 'dark',
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});

const App = ({ classes, ...props }) => {
  let [isDark, switchThemeFunc] = useState(localStorage.isDark === false);
  let [isLoggedIn, updateLogin] = useState(localStorage.olivia_pid !== '');
  let [currentUser, updateUser] = useState(() => {
    try {
      const token = localStorage.getItem('olivia_token');
      const [, payload] = token.split(/\./);
      const decodedpayload = atob(payload); // base64 decode
      let { pid, admin } = JSON.parse(decodedpayload);
      return {
        pid,
        admin,
        authenticated: true
      };
    } catch {
      return { authenticated: false };
    }
  });
  const [isAdmin, updateAdmin] = useState(0);

  // Endpoint for the websocket.
  // Base url.
  const endpoint = 'http://localhost:3000/';

  // Creating websockets to backend.
  const parkingLotSocket = io(`${endpoint}/parkingLot`);
  const parkingSpotSocket = io(`${endpoint}/parkingSpot`);
  const transactionHistorySocket = io(endpoint);
  const userSocket = io(`${endpoint}/user`);

  //console.log(localStorage.olivia_id);
  //localStorage.lastTab = "/";
  // history.push(history.location);

  // eslint-disable-next-line
  // let [currentUser, updateUser] = useState(initialUser);

  return (
    <React.Fragment>
      <MuiThemeProvider theme={isDark ? darkTheme : lightTheme}>
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
                path="/zones/:zone_id"
                label="List Parking Spots"
                key="/zones"
                hidden={true}
                reqAdmin={false}
                reqLogin={false}
                render={() => <Zone socket={parkingLotSocket} />}
              />
              <Route
                exact
                path="/profile"
                label="Profile"
                key="/profile"
                reqAdmin={false}
                reqLogin={true}
                hidden={false}
                render={() => <UserInfo socket={userSocket} />}
              />
              <Route
                exact
                path="/transaction_history"
                label="Transaction History"
                key="/transaction_history"
                reqAdmin={false}
                reqLogin={false}
                hidden={false}
                render={() => (
                  <TransactionHistory socket={transactionHistorySocket} />
                )}
              />
              <Route
                path="/zones/:zone_id/spot/:spot_id"
                key="/zones/:zone_id/spot/:spot_id"
                hidden={true}
                label="Spot Page"
                reqAdmin={false}
                reqLogin={false}
                render={() => <ParkingSpot socket={parkingSpotSocket} />}
              />
            </TabChooser>
          </Router>
        </div>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

export default withStyles(styles)(App);
