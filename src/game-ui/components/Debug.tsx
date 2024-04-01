import { styled } from '@stitches/react';
import React, { useEffect } from 'react';

const Component = () => {
  const debug = window.localStorage.getItem('debug') === 'true';

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      console.log(e.key);
      if (e.key === '`') {
        window.localStorage.setItem('debug', (!debug).toString());
        window.location.reload();
      }
    });
  }, []);

  return (
    <>
      
        <Root debug={debug}>
          Debug {debug ? 'ON' : 'OFF'}
        </Root>
    </>
  )
};

const Root = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '0px 4px',
  lineHeight: '16px',
  textTransform: 'uppercase',
  fontFamily: 'monospace',
  borderBottomRightRadius: '1px',
  color: '#fff',
  background: '#000',
  opacity: 0.2,

  variants: {
    debug: {
      true: {
        borderRight: '1px solid #26c313',
        borderBottom: '1px solid #26c313',
        background: '#020c00',
        opacity: 1,
      },
    }
  }
});

export default Component;