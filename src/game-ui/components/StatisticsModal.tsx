import { useContext } from 'react';
import Modal from '../basic/Modal';
import Button from '../basic/Button';
import Box from '../basic/Box';
import { styled } from '@stitches/react';
import GameDbContext from '../contexts/GameDbContext';

const StatisticsModal = ({ onClose }: { onClose: () => void }) => {
  const { name, statistics } = useContext(GameDbContext);

  const stats = [
    {
      name: 'Name',
      value: name,
    },
    {
      name: 'Health',
      value: statistics.health,
    },
    {
      name: 'Experience',
      value: statistics.experience,
    },
    {
      name: 'Gold',
      value: statistics.gold,
    },
  ];

  return (
    <StyledModal
      title="Statistics"
      content={
        <>
          <Box>
            {stats.map(({ name, value }) => (
              <Box flexDirection="row" key={name} gap={20}>
                <div>{name}</div>
                <div>-</div>
                <div>{value}</div>
              </Box>
            ))}
          </Box>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    />
  );
};

const StyledModal = styled(Modal, {
  width: 300,

  '& .modal-content': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default StatisticsModal;
