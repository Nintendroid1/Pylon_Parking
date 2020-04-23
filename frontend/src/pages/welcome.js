/**
 * The welcome page.
 */

import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import CustomSnackbar from '../ui/snackbars';

const styles = theme => ({
  tabLink: {
    color: theme.palette.secondary.main
  }
});

/*
  The component that is exported. Shows the welcome page.
*/
const WelcomeTab = ({ classes, userSocket, ...props }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOptions, updateSnackbarOptions] = useState({
    verticalPos: 'top',
    horizontalPos: 'center',
    message: '',
    severity: 'info'
  });

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
        Welcome
      </Typography>
      <Typography component={'span'} variant="h6">
        <div align="center" style={{ paddingTop: '30px' }}>
          {'Parkings spots of the past, present, and future'}
        </div>
      </Typography>
    </>
  );
};

export default withTheme(withStyles(styles)(WelcomeTab));
