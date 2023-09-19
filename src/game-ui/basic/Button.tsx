import React from 'react';
import { styled } from '@stitches/react';

const Button = ({
  onClick,
  children,
}: {
    onClick: () => void,
  children: React.ReactNode,
}) => {
  return (
    <Root
      onClick={onClick}
    >{children}</Root>
  )
};

const Root = styled('button', {
  border: '1px solid #000',
  padding: '8px 12px',
  fontFamily: 'inherit',
  fontSize: 18,
  background: 'rgb(117 134 192)',
  textTransform: 'uppercase',
  boxShadow: 'inset 3px 3px 0px rgba(255, 255, 255, 0.233), inset -3px -3px 0px rgba(0, 0, 0, 0.233)',
  
  '&:hover': {
    background: 'rgb(129 149 214)',
  },
  '&:active': {
    boxShadow: 'inset 3px 3px 0px rgba(0, 0, 0, 0.233), inset -3px -3px 0px rgba(255, 255, 255, 0.233)',
    background: 'rgb(89 104 152)',
  }
});

export default Button;