/**
 * Exports the component that handles deleting a user.
 */

import React, { useState } from 'react';
import { makeAPICall } from '../api';
import DeleteAccount from './forms/user-components';
import { Typography } from '@material-ui/core';
import apiprefix from './apiprefix';

/**
 * The component that is exported, which makes the API call to
 * delete a user. Only the user can delete themself.
 * 
 * @param {Object} param0 
 */
const DeleteUser = ({open, setOpen}) => {
  const [message, updateMessage] = useState(null);

  const handleDelete = async (password) => {
    const url = `${apiprefix}/users/delete`;
    
    const response = await makeAPICall('POST', url, {password: password});
    const respbody = await response.json();

    if (response.status === 200) {
      // redirection.
      // make sure the user is completely logged out, like clear local storage of only our stuff.
    } else {
      updateMessage(respbody.message);
    }
  }

  return (
    <>
      {message ? 
        <Typography>
          {message}
        </Typography>
      :
        <DeleteAccount 
          open={open}
          setOpen={setOpen}
          handleDelete={handleDelete}
        />
      }
    </>
  );
}

export default DeleteUser;