import * as styledComponents from 'styled-components';
import { ITheme } from './ITheme';

const { default: styled, css, keyframes, ThemeProvider } = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>;

export const theme: ITheme = {
  colors: {
    primary: '#34465d',
    secondary: '#9db0c8',
  },
  text: {
    colors: {
      primary: '#dee5ed',
      secondary: '#9db0c8',
    },
  },
};

export { styled, css, keyframes, ThemeProvider };
