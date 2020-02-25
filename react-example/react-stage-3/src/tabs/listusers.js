import React, { useState } from 'react';
import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Check from '@material-ui/icons/Check';
import NavigateLeftIcon from '@material-ui/icons/NavigateBefore';
import NavigateRightIcon from '@material-ui/icons/NavigateNext';
import { Typography, CircularProgress } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import history from '../history';
import { Link } from 'react-router-dom';
import apiprefix from './apiprefix';

const styles = theme => ({
  table: {
    width: '90%',
    margin: 'auto'
  },

  navButton: {
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 6
  }
});

function createUserEntry(user) {
  return {
    id: user.id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    admin: user.admin
  };
}
const ListTab = ({ classes, history, location, ...props }) => {
  
  function findCurrentPageBasedOnPath(location) {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }
  const [haveCalled, updateCall] = useState(false);
  const [message, updateMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [userTable, updateUserList] = useState(null);
  const [pageNum, setPage] = useState(findCurrentPageBasedOnPath(location));
  const [lastRenderedPage, setLastRendered] = useState(-1);
  let hasMoreUsers = false;
  console.log('PAGE: ' + pageNum);
  history.listen(location => {
    let temp = findCurrentPageBasedOnPath(location);
    if (lastRenderedPage !== -1 && lastRenderedPage !== temp) {
      setPage(temp);
    }
  });

  //const [moreUsers, checkNumPrev] = useState(false);
  console.log(history);
  let query = queryString.parse(location.search);
  if (isNaN(Number(query.page))) {
    query = { page: '0' };
  }
  const { palette } = props.theme;

  async function prevPage() {
    if (Number(query.page) > 0) {
      query.page--;
      setPage(query.page);
      let tempLocation = {
        pathname: `/listusers`,
        search: `?page=${Number(query.page)}`,
        state: {
          from: history.location
        }
      };
      history.push(tempLocation);
      //history.goForward();
      await listUsers();
    }
  }
  async function nextPage() {
    query.page++;
    setPage(query.page);
    let tempLocation = {
      pathname: `/listusers`,
      search: `?page=${Number(query.page)}`,
      state: {
        from: history.location
      }
    };
    history.push(tempLocation);
    //history.goForward();
    await listUsers();
  }

  let buildTable = users => {
    let userList = [];
    users.map(user => userList.push(createUserEntry(user)));
    return (
      <>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <span />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Firstname</TableCell>
              <TableCell align="right">Lastname</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    to={{
                      pathname: `/profile/edit/${row.id}`,
                      state: {
                        from: history.location
                      }
                    }}
                  >
                    <IconButton
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      <EditIcon style={{ fontSize: 16 }} />
                    </IconButton>
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.firstname}</TableCell>
                <TableCell align="right">{row.lastname}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  {row.admin ? <Check /> : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container spacing={20} justify="center">
          <Grid item className={classes.navButton}>
            <IconButton
              //Previous Button
              disabled={query.page < 1}
              size="large"
              variant="contained"
              color="primary"
              onClick={prevPage}
            >
              <NavigateLeftIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Grid>

          <Grid item className={classes.navButton}>
            <IconButton
              //Next Button
              disabled={!hasMoreUsers}
              size="large"
              variant="contained"
              color="primary"
              onClick={nextPage}
            >
              <NavigateRightIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Grid>
        </Grid>
      </>
    );
  };

  let listUsers = async () => {
    console.log('RELOAD');
    //    showSpinner(true);
    const url = `${apiprefix}/users/?page=${query.page}`;
    setLastRendered(Number(query.page));
    setLoading(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    hasMoreUsers = rbody.has_more;
    setLoading(false);
    if (response.status === 200) {
      let { users } = rbody;
      updateUserList(buildTable(users));
    } else if (response.status === 403) {
      updateMessage(
        <div key="fail" style={{ color: '#fc3c3c' }}>
          Requires admin permission
        </div>
      );
    }
    // all API responses have JSON bodie
    //    showSpinner(false);
  };

  // This is to ensure listUsers() is only called once when the page loads
  if (
    !haveCalled ||
    (lastRenderedPage !== -1 && lastRenderedPage !== pageNum)
  ) {
    updateCall(true);
    listUsers();
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <Typography align="center" variant="h5" gutterBottom>
          List currently registerd users
        </Typography>
        <Typography>
          {isLoading ? (
            <div style={{ paddingTop: '50px' }} align="center">
              <CircularProgress />
            </div>
          ) : (
            userTable
          )}
          {message ? (
            <div
              style={{ paddingTop: '50px', fontSize: '18px' }}
              align="center"
            >
              {message}
            </div>
          ) : null}
        </Typography>
      </div>
    </>
  );
};

ListTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme()(withStyles(styles)(RequireAuthentication(ListTab)));

/*


            <Link
              to={{
                pathname: `/listusers`,
                search: `?page=${Number(query.page) + 1}`,
                state: {
                  from: `/listusers?page=${Number(query.page)}`
                }
              }}
            >


            */
