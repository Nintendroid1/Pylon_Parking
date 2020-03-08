import React from 'react';
import { Redirect, withRouter } from 'react-router';

export default function RequireAuthentication(Component) {
 const wrapper = props => {
   let { history, isLoggedIn } = props;
   if (isLoggedIn) {
     return <Component {...props} />;
   } else {
     return (
       <Redirect
         to={{
           pathname: `/login`,
           state: {
             from: history.location
           }
         }}
       />
     );
   }
 };

 return withRouter(wrapper);
}