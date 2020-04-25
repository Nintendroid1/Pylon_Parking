// ==++==
// Adapted from the Dashboard template:
//    https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
// ==--==

import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import apiprefix from '../pages/apiprefix.js';
import history from '../history';

function preventDefault(event) {
  event.preventDefault();
}

const styles = theme => ({
  depositContext: {
    flex: 1
  },
  link: {
    fontSize: '20px',
    color: 'black',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

const RecentSpots = ({ classes }) => {
  const url = `${apiprefix}/history`;
  return (
    <React.Fragment>
      <Title>Recent Listings</Title>
      <Typography component="p" variant="h4">
        Spot 2-1 Derring
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 23 April, 2020
      </Typography>
      <div>
        <Link
          className={classes.link}
          color="primary"
          to={{
            pathname: `/my_spots`,
            state: {
              from: history.location.pathname
            }
          }}
          onClick={preventDefault}
        >
          See My Spots
        </Link>
      </div>
    </React.Fragment>
  );
};
export default withTheme(withStyles(styles)(RecentSpots));
