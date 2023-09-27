import { styled } from 'game-ui/utils/theme';
import AvatarUrl from '/avatar.png';

const Avatar = () => {
  const x = 1;

  return (
    <Root>
      <Content />
    </Root>
  );
};

const Root = styled('div', {
  position: 'absolute',
  left: 30,
  bottom: 30,
  background: 'linear-gradient(180deg, $purple300, $purple500)',
  padding: 4,
  boxShadow: '$boxShadows$thin3d',
});

const Content = styled('div', {
  background: `url(${AvatarUrl}), $purple500`,

  width: 120,
  height: 120,
});

export default Avatar;
