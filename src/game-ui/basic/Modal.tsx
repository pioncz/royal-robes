import React from 'react';
import { styled } from '@stitches/react';
import { motion } from "framer-motion";

const Modal = ({ title, content, onClick }: { title: string, content: React.ReactNode, onClick?: () => void }) => {
  return (
    <Root
      onClick={onClick}
      initial={{ transform: 'scale3d(0.7, 0.7, 0.7) translateY(100px)', opacity: 0 }}
      animate={{ transform: 'scale3d(1, 1, 1) translateY(0px)', opacity: 1 }}
      exit={{ transform: 'scale3d(0.7, 0.7, 0.7) translateY(100px)', opacity: 0 }}
      transition={{  duration: 0.2 }}
    >
      <Title>{title}</Title>
      <Content>{content}</Content>
    </Root>
  )
};

const Root = styled(motion.div, {
  position: 'absolute',
  width: 500,
  height: 300,
  background: 'rgb(36 41 58)',
  textAlign: 'center',
  border: '4px solid #ffffff22',
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled('div', {
  background: '#151822',
  fontSize: 32,
  borderBottom: '2px solid #ffffff22',
  flex: 0,
});

const Content = styled('div', {
  padding: '20px 10px',
  fontSize: 22,
  flex: 1,
});

export default Modal;