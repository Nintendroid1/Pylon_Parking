import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const CustomSnackbar = ({
  isOpen,
  updateIsOpen,
  verticalPos,
  horizontalPos,
  message,
  severity
}) => {

  const handleOnClose = () => {
    updateIsOpen(false);
  }

  return (
    <>
      <Snackbar 
        anchorOrigin={{ verticalPos, horizontalPos }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleOnClose}
      >
        <Alert onClose={handleOnClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomSnackbar;