import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import './MainMap.css';

const styles = theme => ({
  tabLink: {
    color: theme.palette.secondary.main
  }
});

const MainMap = ({ classes, ...props }) => {
  return (
    <>
      <Typography align="center" variant="h5" gutterBottom>
        Parking Map
      </Typography>
      <Typography component={'span'} variant="h6">
        <div align="center" style={{ paddingTop: '30px' }}>
          {'Parkings spots of the future'}
        </div>
      </Typography>
      <div className="container" id="image_container">
        <img
          className="main_map"
          id="main-map"
          src={require('./images/parking-map.png')}
          alt="map"
        />
      </div>
    </>
  );
};

export default withTheme()(withStyles(styles)(MainMap));
