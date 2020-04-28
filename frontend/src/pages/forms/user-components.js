/**
 * Contains components used by user components.
 */

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CustomPassword from './update-user-form';

/*
  A component for deleting an account.
  Asks the user if they want to delete their account through a
  Dialog component.
*/
const DeleteAccount = ({
  handleDelete,
  open,
  setOpen,
}) => {

  const [password, updatePassword] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = event => {
    updatePassword(event.target.value);
  }

  const handleOnClick = () => {
    setOpen(false);
    handleDelete(password);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delet Account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? You will not be refunded for any
            hokie tokens loss and will lost all currently rented parking spots.
          </DialogContentText>
          <CustomPassword 
            password={password}
            handleChange={handleChange}
            hasError={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOnClick} color="secondary" autoFocus>
            DELETE!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteAccount;