import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Routing from './Routing.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_APP_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_APP_AUTH0_AUDIENCE;


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      audience={audience}
      authorizationParams={{
        redirect_uri: window.location.origin,
        onRedirectCallback: (appState) => {
          window.history.replaceState(
            {},
            document.title,
            appState?.returnTo || window.location.pathname,
          )
        },
        // scope: 'read:companies',
      }}
    >
      <Routing/>
    </Auth0Provider>
  </React.StrictMode>,
)
