import { useContext, useState } from 'react';
import WelcomeModal from './components/WelcomeModal';
import GameOver from './components/GameOver';
import Dock from './components/Dock';
import StatisticsModal from './components/StatisticsModal';
import QuestLogModal from './components/QuestLogModal';
import { styled } from '@stitches/react';
import { AnimatePresence } from 'framer-motion';
import GameDbContext from './contexts/GameDbContext';

const GameUi = () => {
  const { name, statistics, restart } = useContext(GameDbContext);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [questLogOpen, setQuestLogOpen] = useState(false);

  const gameOverVisible = !statistics.alive;
  const welcomeModalOpen = !name;
  const backdropVisible =
    welcomeModalOpen ||
    gameOverVisible ||
    statisticsOpen ||
    questLogOpen;

  const handleClick = () => {
    if (!statistics.alive) {
      restart();
    }
  };

  return (
    <Root onClick={handleClick}>
      <Dock
        onStatisticsClick={() => setStatisticsOpen((v) => !v)}
        onQuestLogClick={() => setQuestLogOpen((v) => !v)}
      />
      <AnimatePresence>
        {welcomeModalOpen && <WelcomeModal key="welcomeModal" />}
        {gameOverVisible && <GameOver />}
        {statisticsOpen && (
          <StatisticsModal onClose={() => setStatisticsOpen(false)} />
        )}
        {questLogOpen && (
          <QuestLogModal onClose={() => setQuestLogOpen(false)} />
        )}
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
  pointerEvents: 'none',

  '& *': {
    pointerEvents: 'all',
  },
});

export default GameUi;
