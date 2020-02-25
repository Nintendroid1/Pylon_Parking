import React, { useState } from 'react';
import TabChooser from './ui/TabChooser';
import WelcomeTab from './tabs/welcome';
//import RegisterTab from './tabs/register';
//import LoginTab from './tabs/login';
import SurveyTab from './tabs/questions';
import ProfileTab from './tabs/profile';
import EditProfileTab from './tabs/EditProfile';
import ListTab from './tabs/listusers';
import { Route } from 'react-router';
import { Router } from 'react-router-dom';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import QuestionDetail from './tabs/QuestionDetail';
import NewQuestion from './tabs/NewQuestion';
import EditQuestion from './tabs/EditQuestion';
//import { withRouter, Switch as RRSwitch } from 'react-router';
//import { Link as RRLink } from 'react-router-dom';
import queryString from 'query-string';

import Typography from '@material-ui/core/Typography';


import history from './history';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

const darkTheme = createMuiTheme({
  palette: {
    primary: green,
    type: 'dark' // Switching the dark mode on is a single property value change.
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});

const defaultTheme = createMuiTheme({
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

  let tabs = [
    { text: 'Welcome', path: '/', component: WelcomeTab, hidden: false },
    {
      text: 'Surveys',
      path: '/questions',
      component: SurveyTab,
      hidden: false
    },
    //{ text: 'Login', path: '/login', component: LoginTab, hidden: true },
    { text: 'Profile', path: '/profile', component: ProfileTab, hidden: true },
    {
      text: 'List Users',
      path: '/listusers/:page',
      component: ListTab,
      hidden: true
    }
  ];

  // eslint-disable-next-line
  // let [currentUser, updateUser] = useState(initialUser);

  return (
    <React.Fragment>
      <MuiThemeProvider theme={isDark ? darkTheme : defaultTheme}>
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
                path="/questions"
                label="Surveys"
                key="/questions"
                reqAdmin={false}
                reqLogin={true}
                hidden={false}
              >
                <SurveyTab isLoggedIn={isLoggedIn} updateLogin={updateLogin} />
              </Route>
              <Route
                exact
                path="/profile"
                label="Profile"
                key="/profile"
                reqAdmin={false}
                reqLogin={true}
                hidden={false}
              >
                <ProfileTab isLoggedIn={isLoggedIn} updateLogin={updateLogin} />
              </Route>
              <Route
                path="/listusers"
                label="List Users"
                key="/listusers"
                reqAdmin={true}
                reqLogin={true}
                hidden={false}
              >
                <ListTab isLoggedIn={isLoggedIn} updateLogin={updateLogin} />
              </Route>
              <Route
                path="/profile/edit"
                label="Edit Profile"
                key="/profile/edit"
                hidden={true}
                reqAdmin={false}
                reqLogin={true}
                localUser={currentUser}
                parentTab={{ pathname: '/profile' }}
              >
                <EditProfileTab
                  isLoggedIn={isLoggedIn}
                  updateLogin={updateLogin}
                />
              </Route>
              <Route
                exact
                path="/question/:qid"
                label="Question Tab"
                key="/question/:qid"
                reqAdmin={false}
                reqLogin={true}
                hidden={true}
              >
                <QuestionDetail
                  isLoggedIn={isLoggedIn}
                  updateLogin={updateLogin}
                  history={history}
                  currentUser={currentUser}
                />
              </Route>
              <Route
                exact
                path="/question/edit/:qid"
                label="Edit Question Tab"
                key="/question/edit/:qid"
                reqAdmin={false}
                reqLogin={true}
                hidden={true}
              >
                <EditQuestion
                  isLoggedIn={isLoggedIn}
                  updateLogin={updateLogin}
                  history={history}
                  currentUser={currentUser}
                />
              </Route>
              <Route
                path="/questions/new"
                label="Create New Question"
                key="/questions/new"
                reqAdmin={true}
                reqLogin={true}
                hidden={true}
              >
                <NewQuestion
                  isLoggedIn={isLoggedIn}
                  updateLogin={updateLogin}
                  history={history}
                  currentUser={currentUser}
                />
              </Route>

            </TabChooser>
          </Router>
        </div>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

/*
        <TabChooser>
          <WelcomeTab label="Welcome" name="WelcomeTab" path="/welcome"/>
          <RegisterTab label="Register" name="RegisterTab" path="/register" updateUser={updateUser} />
          <LoginTab label="Login" name="LoginTab" path="/login" updateUser={updateUser} />
          <ProfileTab label="Profile" name="ProfileTab" path="/profile"/>
          <ListTab label="List Users" name="ListTab" path="/listusers"/>
        </TabChooser>


                    <TabChooser changeTheme={switchThemeFunc} isLoggedIn={isLoggedIn}>
              {tabs.map(tab => (
                <Route exact path={tab.path} label={tab.text}>
                  <tab.component isDark={isDark} updateLogin={updateLogin} />
                </Route>
              ))}
            </TabChooser>
        */
export default withStyles(styles)(App);
