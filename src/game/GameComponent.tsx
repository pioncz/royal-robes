import { useEffect, memo, useContext } from 'react';
import Game from './Game';
import { styled } from '@stitches/react';
import GameDbContext from 'game-ui/contexts/GameDbContext';

const GameComponent = () => {
  const { name, setGameInstance, setStatistics } =
    useContext(GameDbContext);

  useEffect(() => {
    const g = new Game({ containerId: 'game', name });

    g.on('playerUpdate', (playerStatistics) => {
      setStatistics(playerStatistics);
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
