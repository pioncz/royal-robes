import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      purple200: 'rgb(129 149 214)',
      purple300: 'rgb(117, 134, 192)',
      purple400: 'rgb(89 104 152)',
      purple450: 'rgb(75 88 131)',
      purple500: 'rgb(36, 41, 58)',
      purple700: 'rgb(21 24 34)',
      backdrop: 'rgba(0,0,0,0.7)',
      border: 'rgb(255 255 255 / 13%)',
    },
    space: {
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '30px',
    },
    fontSizes: {},
    lineHeights: {},
    sizes: {},
    boxShadows: {
      thin3d:
        'inset 2px 2px 0px rgba(255, 255, 255, 0.233), inset -2px -2px 0px rgba(0, 0, 0, 0.233)',
      thin3dInverted:
        'inset 2px 2px 0px rgba(0, 0, 0, 0.233), inset -2px -2px 0px rgba(255, 255, 255, 0.233)',
      thick3d:
        'inset 3px 3px 0px rgba(255, 255, 255, 0.233), inset -3px -3px 0px rgba(0, 0, 0, 0.233)',
      thick3dInverted:
        'inset 3px 3px 0px rgba(0, 0, 0, 0.233), inset -3px -3px 0px rgba(255, 255, 255, 0.233)',
    },
    zIndices: {},
    transitions: {},
  },
});
