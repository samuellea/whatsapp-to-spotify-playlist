import React from "react";
import { useState, useEffect } from "react";
import * as h from './helpers'

import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ publicStatsHashNonAuth, children, ...rest }) {
  // console.log(publicStatsHashNonAuth);
  const token = localStorage.getItem('token');
  const firebaseUserId = localStorage.getItem('firebaseUserId');
  const email = localStorage.getItem('email');

  const hasNecessaries = () => {
    if (token && firebaseUserId && email) return true;
    return false;
  };

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (publicStatsHashNonAuth) {
          // console.log(publicStatsHashNonAuth)
          // console.log('publicStatsHashNonAuth!')
          if (location.hash) {
            // conditional logic for non-firebase auth'd users logging into Spoti on the publicStats page when making playlists
            // - grab spotifyToken from redirected URL and set in localStorage
            const spotifyToken = location.hash.substring(1).split('&').find(e => e.startsWith('access_token')).split('=')[1];
            window.localStorage.setItem('spotifyToken', spotifyToken);
            window.location.hash = '';
          }
        }
        // if no token, check if using publicStats page. If not, redirect to login
        return (hasNecessaries() ? (
          children
        ) : publicStatsHashNonAuth !== null ? (
          <Redirect
            to={{
              pathname: `/publicStats/${publicStatsHashNonAuth}`,
              state: { from: location }
            }}
          />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        ))
      }
      }
    />
  );
}

export default PrivateRoute;