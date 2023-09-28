import React from 'react';
import { styled } from 'game-ui/utils/theme';

const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return <Root onClick={onClick}>{children}</Root>;
};

const Root = styled('button', {
  border: '1px solid #000',
  padding: '$1 $2',
  fontFamily: 'inherit',
  fontSize: '$4',
  background: '$purple300',
  textTransform: 'uppercase',
  boxShadow: '$boxShadows$thick3d',

  '&:hover': {
    background: '$purple200',
  },
  '&:active': {
    boxShadow: '$boxShadows$thick3dInverted',
    background: '$purple400',
  },
});

export default Button;
