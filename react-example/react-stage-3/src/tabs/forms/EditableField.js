import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  emptyField: {
    color: theme.palette.grey[500],
    fontStyle: 'italic'
  },
  textField: {
    color: theme.palette.secondary.main
  }
});

let EditableField = ({
  classes,
  fieldText,
  fieldType = 'text',
  fieldName,
  updateFunc,
  formObject,
  isSubmitting,
  setSubmitting,
  isEditable,
  setEditable,
  isRequired,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false);
  const [text, updateText] = useState(fieldText);
  const [draftText, updateDraft] = useState(fieldText);
  let hasChanged = false;

  function toggleEditing() {
    updateDraft(text);
    setEditing(!isEditing);
  }

  const handleChange = event => {
    let { value } = event.target; // name/value from input element that changed
    updateDraft(value);
    updateFunc({ ...formObject, [fieldName]: draftText });
    hasChanged = true;
  };

  const handleSubmit = event => {
    event.preventDefault();
    updateFunc({ ...formObject, [fieldName]: draftText });
  };

  const handleCancel = event => {
    updateDraft(text);
    setEditing(false);
    console.log(text);
    hasChanged = false;
  };

  return (
    <>
    {isRequired ?
      <TextField
        required
        label={fieldName}
        autoFocus
        type={fieldType}
        id={'input-field'}
        onChange={handleChange}
        value={draftText}
        fontSize={25}
        variant="outlined"
      /> :
      <TextField
      label={fieldName}
      autoFocus
      type={fieldType}
      id={'input-field'}
      onChange={handleChange}
      value={draftText}
      fontSize={25}
      variant="outlined"
    />}
    </> 

  );
};

EditableField.propTypes = {
  fieldText: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  fieldType: PropTypes.string,
  formObject: PropTypes.object.isRequired,
  updateFunc: PropTypes.func.isRequired
};

export default withTheme()(withStyles(styles)(EditableField));

/*

          <TextField
            id="outlined-name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
            variant="outlined"
          />


                <IconButton
        size="small"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        <CheckIcon style={{ fontSize: 20 }} />
      </IconButton>
      <IconButton
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleCancel}
      >
        <CloseIcon style={{ fontSize: 20 }} />
      </IconButton>
          */
