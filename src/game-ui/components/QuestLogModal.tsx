import Modal from '../basic/Modal';
import Button from '../basic/Button';
import { styled } from 'game-ui/utils/theme';

const QuestLogModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <StyledModal
      title="Quest Log"
      onClose={onClose}
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
