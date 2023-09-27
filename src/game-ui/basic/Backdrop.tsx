import { styled } from '@stitches/react';
import { motion } from 'framer-motion';

const Backdrop = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Root
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    />
  );
};

const Root = styled(motion.div, {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: '$backdrop',
});

export default Backdrop;
