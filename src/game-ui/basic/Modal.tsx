import React from 'react';
import { styled } from 'game-ui/utils/theme';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';

const Modal = ({
  title,
  content,
  onClick,
  onClose,
  className,
}: {
  title: string;
  content: React.ReactNode;
  onClick?: () => void;
  onClose?: () => void;
  className?: string;
}) => {
  return (
    <>
      <Backdrop key="backdrop" onClick={onClose} />
      <Root
        onClick={onClick}
        initial={{
          transform: 'scale3d(0.7, 0.7, 0.7) translateY(100px)',
          opacity: 0,
        }}
        animate={{
          transform: 'scale3d(1, 1, 1) translateY(0px)',
          opacity: 1,
        }}
        exit={{
          transform: 'scale3d(0.7, 0.7, 0.7) translateY(100px)',
          opacity: 0,
        }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <Title className="modal-title">{title}</Title>
        <Content className="modal-content">{content}</Content>
      </Root>
    </>
  );
};

const Root = styled(motion.div, {
  position: 'absolute',
  width: 500,
  height: 300,
  background: '$purple500',
  textAlign: 'center',
  border: '4px solid $border',
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled('div', {
  background: '$purple700',
  fontSize: '$3',
  borderBottom: '2px solid $border',
  flex: 0,
});

const Content = styled('div', {
  padding: '$4 $2',
  fontSize: '$4',
  flex: 1,
});

export default Modal;
