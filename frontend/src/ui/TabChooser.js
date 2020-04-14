import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Link as RRLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { withRouter, Switch as RRSwitch } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Route } from 'react-router';
import history from '../history';
import Button from '@material-ui/core/Button';
import { dialog, Confirm } from '../ui/ConfirmDialog';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LoginTab from '../pages/login';
import RegisterTab from '../pages/register';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider } from '@material-ui/core/styles';
import SideBar from './SideBar';
import clsx from 'clsx';
import PylonIcon from '../images/pylon_path.js';
import { withGetScreen } from 'react-getscreen';
import 'typeface-roboto';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    boxShadow: 'none',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 26
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  content: {
    padding: theme.spacing(3),
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar,
  avatar: {
    flex: 1,
    marginRight: theme.spacing.unit,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF'
  },
  login_logout: {
    flex: 1,
    padding: theme.spacing.unit * 3,
    justifyContent: 'flex-end',
    align: 'center'
  },
  themeSwitch: {
    marginLeft: theme.spacing.unit
  },
  logoutButton: {
    color: theme.palette.primary
  },
  zoneLink: {
    fontSize: '20px',
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  logoLink: {
    color: 'white',
    display: 'flex',
    textDecoration: 'none',
    flexWrap: 'wrap'
  },
  listItem: {
    color: theme.palette.text.primary
  },
  logo: {
    width: '25px',
    height: 'auto',
    marginRight: '15px'
  },
  circular: {
    width: '35px',
    marginRight: '10px',
    borderTopLeftRadius: '50% 50%',
    borderTopRightRadius: '50% 50%',
    borderBottomRightRadius: '50% 50%',
    borderBottomLeftRadius: '50% 50%'
  }
});

/* READ THIS:
 * In the example below, we use both a Menu inside a Drawer which the user
 * can activate, and the tab-based chooser (via Tabs).
 * Both allow a user to navigate to (client-side) react-route routes.
 * The tab-based chooser denotes the currently active tab with a red line,
 * so its state must be kept in sync.
 */
