import React from 'react';
import { styled } from '@stitches/react';
import { motion } from "framer-motion";
import BackgroundUrl from 'assets/background.jpg'

const Background = () => {
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
  background: `url(${BackgroundUrl}) center`,
  backgroundSize: 'cover',
});

export default Background;