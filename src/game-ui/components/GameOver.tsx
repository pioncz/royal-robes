import Heading from 'game-ui/basic/Heading';
import Box from 'game-ui/basic/Box';
import { styled } from '@stitches/react';
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
      <Heading>GAME OVER</Heading>
      <Heading level={4}>Click anywhere to respawn...</Heading>
    </Root>
  );
};

const Root = styled(motion(Box), {
  position: 'absolute',
});

export default GameOver;
