import React from 'react';
import { styled } from '@stitches/react';
import { motion } from "framer-motion";

const Backdrop = () => {
  return (
    <Root initial={{ opacity: 0}} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
  )
};

const Root = styled(motion.div, {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.7)'
});

export default Backdrop;