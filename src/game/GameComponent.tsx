import { useEffect, memo, useContext } from 'react';
import Game from './Game';
import { styled } from '@stitches/react';
import GameDbContext from 'game-ui/contexts/GameDbContext';

const GameComponent = () => {
  const { setAlive, setGameInstance } = useContext(GameDbContext);

  useEffect(() => {
    const g = new Game({ containerId: 'game' });

    g.on('playerUpdate', (playerStatistics) => {
      console.log('update', playerStatistics);
      setAlive(playerStatistics.alive);
    });
    setGameInstance(g);

    return () => {
      g.remove();
      setGameInstance();
    };
  }, []);

  return <Root id="game" />;
};

const Root = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',

  '& > div': {
    left: '50% !important',
    transform: 'translateX(-50%)',
  },
});

const memoGameComponent = memo(GameComponent);

export default memoGameComponent;
