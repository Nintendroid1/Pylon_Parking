import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { CircularProgress } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

const CustomPassword = ({
  password,
  propName,
  handleChange,
  hasError,
}) => {

  const [showPassword, updateShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    updateShowPassword(!showPassword)
  }

  return (
    <>
      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
      <Input
        error={hasError}
        id="standard-adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={handleChange(propName)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
}

const UpdatePasswordForm = (
  onSubmit,
) => {

  const [password, updatePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    hasNewPasswordMismatch: false,
  });

  // Should also do some input sanitization.
  const handleChange = name => event => {
    let { value } = event.target;
    let hasPasswordMismatch = false;

    if (password.confirmPassword !== '' && password.newPassword !== password.confirmPassword) {
      hasPasswordMismatch = true;
    }

    updatePassword({ ...password, [name]: value, hasNewPasswordMismatch: hasPasswordMismatch }); // update corresponding field in values object
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit({
      password: password.currentPassword,
      newPassword: password.newPassword
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomPassword 
          hasError={false}
          password={password.currentPassword}
          propName='currentPassword'
          handleChange={handleChange}
        />
        <CustomPassword
          hasError={password.hasNewPasswordMismatch}
          password={password.newPassword}
          propName='newPassword'
          handleChange={handleChange}
        />
        <CustomPassword 
          hasError={password.hasNewPasswordMismatch}
          password={password.confirmPassword}
          propName='confirmPassword'
          handleChange={handleChange}
        />
      </form>
    </>
  );
};

export {
  UpdatePasswordForm,
  CustomPassword
};