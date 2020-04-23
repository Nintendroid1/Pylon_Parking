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
import SellPage from './pages/sell-page';
import apiprefix from './pages/apiprefix';
import ProfilePage from './pages/profile';
import UserInfo from './pages/user-info';
import UpdateUserInfo from './pages/update-user-info';
import BountySystem from './pages/bounty-system';
import CustomSnackbar from './ui/snackbars';
import AccountPage from './pages/account-page';

import Typography from '@material-ui/core/Typography';
import history from './history';
import Dashboard from './ui/Dashboard';
import SimpleChart from './ui/SimpleChart';

// Icons
import MapIcon from '@material-ui/icons/Map';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HistoryIcon from '@material-ui/icons/History';
import HomeIcon from '@material-ui/icons/Home';
import ReportIcon from '@material-ui/icons/Report';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar
});

let lightTheme = createMuiTheme({
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
    tonalOffset: 0.2,
    shadows: 'none',
    zDepthShadows: 'none'
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});
let darkTheme = createMuiTheme({
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOptions, updateSnackbarOptions] = useState({
    verticalPos: 'top',
    horizontalPos: 'center',
    message: '',
    severity: 'info'
  });
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
  let [curTheme, updateTheme] = useState(lightTheme);

  // Endpoint for the websocket.
  // Base url.
  const endpoint = 'http://localhost:3001';
  // const endpoint = window.location.host;

  const parkingLotSocket = io(`${endpoint}/zones`); //{ path: `${endpoint}/zones` });
  const parkingSpotSocket = io(`${endpoint}/parking_spot`); //{ path: `${endpoint}/parkingSpot` });
  const transactionHistorySocket = io(`${endpoint}/transactionHistory`);
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
              curTheme={curTheme}
            >
              <Route
                exact
                path="/"
                label="Welcome"
                key="/"
                icon={<HomeIcon />}
                hidden={false}
                reqAdmin={false}
                reqLogin={false}
                render={() => (
                  <WelcomeTab classes={classes} userSocket={userSocket} />
                )}
              />
              <Route
                exact
                path="/map"
                label="Map"
                key="/map"
                icon={<MapIcon />}
                hidden={false}
                reqAdmin={false}
                reqLogin={false}
                render={() => <MainMap userSocket={userSocket} />}
              />
              <div
                id="group"
                key="profile-group"
                headerLabel="My Profile"
                reqLogin={true}
                reqAdmin={false}
                hidden={false}
                icon={<PersonOutlineIcon />}
              >
                <Route
                  exact
                  path="/dashboard"
                  label="Dashboard"
                  key="/dashboard"
                  panelGroup="profile"
                  icon={<DashboardIcon />}
                  reqAdmin={false}
                  reqLogin={false}
                  hidden={false}
                  render={() => (
                    <Dashboard
                      transactionHistorySocket={transactionHistorySocket}
                      userSocket={userSocket}
                    />
                  )}
                />
                <Route
                  path="/transaction_history"
                  label="Transaction History"
                  key="/transaction_history"
                  panelGroup="profile"
                  icon={<HistoryIcon />}
                  reqAdmin={false}
                  reqLogin={false}
                  hidden={false}
                  render={() => (
                    <TransactionHistory
                      classes={classes}
                      userSocket={userSocket}
                      socket={transactionHistorySocket}
                    />
                  )}
                />
                <Route
                  exact
                  path="/my_spots"
                  label="My Spots"
                  key="/my_spots"
                  icon={<DirectionsCarIcon />}
                  reqAdmin={false}
                  reqLogin={true}
                  hidden={false}
                  render={() => (
                    <SellPage isLoggedIn={isLoggedIn} socket={userSocket} />
                  )}
                />
                <Route
                  exact
                  path="/account"
                  label="Account Info"
                  key="/account"
                  icon={<AccountBoxIcon />}
                  hidden={false}
                  reqAdmin={false}
                  reqLogin={true}
                  render={() => (
                    <AccountPage
                      socket={userSocket}
                      history={history}
                      isLoggedIn={isLoggedIn}
                    />
                  )}
                />
                <Route
                  exact
                  path="/profile"
                  label="Profile"
                  key="/profile"
                  icon={<PersonOutlineIcon />}
                  hidden={false}
                  reqAdmin={false}
                  reqLogin={true}
                  render={() => (
                    <ProfilePage socket={userSocket} isLoggedIn={isLoggedIn} />
                  )}
                />
              </div>
              <Route
                exact
                path="/bounty"
                label="Report"
                key="/bounty"
                icon={<ReportIcon />}
                hidden={false}
                reqAdmin={false}
                reqLogin={false}
                render={() => <BountySystem userSocket={userSocket} />}
              />
              {/*render={() => <UserInfo isLoggedIn={isLoggedIn} socket={userSocket} />}*/}
              <Route
                exact
                path="/profile/edit"
                label="Edit Profile"
                key="/profile/edit"
                hidden={true}
                reqAdmin={false}
                reqLogin={true}
                render={() => <UpdateUserInfo isLoggedIn={isLoggedIn} />}
              />
              <Route
                path="/zones/:zone_id/spot/:spot_id"
                key="/zones/:zone_id/spot/:spot_id"
                hidden={true}
                label="Spot Page"
                reqAdmin={false}
                reqLogin={false}
                render={() => (
                  <ParkingSpot
                    userSocket={userSocket}
                    socket={parkingSpotSocket}
                  />
                )}
              />
              <Route
                path="/zones/:zone_id"
                label="List Parking Spots"
                key="/zones"
                hidden={true}
                reqAdmin={false}
                reqLogin={false}
                render={() => (
                  <Zone userSocket={userSocket} socket={parkingLotSocket} />
                )}
              />
            </TabChooser>
          </Router>
        </div>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

export default withStyles(styles)(App);
