import React, { useEffect } from 'react';
import Game from './Game';

const GameComponent = () => {
  useEffect(() => {
    const g = new Game();
  }, []);

  return (
    <></>
  )
};

export default GameComponent;