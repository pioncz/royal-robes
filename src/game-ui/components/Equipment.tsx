import Border from 'game-ui/basic/Border';
import { styled } from 'game-ui/utils/theme';
import amuletBg from 'assets/eq/amulet.png';
import armorBg from 'assets/eq/armor.png';
import bagBg from 'assets/eq/bag.png';
import bootsBg from 'assets/eq/boots.png';
import helmetBg from 'assets/eq/helmet.png';
import ringBg from 'assets/eq/ring.png';
import shieldBg from 'assets/eq/shield.png';
import swordBg from 'assets/eq/sword.png';
import legsBg from 'assets/eq/legs.png';

const Equipment = () => {
  const slots = [
    {
      name: 'amulet',
      background: amuletBg,
    },
    {
      name: 'helmet',
      background: helmetBg,
    },
    {
      name: 'bag',
      background: bagBg,
    },
    {
      name: 'weapon',
      background: swordBg,
    },
    {
      name: 'armor',
      background: armorBg,
    },
    {
      name: 'shield',
      background: shieldBg,
    },
    {
      name: 'ringLeft',
      background: ringBg,
    },
    {
      name: 'legs',
      background: legsBg,
    },
    {
      name: 'ringRight',
      background: ringBg,
    },
    {
      name: 'boots',
      background: bootsBg,
    },
  ];

  return (
    <Root>
      {slots.map(({ name, background }) => (
        <Border
          key={name}
          style={{
            backgroundImage: `url(${background})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '60%',
            backgroundPosition: 'center',
            width: 48,
            height: 48,
          }}
        />
      ))}
    </Root>
  );
};

const Root = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '4px',
  width: 48 * 3 + 4 * 2 + 10,
  gridAutoColumns: '33%',
});

export default Equipment;
