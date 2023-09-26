import React from 'react';
import Box from '../basic/Box';
import { styled } from '@stitches/react';

const ItemsGrid = () => {
  return (
    <Box flexDirection="row" gap={2}>
      <ItemBox />
      <ItemBox />
      <ItemBox />
      <ItemBox />
    </Box>
  );
};

const ItemBox = styled('div', {
  width: 48,
  height: 48,
  background: '#353D56',
  boxShadow:
    'inset 2px 2px 0px rgba(255, 255, 255, 0.233), inset -2px -2px 0px rgba(0, 0, 0, 0.233)',

  '&:hover': {
    background: '#424D6B',
  },

  '&:active': {
    boxShadow:
      'inset 2px 2px 0px rgba(0, 0, 0, 0.233), inset -2px -2px 0px rgba(255, 255, 255, 0.233)',
  },
});

export default ItemsGrid;
