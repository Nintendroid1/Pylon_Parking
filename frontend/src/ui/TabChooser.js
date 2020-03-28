import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Link as RRLink } from 'react-router-dom';
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

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  },
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
  listItem: {
    color: theme.palette.text.primary
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
  ...props
}) {
  console.log(props);
  console.log(children);

  //let tabs = children.filter(tab => tab && !tab.props.hidden);

  // Find the index of the child whose path matches the pathname in the
  // location object.  Return 0 (defaults to first tab) if not found.
  function findCurrentTabBasedOnPath(location) {
    const selectedTab = children.findIndex(
      tab => tab.props.path === location.pathname
    );
    return selectedTab === -1 ? 0 : selectedTab;
  }
  // When the app boots and the tab chooser is rendered for the first time,
  // derive the initial tab state from the current location (received via
  // withRouter() which passes the 'location'/'history' properties to us.)
  // ReactJS docs recommend to use lazy initial state, see
  // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  // whenever the computation of the initial state is involved.
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      return index === value;
    });
    return tabRes.props.path;
  }

  function handleListSelect(value, path) {
    setDrawerOpen(false);
    history.push(path);
    selectTab(value);
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
    updateLogin(false);
    window.location.href = `${process.env.PUBLIC_URL}/`;
  } // apply HOC*/

  function LoginButton() {
    return (
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
    );
  }

  let LogoutButton = () => {
    let clickHandler = async () => {
      let shouldLogout = await dialog(
        <Confirm title="Are you sure?">
          <Typography variant="body2">
            Are you sure you want to log out?
          </Typography>
        </Confirm>
      );
      if (shouldLogout) {
        history.push('/logout');
      }
    };

    return (
      <Typography
        variant="h6"
        align="right"
        color="inherit"
        style={{ flexGrow: 1 }}
      >
        <Button
          onClick={clickHandler}
          key={'logout'}
          label={'Logout'}
          className="logout"
        >
          <AccountCircle className={classes.avatar} />
          <Typography
            variant="button"
            style={{ color: '#FFFFFF', fontSize: 15 }}
          >
            Logout
          </Typography>
        </Button>
      </Typography>
    );
  };

  let drawerContent = (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setDrawerOpen(false)}>
          {<ChevronLeftIcon />}
        </IconButton>
      </div>
      <FormControlLabel
        control={
          <Switch
            value={themeSwitchState}
            onChange={event => handleThemeChange(event.target.checked)}
          />
        }
        label="Switch Theme"
        className={classes.themeSwitch}
      />

      <Divider />
      <List color="inherit">
        {children.map((tab, index) =>
          !tab.props.hidden &&
          (!tab.props.reqLogin || (isLoggedIn && tab.props.reqLogin)) &&
          (!tab.props.reqAdmin || (currentUser.admin && tab.props.reqAdmin)) ? (
            <RRLink
              className="list-link"
              color="inherit"
              to={{
                pathname: tab.props.path,
                key: index,
                state: {
                  from: history.location
                }
              }}
              key={index}
            >
              <ListItem
                button
                color="inherit"
                key={tab.props.path}
                currenttab={currentTab}
                value={currentTab}
                onClick={() => handleListSelect(index, tab.props.path)}
              >
                <ListItemText
                  className={classes.listItem}
                  primary={tab.props.label}
                  key={index}
                />
              </ListItem>
            </RRLink>
          ) : null
        )}
      </List>
    </Drawer>
  );

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
            onClick={() => setDrawerOpen(true)}
            className={classNames(
              classes.menuButton,
              drawerOpen && classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            {isLoggedIn ? (
              <Tabs value={currentTab} onChange={handleTabChange}>
                {children.map((tab, i) => {
                  return !tab.props.hidden &&
                    (!tab.props.reqLogin ||
                      (currentUser.authenticated && tab.props.reqLogin)) &&
                    (!tab.props.reqAdmin ||
                      (currentUser.admin && tab.props.reqAdmin)) ? (
                    <Tab
                      component={RRLink}
                      to={{
                        pathname: tab.props.path,
                        state: {
                          from: history.location
                        }
                      }}
                      key={tab.props.label}
                      label={tab.props.label}
                      className="link"
                      style={{ fontSize: 16 }}
                    />
                  ) : null;
                })}
              </Tabs>
            ) : (
              <Tabs value={currentTab} onChange={handleTabChange}>
                {children.map((tab, i) => {
                  return !tab.props.reqLogin &&
                    !tab.props.reqAdmin &&
                    !tab.props.hidden ? (
                    <Tab
                      component={RRLink}
                      to={{
                        pathname: tab.props.path,
                        state: {
                          from: history.location
                        }
                      }}
                      key={tab.props.label}
                      label={tab.props.label}
                      className="link"
                      style={{ fontSize: 16 }}
                    />
                  ) : null;
                })}
              </Tabs>
            )}
          </Typography>
          {isLoggedIn ? LogoutButton() : LoginButton()}
        </Toolbar>
        {drawerContent}
      </AppBar>
    );
  }

  if (isLoggedIn && currentUser.admin === undefined) {
    //updateAdmin(currentUser.admin);
    //alert(isAdmin);
    //alert(currentUser.admin);
  }

  return (
    <>
      {customToolbar()}
      <main
        className={classNames(classes.content, {
          [classes.contentShift]: drawerOpen
        })}
      >
        <div className={classes.drawerHeader} />
        <RRSwitch>
          {children}
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
export default withRouter(withTheme(withStyles(styles)(TabChooser)));
