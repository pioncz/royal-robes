import { useContext } from 'react';
import Modal from '../basic/Modal';
import Button from '../basic/Button';
import Box from '../basic/Box';
import { styled } from '@stitches/react';
import GameDbContext from '../contexts/GameDbContext';
import Equipment from './Equipment';

const StatisticsModal = ({ onClose }: { onClose: () => void }) => {
  const { name, statistics } = useContext(GameDbContext);

  const stats = [
    {
      stat: 'Health',
      value: statistics.health,
    },
    {
      stat: 'Experience',
      value: statistics.experience,
    },
    {
      stat: 'Gold',
      value: statistics.gold,
    },
  ];

  return (
    <StyledModal
      title="Statistics"
      content={
        <>
          <Box flexDirection="row">
            <Box>
              <div>
                {name}
              </div>
            {stats.map(({ stat, value }) => (
              <Box flexDirection="row" key={stat} gap={20}>
                <div>{stat}</div>
                <div>-</div>
                <div>{value}</div>
              </Box>
            ))}
            </Box>
            <Equipment />
          </Box>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    />
  );
};

const StyledModal = styled(Modal, {
  width: 600,

  '& .modal-content': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default StatisticsModal;
