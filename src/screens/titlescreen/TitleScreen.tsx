import React, { useState } from 'react';
import TitleBannerComponent from './TitleBannerComponent';
import TitleMenuComponent from './TitleMenuComponent';
import LoginComponent from './LoginComponent';
import CreateAccountComponent from './CreateAccountComponent';

type Props = {
  setScreen: (screen: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  loggedIn: boolean;
  gameNetwork: object;
}

export default function TitlePagePanel ({ setScreen, setLoggedIn, loggedIn, gameNetwork } : Props): JSX.Element {

  let titleMenuDisplay = <div></div>;

  const [titleMenuMode, setTitleMenuMode] = useState('title');

  if (titleMenuMode === 'login') {
    console.log("Login time.");
    titleMenuDisplay = <LoginComponent setLoggedIn={setLoggedIn} loggedIn={loggedIn} setTitleMenuMode={setTitleMenuMode}/>
  } else if (titleMenuMode === 'create-account') {
    titleMenuDisplay = <CreateAccountComponent setLoggedIn={setLoggedIn} loggedIn={loggedIn} setTitleMenuMode={setTitleMenuMode}/>;
  }else if (titleMenuMode === 'title') {
    titleMenuDisplay = <TitleMenuComponent setScreen={setScreen} setLoggedIn={setLoggedIn} loggedIn={loggedIn} setTitleMenuMode={setTitleMenuMode}/>;
  }

  return (
    <div className="title-page-outside-container">
      <div className="title-page-inside-container">
        <TitleBannerComponent />
        { titleMenuDisplay }
      </div>
    </div>
  )
}


