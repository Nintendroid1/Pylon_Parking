// ==++==
// Adapted from the Dashboard template:
//    https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
// ==--==

import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Typography, Card, CardMedia } from '@material-ui/core';
import { withStyles, useTheme, withTheme } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexgrow: 1,
    justifyContent: 'left',
    textAlign: 'left',
    width: 1020,
    height: 1000
  }
});
let SimpleChart = ({ classes, series, options, ...props }) => {
  const theme = useTheme();
  let default_options = {
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    },
    chart: {
      animations: {
        enabled: false
      },
      id: 'yt',
      group: 'social',
      type: 'area',
      redrawOnParentResize: true,
      sparkline: {
        enabled: false
      }
    },
    colors: [theme.palette.secondary.main],
    yaxis: {
      labels: {
        minWidth: 40
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 5
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0
    }
  };
  options = { ...default_options, ...options };

  return (
    <div className="mixed-chart">
      <Chart
        options={options}
        series={series}
        type="area"
        height="235px"
        width="100%"
      />
    </div>
  );
};

export default withStyles(styles)(SimpleChart);
