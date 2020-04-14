/**
 * Support for modal confirmation dialogs
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});
/*
 * Create a confirmation dialog, to be used with dialog below.
 */
export function Confirm({
  okLabel,
  cancelLabel,
  title,
  children,
  onHide,
  theme,
  ...other
}) {
  okLabel = okLabel || 'Ok';
  cancelLabel = cancelLabel || 'Cancel';
  title = title || '';

  // as an alternative to the onClose, you could use disableEscapeKeyDown
  // see https://material-ui.com/api/dialog/
  return (
    <MuiThemeProvider theme={theme}>
      <Dialog
        disableBackdropClick
        onClose={() => onHide(false)}
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={() => onHide(false)} color="secondary">
            {cancelLabel}
          </Button>
          <Button onClick={() => onHide(true)} color="secondary">
            {okLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </MuiThemeProvider>
  );
}

// source: jquense
// https://github.com/jquense/react-bootstrap-modal/issues/36
export function dialog(modalElement) {
  return new Promise(resolve => {
    let mountNode = document.createElement('div');
    let open = true;

    render();

    // onExited is called after the modal dialog has finished exiting
    // as per https://material-ui.com/api/dialog/#props
    function onExited() {
      if (!mountNode) return;
      ReactDOM.unmountComponentAtNode(mountNode);
      mountNode = null;
    }

    function render() {
      ReactDOM.render(
        React.cloneElement(modalElement, {
          open,
          onExited,
          onHide(action) {
            open = false; // close upon next render
            resolve(action);
            render();
          }
        }),
        mountNode
      );
    }
  });
}
