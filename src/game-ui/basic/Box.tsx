import { styled } from 'game-ui/utils/theme';
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
    width,
    onClick,
  }: {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    flexDirection?: 'column' | 'row';
    justifyContent?:
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'space-between';
    alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
    gap?: number | string;
    width?: string;
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
        width,
        ...style,
      }}
      css={{
        gap,
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
