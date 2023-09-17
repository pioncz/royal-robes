import GameComponent from './game/GameComponent'
import GameUi from './game-ui/GameUi'
import { useContext } from 'react';
import GameDbContext from 'game-ui/contexts/GameDbContext';

const App = () => {
  const { name } = useContext(GameDbContext);
  
  return (
    <>
      {!!name && <GameComponent />}
      <GameUi />
    </>)
}

  export default App;
