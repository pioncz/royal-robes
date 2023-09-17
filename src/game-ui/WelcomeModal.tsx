import React, { useState } from 'react';
import Modal from './components/Modal';
import Input from './components/Input';
import Button from './components/Button';
import { styled } from '@stitches/react';

const WelcomeModal = () => {
  const [name, setName] = useState('');

  return (
    <Modal
      title="Welcome new player!"
      content={
        <Content>
          <div>To join world full of magic and quests you need to choose your name first.</div>
          <Input
            onChange={(newName) => setName(newName)}
            value={name}
            placeholder="New name"
          />
          <Button onClick={() => {}}>Wybierz</Button>
        </Content>
      }
  />
  )
};

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 20,
  flex: 1,
});

export default WelcomeModal;