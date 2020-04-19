/**
 * Form used to update the user password.
 */

import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

/*
  A custom component that allows the user to enter their password.
*/
const CustomPassword = ({ password, propName, handleChange, hasError }) => {
  const [showPassword, updateShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    updateShowPassword(!showPassword);
  };

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
};

/*
  Creates the form to allow the user to enter their old and
  new password.
*/
const UpdatePasswordForm = onSubmit => {
  const [password, updatePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    hasNewPasswordMismatch: false
  });

  const handleChange = name => event => {
    console.log(event);
    let { value } = event.target;
    let hasPasswordMismatch = false;
    const validChar = /^[0-9a-zA-Z]+$/;

    // Sanitizes input to only alphanumerics.
    if (!value.match(validChar)) {
      hasPasswordMismatch = true;
    } else if (
      password.confirmPassword !== '' &&
      password.newPassword !== password.confirmPassword
    ) {
      hasPasswordMismatch = true;
    }

    updatePassword({
      ...password,
      [name]: value,
      hasNewPasswordMismatch: hasPasswordMismatch
    }); // update corresponding field in values object
  };

  // Handles submitting the form.
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
          propName="currentPassword"
          handleChange={handleChange}
        />
        <CustomPassword
          hasError={password.hasNewPasswordMismatch}
          password={password.newPassword}
          propName="newPassword"
          handleChange={handleChange}
        />
        <CustomPassword
          hasError={password.hasNewPasswordMismatch}
          password={password.confirmPassword}
          propName="confirmPassword"
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
