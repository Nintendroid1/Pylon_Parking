import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import './MainMap.css';

const styles = theme => ({
  tabLink: {
    color: theme.palette.secondary.main
  },
  container: {
    display: 'flex',
    flexgrow: 1,
    width: 820,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  main_map: {
    width: '100%',
    height: 'auto'
  },
  eggs: {
    color: 'green'
  }
});

const MainMap = ({ classes, ...props }) => {
  return (
    <>
      <Typography align="center" variant="h5" gutterBottom>
        Parking Map
      </Typography>
      <Typography component={'span'} variant="h6">
        <div
          className={classes.eggs}
          align="center"
          style={{ paddingTop: '30px' }}
        >
          {'Parkings spots of the future'}
        </div>
      </Typography>
      <div align="center" className={classes.container}>
        <img
          className={classes.main_map}
          align="center"
          id="main_map"
          src={require('./images/parking-map.png')}
          alt="map"
        />
      </div>
    </>
  );
};

export default withTheme()(withStyles(styles)(MainMap));
