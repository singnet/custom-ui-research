import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Manual from './Manual'

console.log(window.location);

if (window.location && window.location.pathname === "/manual") {
  ReactDOM.render(
    <Manual />,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}