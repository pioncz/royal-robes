import Modal from '../basic/Modal';
import Button from '../basic/Button';
import { styled } from '@stitches/react';

const QuestLogModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <StyledModal
      title="Quest Log"
      content={
        <>
          <div>Here you will find all your quests.</div>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    />
  );
};

const StyledModal = styled(Modal, {
  width: 300,

  '& .modal-content': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default QuestLogModal;
