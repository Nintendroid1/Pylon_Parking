/**
 * The component that handles the main map page. Displays the map and
 * links to the different parking spots.
 */

import React, { useState, useEffect } from 'react';
import { Typography, Card, CardMedia } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { makeAPICall } from '../api';
import apiprefix from './apiprefix';
import history from '../history';
import CustomSnackbar from '../ui/snackbars';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Title from '../ui/Title';
import { sizing } from '@material-ui/system';
// import './MainMap.css';

const styles = theme => ({
  tabLink: {
    color: theme.palette.secondary.main
  },
  container: {
    display: 'flex',
    flexgrow: 1,
    justifyContent: 'center',
    textAlign: 'center',
    width: 1020
  },
  main_map: {
    width: '100%',
    height: 'auto'
  },
  zoneLink: {
    fontSize: '20px',
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  centerCol: {
    display: 'flex',
    flexgrow: 1,
    justifyContent: 'center',
    textAlign: 'center',
    width: 1600,
    margin: '0 auto',
    marginTop: 20
  }
});

/**
 * The component that is exported. Displays the map and the links to
 * the different zones.
 *
 * @param {Object} param0
 */
const MainMap = ({ classes, userSocket, ...props }) => {
  // Make api request to get list of available zones
  // todo

  // const zones = [
  //   { name: 'Litton Reaves', id: 0 },
  //   { name: 'Derring Lot', id: 1 },
  //   { name: 'Perry Street Lot #1', id: 2 },
  //   { name: 'Perry Street Lot #2', id: 3 },
  //   { name: 'Perry Street Lot #3', id: 4 },
  //   { name: 'Lower Stanger Lot', id: 5 }
  // ];
  const [zones, updateZones] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOptions, updateSnackbarOptions] = useState({
    verticalPos: 'top',
    horizontalPos: 'center',
    message: '',
    severity: 'info'
  });

  const get_zones = async () => {
    const url = `${apiprefix}/zones/all`;
    let resp = await makeAPICall('GET', url);
    let res_body = await resp.json();
    console.log('ZONES');
    console.log(res_body);
    updateZones(res_body.zones);
  };

  useEffect(() => {
    get_zones();
  }, []);

  useEffect(() => {
    // Socket for handling user personal info.
    userSocket.on(`sell-${localStorage.olivia_pid}`, () => {
      setOpenSnackbar(false);

      // Make it so that the data variable stores the message.
      updateSnackbarOptions({
        ...snackbarOptions,
        message:
          'You Got Rich! Go To Account To See How Much Disposable Income You Have.',
        severity: 'info'
      });
      setOpenSnackbar(true);
    });
  });

  var zoneList = zones.map((z, idx) => (
    <li style={{ listStyleType: 'none' }}>
      <Link
        className={classes.zoneLink}
        to={{
          pathname: `zones/${z.zone_id}`,
          state: {
            from: history.location.pathname
          }
        }}
      >
        {`Zone ${idx + 1}: ${z.zone_name}`}
      </Link>
    </li>
  ));
  return (
    <>
      <CustomSnackbar
        isOpen={openSnackbar}
        updateIsOpen={setOpenSnackbar}
        verticalPos={snackbarOptions.verticalPos}
        horizontalPos={snackbarOptions.horizontalPos}
        message={snackbarOptions.message}
        severity={snackbarOptions.severity}
      />
      <Typography align="center" variant="h5" gutterBottom>
        Parking Map
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card className={classes.container}>
          <CardMedia
            component="img"
            alt="Parking Map"
            width="100%"
            height="auto"
            image={require('./images/parking-map.png')}
            title="Main Map"
          />
        </Card>
      </div>
      <Typography color="primary" variant="h6">
        <div
          style={{
            display: 'flex',
            marginTop: '40px',
            marginLeft: '20%',
            marginRight: '20%'
          }}
        >
          <TableContainer
            align="center"
            classes={classes.container}
            component={Paper}
          >
            <Title align="center">Parking Zones</Title>
            <Table size="small" width="50%">
              <TableBody>
                <TableHead>
                  <TableRow></TableRow>
                </TableHead>
                {zones.map(z => (
                  <TableRow key={z.zone_id}>
                    <TableCell colspan={1}>{z.zone_id}</TableCell>
                    <TableCell colspan={1}></TableCell>
                    <TableCell colspan={1}>
                      <Link
                        className={classes.zoneLink}
                        to={{
                          pathname: `zones/${z.zone_id}`,
                          state: {
                            from: history.location.pathname
                          }
                        }}
                      >
                        {z.zone_name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Typography>
    </>
  );
};

export default withTheme(withStyles(styles)(MainMap));
