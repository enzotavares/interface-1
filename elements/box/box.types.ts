import { SystemStyleObject } from '@styled-system/css';
import { CSSProperties, HTMLAttributes } from 'react';
import {
  BackgroundProps,
  BorderProps,
  BoxShadowProps,
  ColorProps,
  FlexboxProps,
  GridProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
} from 'styled-system';

import { MaybeArray } from '@/interface';

export interface BoxProps
  extends FlexboxProps,
    GridProps,
    LayoutProps,
    PositionProps,
    TypographyProps,
    ColorProps,
    BackgroundProps,
    BoxShadowProps,
    BorderProps,
    SpaceProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  effect?: 'hover';
  hover?: SystemStyleObject;
  active?: SystemStyleObject;
  as?: keyof JSX.IntrinsicElements;
  rowGap?: MaybeArray<CSSProperties['gap']>;
  cursor?: MaybeArray<CSSProperties['cursor']>;
  filter?: MaybeArray<CSSProperties['filter']>;
  columnGap?: MaybeArray<CSSProperties['gap']>;
  clipPath?: MaybeArray<CSSProperties['clipPath']>;
  objectFit?: MaybeArray<CSSProperties['objectFit']>;
  transform?: MaybeArray<CSSProperties['transform']>;
  whiteSpace?: MaybeArray<CSSProperties['whiteSpace']>;
  transition?: MaybeArray<CSSProperties['transition']>;
  backdropFilter?: MaybeArray<CSSProperties['filter']>;
  borderSpacing?: MaybeArray<CSSProperties['borderSpacing']>;
  pointerEvents?: MaybeArray<CSSProperties['pointerEvents']>;
  borderCollapse?: MaybeArray<CSSProperties['borderCollapse']>;
}
