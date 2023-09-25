import React from 'react';
import { styled } from '@stitches/react';
import border1_11 from 'assets/borders/border1-11.png';
import border1_12 from 'assets/borders/border1-12.png';
import border1_13 from 'assets/borders/border1-13.png';
import border1_21 from 'assets/borders/border1-21.png';
import border1_23 from 'assets/borders/border1-23.png';
import border1_31 from 'assets/borders/border1-31.png';
import border1_32 from 'assets/borders/border1-32.png';
import border1_33 from 'assets/borders/border1-33.png';

const variants = {
  primary: {
    background: 'rgb(234 212 170)',
  }
};

const Border = ({ style, children, className, size = 'small' }: { className?: string, children?: React.ReactNode, size?: 'small' | 'large', style?: React.CSSProperties }) => {
  return (
    <Root className={className} style={style}>
      <FrameTop size={size} />
      <FrameLeft size={size} />
      <FrameRight size={size} />
      <FrameBottom size={size} />
      <Corner11 size={size} />
      <Corner12 size={size} />
      <Corner13 size={size} />
      <Corner14 size={size} />
      <Content>{children}</Content>
    </Root>
  )
};

const Root = styled('span', {
  position: 'relative',
  background: variants.primary.background,
});

const Frame = styled('span', {
  position: 'absolute',

  variants: {
    size: {
      small: {
        width: 16,
        height: 16,
      },
      large: {
        width: 32,
        height: 32,
      }
    }
  }
});

const FrameTop = styled(Frame, {
  top: 0,
  left: 0,
  width: '100% !important',
  background: `url(${border1_12})`,
  backgroundSize: 'contain'
});

const FrameLeft = styled(Frame, {
  top: 0,
  left: 0,
  height: '100% !important',
  background: `url(${border1_21})`,
  backgroundSize: 'contain'
});

const FrameRight = styled(Frame, {
  top: 0,
  right: 0,
  height: '100% !important',
  background: `url(${border1_23})`,
  backgroundSize: 'contain'
});

const FrameBottom = styled(Frame, {
  bottom: 0,
  left: 0,
  width: '100% !important',
  background: `url(${border1_32})`,
  backgroundSize: 'contain'
});

const Corner = styled('span', {
  position: 'absolute',

  variants: {
    size: {
      small: {
        width: 16,
        height: 16,
      },
      large: {
        width: 32,
        height: 32,
      }
    }
  }
});

const Corner11 = styled(Corner, {
  top: 0,
  left: 0,
  background: `url(${border1_11})`,
  backgroundSize: 'cover'
});

const Corner12 = styled(Corner, {
  top: 0,
  right: 0,
  background: `url(${border1_13})`,
  backgroundSize: 'cover'
});

const Corner13 = styled(Corner, {
  bottom: 0,
  left: 0,
  background: `url(${border1_31})`,
  backgroundSize: 'cover'
});

const Corner14 = styled(Corner, {
  bottom: 0,
  right: 0,
  background: `url(${border1_33})`,
  backgroundSize: 'cover'
});

const Content = styled('div', {
  position: 'relative'
});

export default Border;