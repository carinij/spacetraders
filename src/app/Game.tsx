import React, { useState } from "react";
import TitlePagePanel from "../screens/titlescreen/TitleScreen";
import DevMenu from "../screens/devmenu/DevMenu";
import GalaxyPagePanel from "../screens/galaxyscreen/GalaxyScreen";
import Network from "../network/Network";

export const Game = (): JSX.Element => {
  const [screen, setScreen] = useState("titlePage");
  const [loggedIn, setLoggedIn] = useState(false);

  const gameNetwork = new Network();

  let screenToRender = <div />;

  const changeScreen = (screenName: string) => {
    switch (screenName) {
      case "titlePage":
        screenToRender = <TitlePagePanel gameNetwork={gameNetwork} setScreen={setScreen} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>;
        break;
      case "devMenu":
        screenToRender = <DevMenu gameNetwork={gameNetwork} setScreen={setScreen} />;
        break;
      case "galaxyPage":
        screenToRender = <GalaxyPagePanel gameNetwork={gameNetwork} setScreen={setScreen}/>;
        break;
      default:
        console.log("Default case reached for changeScreen.");
    }
  };

  changeScreen(screen);

  return <div>{screenToRender}</div>;
};

