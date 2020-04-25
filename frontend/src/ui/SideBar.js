// Used for rendering the main side bar for the app,
// this is the main mode of navigation for the user.
//
// Dynamically adapts for both mobile and desktop environments.
import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
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
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { withGetScreen } from 'react-getscreen';
import Collapse from '@material-ui/core/Collapse';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import ListItemIcon from '@material-ui/core/ListItemIcon';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
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
  drawerPaper: {
    width: drawerWidth
  },
  drawerContainer: {
    overflow: 'auto'
  },
  drawerButton: {
    alignItems: 'right',
    justifyContent: 'right',
    marginRight: 36
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
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  activeTab: {
    color: theme.palette.secondary.main + ' !important'
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
});

let SideBar = ({
  classes,
  drawerOpen,
  setDrawerOpen,
  drawerWidth,
  themeSwitchState,
  isLoggedIn,
  handleThemeChange,
  toggleDrawer,
  children,
  currentUser,
  currentTab,
  handleListSelect,
  isTablet,
  isMobile,
  ...props
}) => {
  let theme = useTheme();

  let [open, setGroupOpen] = useState(false);

  function groupChildren(children) {
    // console.log(groupedChildren);

    return (
      <List color="inherit">
        {children.map((tab, index) => {
          if (typeof tab.props.children !== 'undefined') {
            let tab_children = tab.props.children;
            if (
              !tab.props.hidden &&
              (!tab.props.reqLogin || (isLoggedIn && tab.props.reqLogin)) &&
              (!tab.props.reqAdmin || (currentUser.admin && tab.props.reqAdmin))
            ) {
              return (
                <>
                  <ListItem button onClick={() => setGroupOpen(!open)}>
                    <ListItemIcon>{tab.props.icon}</ListItemIcon>
                    <ListItemText primary={tab.props.headerLabel} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    {tab_children.map((group_tab, gr_index) => {
                      if (
                        !group_tab.props.hidden &&
                        (!group_tab.props.reqLogin ||
                          (isLoggedIn && group_tab.props.reqLogin)) &&
                        (!group_tab.props.reqAdmin ||
                          (currentUser.admin && group_tab.props.reqAdmin))
                      ) {
                        return (
                          <RRLink
                            className="list-link"
                            color="inherit"
                            to={{
                              pathname: group_tab.props.path,
                              key: `${index}-${gr_index}`,
                              state: {
                                from: history.location.pathname
                              }
                            }}
                            key={`${index}-${gr_index}`}
                          >
                            <ListItem
                              button
                              color="inherit"
                              key={group_tab.props.path}
                              currenttab={currentTab}
                              value={currentTab}
                              selected={currentTab === `${index}-${gr_index}`}
                              className={clsx(
                                classes.listItem,
                                classes.nested,
                                {
                                  [classes.activeTab]:
                                    currentTab === `${index}-${gr_index}`
                                }
                              )}
                              onClick={() => {
                                handleListSelect(
                                  `${index}-${gr_index}`,
                                  group_tab.props.path
                                );
                              }}
                            >
                              <ListItemIcon
                                className={clsx({
                                  [classes.activeTab]:
                                    currentTab === `${index}-${gr_index}`
                                })}
                              >
                                {group_tab.props.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={group_tab.props.label}
                                key={`${index}-${gr_index}`}
                              />
                            </ListItem>
                          </RRLink>
                        );
                      }
                    })}
                  </Collapse>
                </>
              );
            }
          } else {
            if (
              !tab.props.hidden &&
              (!tab.props.reqLogin || (isLoggedIn && tab.props.reqLogin)) &&
              (!tab.props.reqAdmin || (currentUser.admin && tab.props.reqAdmin))
            ) {
              return (
                <RRLink
                  className="list-link"
                  color="inherit"
                  to={{
                    pathname: tab.props.path,
                    key: index,
                    state: {
                      from: history.location.pathname
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
                    selected={currentTab === index}
                    className={clsx(classes.listItem, {
                      [classes.activeTab]: currentTab === `${index}`
                    })}
                    onClick={() => {
                      handleListSelect(index, tab.props.path);
                    }}
                  >
                    <ListItemIcon
                      className={clsx({
                        [classes.activeTab]: currentTab === `${index}`
                      })}
                    >
                      {tab.props.icon}
                    </ListItemIcon>
                    <ListItemText primary={tab.props.label} key={index} />
                  </ListItem>
                </RRLink>
              );
            }
          }
        })}
      </List>
    );
  }

  function persistentDrawer() {
    return (
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen
          })
        }}
        open={drawerOpen}
      >
        <Toolbar />
        {groupChildren(React.Children.toArray(children))}
        <Divider />
      </Drawer>
    );
  }

  function temporaryDrawer() {
    return (
      <Drawer
        anchor={'left'}
        open={drawerOpen}
        ModalProps={{ onBackdropClick: () => setDrawerOpen(false) }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            {<ChevronLeftIcon />}
          </IconButton>
        </div>
        {groupChildren(React.Children.toArray(children))}
      </Drawer>
    );
  }

  return (
    <div className={classes.root}>
      {isTablet() || isMobile() ? temporaryDrawer() : persistentDrawer()}
    </div>
  );
};

export default withGetScreen(withTheme(withStyles(styles)(SideBar)));
