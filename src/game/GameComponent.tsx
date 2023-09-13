import React, { useEffect, memo } from 'react';
import Game from './Game';
import { styled } from '@stitches/react';

const GameComponent = () => {
  useEffect(() => {
    const g = new Game({ containerId: 'game' });

    return () => {
      g.remove();
    }
  }, []);

  return <Root id="game" />
};

const Root = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',

  '& > div': {
    left: '50% !important',
    transform: 'translateX(-50%)',
  }
});

const memoGameComponent = memo(GameComponent)

export default memoGameComponent;