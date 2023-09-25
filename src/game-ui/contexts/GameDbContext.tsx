import React, { createContext, useRef } from 'react';
import { useStorage } from 'game-ui/utils/useStorage';
import Game from 'game/Game';
import { type PlayerStatistics, type Point } from 'game/utils/Types';

export interface IGameDbContext {
  name: string;
  setName: (newValue: string) => void;
  setGameInstance: (game?: Game) => void;
  restart: () => void;
  statistics: PlayerStatistics;
  setStatistics: (newStatistics: PlayerStatistics) => void;
  position: Point;
  setPosition: (newPosition: Point) => void;
}

const initialState: IGameDbContext = {
  name: '',
  setName: () => {},
  setGameInstance: () => {},
  restart: () => {},
  statistics: { health: 0, experience: 0, gold: 0, alive: true },
  setStatistics: () => {},
  position: { x: 20.5, z: 4 },
  setPosition: () => {},
};

const GameDbContext = createContext(initialState);

export const GameDbContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [name, setName] = useStorage('name', initialState.name);
  const [statistics, setStatistics] = useStorage(
    'statistics',
    initialState.statistics,
    (v) => (v ? JSON.parse(v) : initialState.statistics),
    (v) => JSON.stringify(v),
  );
  const [position, setPosition] = useStorage(
    'position',
    initialState.position,
    (v) => (v ? JSON.parse(v) : initialState.position),
    (v) => JSON.stringify(v),
  );
  const gameRef = useRef<Game>();

  const restart = () => {
    if (!gameRef.current?.restart) {
      console.error('There is no game instance to restart');
      return;
    }

    gameRef.current.restart();
  };

  return (
    <GameDbContext.Provider
      value={{
        name,
        setName,
        setGameInstance: (game) => (gameRef.current = game),
        restart,
        statistics,
        setStatistics,
        position,
        setPosition,
      }}
    >
      {children}
    </GameDbContext.Provider>
  );
};

export default GameDbContext;
