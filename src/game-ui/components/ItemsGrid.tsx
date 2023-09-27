import Box from '../basic/Box';
import { styled } from 'game-ui/utils/theme';

const ItemsGrid = () => {
  return (
    <Box flexDirection="row" gap={2}>
      <ItemBox />
      <ItemBox />
      <ItemBox />
      <ItemBox />
    </Box>
  );
};

const ItemBox = styled('div', {
  width: 48,
  height: 48,
  background: '$purple450',
  boxShadow: '$boxShadows$thin3d',
  '&:hover': {
    background: '$purple400',
  },

  '&:active': {
    boxShadow: '$boxShadows$thin3dInverted',
  },
});

export default ItemsGrid;
