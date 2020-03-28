import React, { useState, useEffect } from 'react';
import { Typography, Card, CardMedia } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { makeAPICall } from '../api';
import apiprefix from './apiprefix';
import history from '../history';
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
    justifyContent: 'left',
    textAlign: 'left',
    width: 1000,
    margin: '0 auto',
    marginTop: 20
  }
});

const MainMap = ({ classes, ...props }) => {
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

  const get_zones = async () => {
    const url = `${apiprefix}/zones/all`;
    let resp = await makeAPICall('GET', url);
    let res_body = await resp.json();
    console.log('ZONES');
    console.log(res_body);
    updateZones(res_body.zones);
  };
  // useEffect(() => {

  // // do anything only one time if you pass empty array []
  // // keep in mind, that component will be rendered one time (with default values) before we get here
  // }, [] )
  useEffect(() => {
    get_zones();
  }, []);

  var zoneList = zones.map(z => (
    <li style={{ listStyleType: 'none' }}>
      <Link
        className={classes.zoneLink}
        to={{
          pathname: `zones/${z.zone_id}`,
          state: {
            from: history.location
          }
        }}
      >
        {z.zone_name}
      </Link>
    </li>
  ));
  return (
    <>
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
      <div className={classes.centerCol}>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <ul>{zoneList}</ul>
        </div>
      </div>
    </>
  );
};

export default withTheme(withStyles(styles)(MainMap));
