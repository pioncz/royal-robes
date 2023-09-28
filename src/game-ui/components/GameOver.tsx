import Box from 'game-ui/basic/Box';
import { styled } from 'game-ui/utils/theme';
import { motion } from 'framer-motion';

const GameOver = () => {
  return (
    <Root
      initial={{
        transform: 'scale3d(0.7, 0.7, 0.7) translateY(-100px)',
        opacity: 0,
      }}
      animate={{
        transform: 'scale3d(1, 1, 1) translateY(0px)',
        opacity: 1,
      }}
      exit={{
        transform: 'scale3d(0.7, 0.7, 0.7) translateY(-100px)',
        opacity: 0,
      }}
    >
      <Title>GAME OVER</Title>
      <Subtitle>Click anywhere to respawn...</Subtitle>
    </Root>
  );
};

const Root = styled(motion(Box), {
  position: 'absolute',
});

const Title = styled('div', {
  fontSize: '$1',
});
const Subtitle = styled('div', {
  fontSize: '$3',
});

export default GameOver;
