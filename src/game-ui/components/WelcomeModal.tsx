import { useContext, useState } from 'react';
import Modal from '../basic/Modal';
import Input from '../basic/Input';
import Button from '../basic/Button';
import { styled } from 'game-ui/utils/theme';
import GameDbContext from '../contexts/GameDbContext';
import Background from './Background';

const WelcomeModal = () => {
  const { name, setName } = useContext(GameDbContext);
  const [tempName, setTempName] = useState(name);

  const handleSubmitClick = () => {
    setName(tempName);
  };

  return (
    <>
      <Background key="background" />
      <Modal
        title="Welcome new player!"
        content={
          <Content>
            <div>
              To join world full of magic and quests you need to
              choose your name first.
            </div>
            <Input
              onChange={(newName) => setTempName(newName)}
              value={tempName}
              placeholder="New name"
            />
            <Button onClick={handleSubmitClick}>Wybierz</Button>
          </Content>
        }
      />
    </>
  );
};

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$4',
  flex: 1,
});

export default WelcomeModal;
