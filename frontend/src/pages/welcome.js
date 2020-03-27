import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';

const styles = theme => ({
  tabLink: {
    color: theme.palette.secondary.main
  }
});

const WelcomeTab = ({ classes, ...props }) => {
  return (
    <>
      <Typography align="center" variant="h5" gutterBottom>
        Welcome
      </Typography>
      <Typography component={'span'} variant="h6">
        <div align="center" style={{ paddingTop: '30px' }}>
          {'Parkings spots of the future'}
        </div>
      </Typography>
    </>
  );
};

export default withTheme(withStyles(styles)(WelcomeTab));
