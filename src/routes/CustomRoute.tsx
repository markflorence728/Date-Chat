import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { meState } from '../recoil/atoms/users.atom';

// @ts-ignore
const CustomRoute = ({ component: Component, required_auth, ...rest }) => {
  const me = useRecoilValue(meState);
  const id_token = localStorage.getItem('privatedate.id_token');

  return (
    <Route
      {...rest}
      render={props =>
        required_auth ? (
          me?.authorized || id_token ? (
            <Component {...props} />
          ) : (
            <Redirect to="/landing" />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default CustomRoute;
