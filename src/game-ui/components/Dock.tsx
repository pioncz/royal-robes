import Button from 'game-ui/basic/Button';
import Box from 'game-ui/basic/Box';
import { styled } from '@stitches/react';

const Dock = ({
  onStatisticsClick,
  onQuestLogClick,
}: {
  onStatisticsClick: () => void;
  onQuestLogClick: () => void;
}) => {
  return (
    <Root flexDirection="row">
      <Button onClick={onStatisticsClick}>Statistics</Button>
      <Button onClick={onQuestLogClick}>Quest log</Button>
    </Root>
  );
};

const Root = styled(Box, {
  position: 'absolute',
  bottom: 40,
  left: '50%',
  transform: 'translateX(-50%)',
});

export default Dock;
