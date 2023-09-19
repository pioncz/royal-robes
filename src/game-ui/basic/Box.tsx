import { styled } from '@stitches/react';
import React from 'react';

const Box = (
  {
    children,
    className,
    style,
    flexDirection = 'column',
    justifyContent = 'center',
    alignItems = 'center',
    gap = 0,
    onClick,
  }: {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    flexDirection?: 'column' | 'row';
    justifyContent?: 'center';
    alignItems?: 'center';
    gap?: number;
    onClick?: () => void;
  },
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  return (
    <Root
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        flexDirection,
        justifyContent,
        alignItems,
        gap,
        ...style,
      }}
    >
      {children}
    </Root>
  );
};

const Root = styled('div', {
  display: 'flex',
});

export default React.forwardRef(Box);
