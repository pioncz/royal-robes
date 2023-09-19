import { useContext, useState } from 'react';
import WelcomeModal from './components/WelcomeModal';
import Backdrop from './basic/Backdrop';
import Background from './components/Background';
import GameOver from './components/GameOver';
import { styled } from '@stitches/react';
import { AnimatePresence } from 'framer-motion';
import GameDbContext from './contexts/GameDbContext';

const GameUi = () => {
  const { name, alive, restart } = useContext(GameDbContext);

  const gameOverVisible = !alive;
  const welcomeModalOpen = !name;
  const backdropVisible = welcomeModalOpen || gameOverVisible;

  const handleClick = () => {
    if (!alive) {
      restart();
    }
  };

  return (
    <Root onClick={handleClick}>
      <AnimatePresence>
        {welcomeModalOpen && <Background key="background" />}
        {backdropVisible && <Backdrop key="backdrop" />}
        {welcomeModalOpen && <WelcomeModal key="welcomeModal" />}
        {gameOverVisible && <GameOver />}
      </AnimatePresence>
    </Root>
  );
};

const Root = styled('div', {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export default GameUi;