function TabChooser({
  children,
  changeTheme,
  classes,
  location,
  history,
  isLoggedIn,
  updateLogin,
  currentUser,
  updateUser,
  isAdmin,
  updateAdmin,
  isMobile,
  isTablet,
  curTheme,
  ...props
}) {
  console.log(props);
  console.log(children);

  //let tabs = children.filter(tab => tab && !tab.props.hidden);

  // Find the index of the child whose path matches the pathname in the
  // location object.  Return 0 (defaults to first tab) if not found.
  function findCurrentTabBasedOnPath(location) {
    var selectedTab = `-1`;
    children.forEach((tab, index) => {
      if (tab.props.path === location.pathname) {
        selectedTab = `${index}`;
        return;
      } else if (typeof tab.props.children !== 'undefined') {
        tab.props.children.forEach((nested_tab, nested_index) => {
          if (nested_tab.props.path === location.pathname) {
            selectedTab = `${index}-${nested_index}`;
            return;
          }
        });
      }
    });
    console.log(selectedTab);
    return selectedTab; // === -1 ? -1 : selectedTab;
  }
  // When the app boots and the tab chooser is rendered for the first time,
  // derive the initial tab state from the current location (received via
  // withRouter() which passes the 'location'/'history' properties to us.)
  // ReactJS docs recommend to use lazy initial state, see
  // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  // whenever the computation of the initial state is involved.
  const [drawerOpen, setDrawerOpen] = useState(!(isMobile() || isTablet()));
  const [themeSwitchState, setThemeSwitch] = useState(false);
  const [currentTab, selectTab] = useState(() =>
    findCurrentTabBasedOnPath(location)
  );
  // Listen for navigation changes, for instance, when the user navigates by
  // clicking a <Link> that is not tied to a tab, but elsewhere in the application.
  // This includes <Link> elements in pages, or RR <Link> elements in the drawer menu.
  // See the Welcome component for an example of how to use <Link>.
  history.listen(location => {
    selectTab(findCurrentTabBasedOnPath(location));
  });

  function handleThemeChange(state) {
    localStorage.isDark = state;
    setDrawerOpen(false);
    setThemeSwitch(state);
    changeTheme(state);
  }

  function pathFromTabIndex(value) {
    const tabRes = children.find((tab, index) => {
      if (index === value) {
        return true;
      } else if (typeof tab.props.children !== 'undefined') {
        return tab.props.children.find((nested_tab, nested_index) => {
          if (`${index}-${nested_index}` === value) {
            return true;
          }
        });
      }
    });
    return tabRes.props.path;
  }

  function handleListSelect(value, path) {
    if (isMobile() || isTablet()) {
      setDrawerOpen(false);
    }
    history.push(path);
    selectTab(value);
    console.log(currentTab);
    console.log(value);
    //handleTabChange(value);
  }

  function handleTabChange(event, value) {
    // let tabPath = pathFromTabIndex(value);
    //history.push(tabPath);
    //localStorage.lastTab = location.pathname;
    if (value >= 0) {
      selectTab(value);
    }
  }
  function handleLogout() {
    localStorage.olivia_pid = '';
    localStorage.removeItem('olivia_token');
    localStorage.removeItem('avatar');
    updateLogin(false);
    window.location.href = `${process.env.PUBLIC_URL}/`;
  } // apply HOC*/

  function hasChildren(tab) {
    return typeof tab.props.children !== 'undefined';
  }

  let LoginButton = ({ color, ...props }) => {
    return (
      <>
        <Typography
          variant="h6"
          align="right"
          color="inherit"
          style={{ flexGrow: 1 }}
        >
          <Button
            component={RRLink}
            to={{
              pathname: '/login',
              state: {
                from: history.location
              }
            }}
            key={'login'}
            label={'Login'}
            className="login"
          >
            <Typography
              variant="button"
              style={{ color: '#FFFFFF', fontSize: 15 }}
            >
              Login
            </Typography>
          </Button>
        </Typography>
      </>
    );
  };

  let LogoutButton = ({ color, classes, ...props }) => {
    let clickHandler = async () => {
      let shouldLogout = await dialog(
        <Confirm
          color="inherit"
          className={classes.logoutButton}
          title="Are you sure?"
          theme={curTheme}
        >
          <Typography
            className={classes.logoutButton}
            color="inherit"
            variant="body2"
          >
            Are you sure you want to log out?
          </Typography>
        </Confirm>
      );
      if (shouldLogout) {
        handleLogout();
        history.push('/logout');
      }
    };
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = link => {
      setAnchorEl(null);
      history.push(link);
    };

    function drawAccountIcon() {
      if (localStorage.getItem('avatar') === null) {
        return (
          <>
            <AccountCircle className={classes.avatar} />
          </>
        );
      } else {
        return (
          <>
            <img
              className={classes.circular}
              alt="userIcon"
              src={`${localStorage.avatar}`}
            />
          </>
        );
      }
    }

    return (
      <>
        <Typography
          className={classes.logoutButton}
          variant="h7"
          align="right"
          color={color}
          style={{ flexGrow: 1 }}
        >
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            {drawAccountIcon()}
            <Typography
              variant="button"
              style={{ color: '#FFFFFF', fontSize: 14 }}
            >
              {localStorage.olivia_pid}
            </Typography>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleClose('/Profile')}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={() => handleClose('/my_spots')}>
              My Spots
            </MenuItem>
            <MenuItem onClick={clickHandler}>Logout</MenuItem>
          </Menu>
        </Typography>
      </>
    );
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  function customToolbar() {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <></>;
    }
    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: drawerOpen
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={toggleDrawer}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Link
            className={classes.logoLink}
            to={{
              pathname: `/`,
              state: {
                from: history.location
              }
            }}
          >
            <PylonIcon className={classes.logo} />
            <Typography style={{ fontFamily: 'Roboto' }}>
              Pylon Parking
            </Typography>
          </Link>
          {isLoggedIn ? (
            <LogoutButton classes={classes} color="inherit" />
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      {customToolbar()}
      {location.pathname === '/login' ||
      location.pathname === '/register' ? null : (
        <SideBar
          classes={classes}
          drawerOpen={drawerOpen}
          drawerWidth={drawerWidth}
          setDrawerOpen={setDrawerOpen}
          toggleDrawer={toggleDrawer}
          themeSwitchState={themeSwitchState}
          handleListSelect={handleListSelect}
          isLoggedIn={isLoggedIn}
          handleThemeChange={handleThemeChange}
          children={children}
          currentUser={currentUser}
          currentTab={currentTab}
        />
      )}
      <main
        className={classNames(classes.content, {
          [classes.contentShift]: drawerOpen
        })}
      >
        <div className={classes.appBarSpacer} />
        <div className={classes.drawerHeader} />
        <RRSwitch>
          {children.map((tab, index) => {
            if (!hasChildren(tab)) {
              return tab;
            } else {
              return tab.props.children;
            }
          })}
          <Route exact path="/login" hidden={true}>
            <LoginTab
              updateLogin={updateLogin}
              updateUser={updateUser}
              updateAdmin={updateAdmin}
              key={'login'}
            />
          </Route>
          <Route exact path="/register" key={'register'} hidden={true}>
            <RegisterTab
              updateLogin={updateLogin}
              updateUser={updateUser}
              updateAdmin={updateAdmin}
            />
          </Route>
          <Route
            exact
            path="/logout"
            hidden={true}
            render={() => {
              localStorage.olivia_pid = '';
              localStorage.removeItem('olivia_token');
              updateLogin(false);
              history.replace('/');
              window.location.href = `${process.env.PUBLIC_URL}/`;
            }}
          />
          <Route>
            <Typography
              variant="h2"
              align="center"
              style={{ fontSize: 160, paddingTop: '50px' }}
              gutterBottom
            >
              404
            </Typography>
            <Typography
              variant="h2"
              align="center"
              style={{ fontSize: 30 }}
              gutterBottom
            >
              Page Not Found
            </Typography>
          </Route>
        </RRSwitch>
      </main>
    </>
  );
}

// the 'withRouter' HOC will make 'location' (and 'history', and 'match) available
// to the component.
// See https://reacttraining.com/react-router/web/api/withRouter
export default withGetScreen(
  withRouter(withTheme(withStyles(styles)(TabChooser)))
);
