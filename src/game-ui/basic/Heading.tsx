import { styled } from '@stitches/react';
import React from 'react';

const Heading = ({ level = 1, children}: { level?: number, children: React.ReactNode }) => {
  return (
    <Root className={`level-${level}`}>{children}</Root>
  )
};

const Root = styled('span', {
  '&.level-1': {
    fontSize: 80,
  },
  '&.level-2': {
    fontSize: 64,
  },
  '&.level-3': {
    fontSize: 50,
  },
  '&.level-4': {
    fontSize: 32,
  },
});

export default Heading;