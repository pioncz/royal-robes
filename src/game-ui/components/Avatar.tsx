import { styled } from '@stitches/react';
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
  background:
    'linear-gradient(180deg, rgb(117, 134, 192), rgb(36, 41, 58))',
  padding: 4,
  boxShadow:
    'inset 2px 2px 0px rgba(255, 255, 255, 0.233), inset -2px -2px 0px rgba(0, 0, 0, 0.233)',
});

const Content = styled('div', {
  background: `url(${AvatarUrl}), rgb(36, 41, 58)`,

  width: 120,
  height: 120,
});

export default Avatar;
