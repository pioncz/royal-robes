import { useContext } from 'react';
import Modal from '../basic/Modal';
import Button from '../basic/Button';
import Box from '../basic/Box';
import { styled } from '@stitches/react';
import GameDbContext from '../contexts/GameDbContext';
import Equipment from './Equipment';
import ItemsGrid from './ItemsGrid';
import capitalize from 'lodash/capitalize';

const StatisticsModal = ({ onClose }: { onClose: () => void }) => {
  const { name, statistics } = useContext(GameDbContext);
  const { alive, ...visibleStatistics } = statistics; // eslint-disable-line

  const stats = Object.entries(visibleStatistics).map(
    ([stat, value]) => ({
      stat: capitalize(stat),
      value,
    }),
  );

  return (
    <StyledModal
      title="Statistics"
      onClose={onClose}
      content={
        <>
          <SectionWrapper flexDirection="row" alignItems="stretch">
            <StatsSection
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <div>{name}</div>
              {stats.map(({ stat, value }) => (
                <Box
                  flexDirection="row"
                  key={stat}
                  gap={20}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Statistic>{stat}</Statistic>
                  <Statistic>{value}</Statistic>
                </Box>
              ))}
            </StatsSection>
            <Section>
              <Equipment />
            </Section>
            <ItemGridSection>
              <ItemsGrid />
            </ItemGridSection>
          </SectionWrapper>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    />
  );
};

const StyledModal = styled(Modal, {
  width: 600,
  height: 'auto',

  '& .modal-content': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    padding: '0 0 10px',
  },
});

const SectionWrapper = styled(Box, {
  width: '100%',
  borderBottom: '1px solid #ffffff22',
});

const Section = styled(Box, {
  padding: '10px',

  '&:nth-child(n+2)': {
    borderLeft: '1px solid #ffffff22',
  },
});

const StatsSection = styled(Section, {
  paddingTop: 5,
});

const Statistic = styled('div', {
  fontSize: 16,
  lineHeight: '18px',
});

const ItemGridSection = styled(Section, {
  flex: 1,
});

export default StatisticsModal;
