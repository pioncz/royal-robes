import { useContext, useState } from 'react';
import WelcomeModal from './WelcomeModal'
import Backdrop from './components/Backdrop'
import Background from './components/Background'
import { styled } from '@stitches/react';
import { AnimatePresence } from "framer-motion"
import GameDbContext from './contexts/GameDbContext';

const GameUi = () => {
  const { name } = useContext(GameDbContext);

  const welcomeModalOpen = !name;
  const anyModalOpen = welcomeModalOpen;

  return (
    <Root>
      <AnimatePresence>
        {welcomeModalOpen && <Background key="background" />}
        {anyModalOpen && <Backdrop key="backdrop" />}
        {welcomeModalOpen &&
          <WelcomeModal key="welcomeModal" />
        }
      </AnimatePresence>
    </Root>
  )
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