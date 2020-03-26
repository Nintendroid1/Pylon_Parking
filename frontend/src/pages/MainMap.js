import React from 'react';
import { Typography, Card, CardMedia } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
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
    color: 'black',
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

  const zones = [
    { name: 'Litton Reaves', id: 0 },
    { name: 'Derring Lot', id: 1 },
    { name: 'Perry Street Lot #1', id: 2 },
    { name: 'Perry Street Lot #2', id: 3 },
    { name: 'Perry Street Lot #3', id: 4 },
    { name: 'Lower Stanger Lot', id: 5 }
  ];
  var zoneList = zones.map(z => (
    <li style={{ listStyleType: 'none' }}>
      <a className={classes.zoneLink} href={`zones/${z.id}`}>
        {z.name}
      </a>
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
            alt="Contemplative Reptile"
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
