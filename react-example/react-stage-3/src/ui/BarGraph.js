import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import {
  FlexibleXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  VerticalBarSeries,
  LabelSeries
} from 'react-vis';

const styles = theme => ({
  tabLink: {
    color: theme.palette.secondary.main
  }
});

const BarGraph = ({ classes, data, axisLabel, ...props }) => {
  const maxY = Math.max(...data.map(({ y }) => y));
  const nTicks = maxY > 10 ? 10 : maxY > 5 ? 5 : maxY;
  const margin = { left: 40, top: 10 };
  const tickFormatter = d => {
    //console.log(d);
    const s = d;
    return s.length > 10 ? s.substr(0, 10) + '...' : s;
  };
  return (
    <FlexibleXYPlot
      xType={'ordinal'}
      width={600}
      height={500}
      animation={true}
      margin={margin}
      colorType={'category'}
    >
      <HorizontalGridLines />
      <XAxis tickFormat={tickFormatter} />
      <YAxis tickTotal={nTicks} />
      <VerticalBarSeries
        className="vertical-bar-series-example"
        data={data}
        stack={false}
      />
    </FlexibleXYPlot>
  );
};

export default withTheme()(withStyles(styles)(BarGraph));
