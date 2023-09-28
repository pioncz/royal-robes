import Box from 'game-ui/basic/Box';
import { styled } from 'game-ui/utils/theme';

const Profile = ({
  avatarUrl,
  name,
  level,
}: {
  avatarUrl: string;
  name: string;
  level: number;
}) => {
  return (
    <Root>
      <ContentWrapper>
        <Content>
          <Name>{name}</Name>
          <Box>
            <div>Level</div>
            <div>{level}</div>
          </Box>
        </Content>
      </ContentWrapper>
      <AvatarWrapper>
        <Avatar
          css={{ background: `url(${avatarUrl}), $purple500` }}
        />
      </AvatarWrapper>
    </Root>
  );
};

const Root = styled('div', {
  position: 'absolute',
  left: '$5',
  bottom: '$5',
});

const ContentWrapper = styled('div', {
  position: 'absolute',
  bottom: 60,
  left: 125,
  background: 'linear-gradient(180deg, $purple300, $purple450)',
  padding: '$1',
  boxShadow: '$boxShadows$thin3d',
});

const Content = styled('div', {
  background: '$purple450',
  width: 120,
  padding: '0 $1',
});

const Name = styled('div', {
  fontSize: '$3',
  lineHeight: '1em',
});

const AvatarWrapper = styled('div', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  background: 'linear-gradient(180deg, $purple300, $purple450)',
  padding: '$1',
  boxShadow: '$boxShadows$thin3d',
});

const Avatar = styled('div', {
  width: 120,
  height: 120,
});

export default Profile;
