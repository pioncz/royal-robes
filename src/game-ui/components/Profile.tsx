import Box from 'game-ui/basic/Box';
import { styled } from 'game-ui/utils/theme';
import { getExperienceForLevel } from 'game/utils/Level';

const LevelProgressWidth = 220;

const Profile = ({
  avatarUrl,
  name,
  level,
  experience,
}: {
  avatarUrl: string;
  name: string;
  level: number;
  experience: number;
}) => {
  const experienceForCurrentLevel = getExperienceForLevel(level);
  const experienceForNextLevel = getExperienceForLevel(level + 1);
  const levelProgress = Math.round(
    ((experience - experienceForCurrentLevel) /
      (experienceForNextLevel - experienceForCurrentLevel)) *
      100,
  );
  return (
    <Root>
      <ContentWrapper>
        <Content>
          <Name>{name}</Name>
          <LevelProgress>
            <LevelProgressIndicator
              css={{ width: `${levelProgress}%` }}
            />
          </LevelProgress>
          <LevelRow
            flexDirection="row"
            justifyContent="space-between"
          >
            <div>Level</div>
            <div>{level}</div>
          </LevelRow>
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
  bottom: 35,
  left: 125,
  background: 'linear-gradient(180deg, $purple300, $purple450)',
  padding: '$1',
  boxShadow: '$boxShadows$thin3d',
});

const Content = styled('div', {
  background: '$purple450',
  width: LevelProgressWidth,
});

const Name = styled('div', {
  fontSize: '$3',
  lineHeight: '1em',
  padding: '0 $1',
});

const LevelProgress = styled('div', {
  position: 'relative',
  height: 15,
  width: '100%',
  background: '#312d00',
});

const LevelProgressIndicator = styled('div', {
  position: 'absolute',
  height: '100%',
  width: '0%',
  transition: '$1',
  background: `linear-gradient(90deg, rgb(189 193 40), rgb(245 255 207) ${LevelProgressWidth}px)`,
});

const LevelRow = styled(Box, {
  padding: '0 $1',
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
