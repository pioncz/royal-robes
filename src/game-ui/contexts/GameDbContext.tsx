import React, { createContext, useRef } from 'react';
import { useStorage } from 'game-ui/utils/useStorage';
import Game from 'game/Game';

export interface IGameDbContext {
  name: string;
  setName: (newValue: string) => void;
  alive: boolean;
  setAlive: (newValue: boolean) => void;
  setGameInstance: (game?: Game) => void;
  restart: () => void;
}

const initialState: IGameDbContext = {
  name: '',
  setName: () => {},
  alive: true,
  setAlive: () => {},
  setGameInstance: () => {},
  restart: () => {},
};

const GameDbContext = createContext(initialState);

export const GameDbContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [name, setName] = useStorage('name', '');
  const [alive, setAlive] = useStorage<boolean>('alive', true, (v) =>
    Boolean(v),
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
        alive,
        setAlive,
        setGameInstance: (game) => (gameRef.current = game),
        restart,
      }}
    >
      {children}
    </GameDbContext.Provider>
  );
};

export default GameDbContext;
