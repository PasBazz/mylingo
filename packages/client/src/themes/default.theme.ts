import * as styledComponents from 'styled-components';

import { defaultShadows } from './common/shadow';
import { ITheme } from './ITheme';

const { default: styled, css, keyframes, ThemeProvider, withTheme } = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>;

export const theme: ITheme = {
  palette: {
    colors: {
      disabled: '#E8E8E8',
      primary: '#1d2637',
      secondary: '#feaa0a',
    },
    text: {
      colors: {
        disabled: '#708090',
        primary: '#ffffff',
        // primary: '#4c5870',
        secondary: '#9db0c8',
      },
    },
  },
  shadows: defaultShadows,
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  },
};

function fontPixelToRem(pixel: number): number {
  return pixel / theme.typography.fontSize;
}

function colorHexToRGBA(hex: string, alpha: number): string {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const utils = {
  colorHexToRGBA,
  fontPixelToRem,
};

export { styled, css, keyframes, ThemeProvider, withTheme, utils };
