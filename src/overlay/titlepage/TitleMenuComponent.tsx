import React, { MouseEventHandler } from 'react';

type Props = {
  serverStatus: string,
  clickHandler: MouseEventHandler
}

export const TitleMenuComponent = ({ serverStatus, clickHandler }: Props) =>
  <div className="title-menu-outside-container">
    <div className="title-menu-inside-container">
      <div className="status-view">
        <p>{ serverStatus }</p>
      </div>
      <ul className="login-menu-button-list">
        <li><button id="login-button" className="title-menu-button" onClick= { clickHandler }>Log In</button></li>
        <li><button id="create-account-button" className="title-menu-button" onClick= { clickHandler }>Create Account</button></li>
        {/* Start button should be disabled and opacity 0.5 or something to start. */}
        <li><button id="start-button" className="title-menu-button" onClick= { clickHandler }>Start</button></li>
        <li><button id="goto-dev-menu-button" className="title-menu-button" onClick= { clickHandler }>Dev Menu</button></li>
      </ul>
    </div>
  </div>
