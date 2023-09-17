import React, {
  createContext,
} from 'react';
import { useStorage } from 'game-ui/utils/useStorage';

export interface IGameDbContext {
  name: string;
  setName: (newValue: string) => void;
}

const initialState: IGameDbContext = {
  name: '',
  setName: () => { },
}

const GameDbContext = createContext(initialState);

export const GameDbContextProvider = ({ children }: { children: React.ReactElement }) => {
  const [name, setName] = useStorage('name');


  return (
    <GameDbContext.Provider
      value={{
        name,
        setName,
      }}
    >
      {children}
    </GameDbContext.Provider>
  )
}

export default GameDbContext;
