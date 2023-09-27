import { styled } from 'game-ui/utils/theme';

const Input = ({
  onChange,
  value,
  placeholder,
}: {
  onChange: (newValue: string) => void;
  value: string;
  placeholder: string;
}) => {
  return (
    <Root
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const Root = styled('input', {
  border: '2px solid rgba(255, 255, 255, 0.133)',
  background: '$purple450',
  padding: '8px 12px',
  fontFamily: 'inherit',
  fontSize: 18,
  outline: 'none',

  '&:hover': {
    background: '$purple300',
  },

  '&:focus, &:focus-visible': {
    border: '2px solid rgba(255, 255, 255, 0.133) !important',
    borderRadius: '0px',
  },

  '&::placeholder': {
    color: 'rgba(255,255, 255, 0.4)',
  },
});

export default Input;
