import React, { useState } from "react";
import { Link as RRLink } from 'react-router-dom';
import history from 'history'; // Change path to get to history file.
import apiprefix from 'apiprefix' // Stores 
import { makeAPICall } from 'api' // function to access the api. Change file path and name if necessary.

const LoginPage = ({
	updateUser,
  ...props
}) => {
		// Stores the message to be displayed to the user
		// such as incorrect password or anything from the server.
		const [message, updateMessage] = useState(null);
		
		// Redirects the user if user tried to access
		// pages that require authentication.
    	const nextLocation = 
    	history.location.state !== undefined 
			? history.location.state.from 
			: { pathname: '/' };

		const loginUser = async values => {
			let res = await makeAPICall('POST', `${apiprefix}/login`, values);
			let body = await res.json();

			if (res.status === 200) {
				updateUser({
					// Update the user with info
					authenticated = true
				});

				if (nextLocation.pathname === '/login') {
					nextLocation.pathname = '/';
				}
				
				history.replace(nextLocation.pathname);
				window.location.href = `${apiprefix}${nextLocation.pathname}`;
			} else {
				updateMessage(
					<Typograph>
						{body.message}
					</Typograph>
				);
			}
		};

		return (
			<>
				<Typography align="center" variant="h5">
					Login to change the current user
				</Typography>
				<Typography>
					<LoginForm
					onSubmit={values => loginUser(values)}
					message={message}
					/>
					<div align="center" style={{ paddingTop: '30px', fontSize: '16px' }}>
					Don't have an account?{' '}
					<Link component={RRLink} to="/register">
						Sign up
					</Link>{' '}
					for one!
					</div>
				</Typography>
			</>
	);
};