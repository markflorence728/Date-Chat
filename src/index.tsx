import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { detect } from 'detect-browser';

export const browser = detect();
if (
  browser?.os &&
  browser?.name &&
  !['Mac OS', 'iOS'].includes(browser.os) &&
  !['ios', 'safari', 'ios-webview'].includes(browser.name)
) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js')
      .then(function (registration) {
        console.log('Registration successful, scope is:', registration.scope);

        registration.pushManager.getSubscription().then(function (sub) {
          if (sub === null) {
            // Update UI to ask user to register for Push
            console.log('Not subscribed to push service!');
          } else {
            // We have a subscription, update the database
            console.log('Subscription object: ', sub);
          }
        });
      })
      .catch(function (err) {
        console.log('Service worker registration failed, error:', err);
      });
  }
}

ReactDOM.render(
  <React.Fragment>
    <RecoilRoot>
      <BrowserRouter>
        <Suspense fallback="loading...">
          <App />
        </Suspense>
      </BrowserRouter>
    </RecoilRoot>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
