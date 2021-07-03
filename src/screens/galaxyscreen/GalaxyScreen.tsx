import React, { useState } from 'react';
import RenderGame from '../../app/RenderGame';
import InfoBar from '../../bars/InfoBar';

type Props = {
  setScreen: (screen: string) => void;
  gameNetwork: any;
}

export default function GalaxyPagePanel ({ setScreen, gameNetwork } : Props): JSX.Element {

  const renderGame = new RenderGame();
  renderGame.Init();
  renderGame.CreateView();

  return (
    <div>
      <InfoBar gameNetwork={gameNetwork}/>
    </div>
  )
}


