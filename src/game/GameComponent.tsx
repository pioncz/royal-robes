import { useEffect, memo, useContext } from 'react';
import Game from './Game';
import { styled } from '@stitches/react';
import GameDbContext from 'game-ui/contexts/GameDbContext';
import throttle from 'lodash/throttle';
import { PlayerStatistics, Point } from './utils/Types';

const GameComponent = () => {
  const {
    name,
    position,
    setGameInstance,
    setStatistics,
    setPosition,
  } = useContext(GameDbContext);

  useEffect(() => {
    const g = new Game({ containerId: 'game', name, position });
    const statsHandler = (playerStatistics: PlayerStatistics) => {
      setStatistics(playerStatistics);
    };
    const positionHandler = throttle((newPosition: Point) => {
      setPosition(newPosition);
    }, 1000);

    g.on('playerUpdate', statsHandler);
    g.on('positionUpdate', positionHandler);
    setGameInstance(g);

    return () => {
      g.off('playerUpdate', statsHandler);
      g.off('positionUpdate', positionHandler);
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
