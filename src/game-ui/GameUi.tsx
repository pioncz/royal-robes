import { useContext, useState } from 'react';
import WelcomeModal from './components/WelcomeModal';
import GameOver from './components/GameOver';
import Dock from './components/Dock';
import StatisticsModal from './components/StatisticsModal';
import QuestLogModal from './components/QuestLogModal';
import Profile from './components/Profile';
import { styled } from 'game-ui/utils/theme';
import { AnimatePresence } from 'framer-motion';
import GameDbContext from './contexts/GameDbContext';

const GameUi = () => {
  const { name, statistics, restart, avatar } =
    useContext(GameDbContext);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [questLogOpen, setQuestLogOpen] = useState(false);

  const gameOverVisible = !statistics.alive;
  const welcomeModalOpen = !name;

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
      <Profile
        avatarUrl={avatar}
        name={name}
        level={statistics.level}
        experience={statistics.experience}
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
