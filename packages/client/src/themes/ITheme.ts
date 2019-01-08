export interface ITheme {
  palette: {
    colors: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    text: {
      colors: {
        primary: string;
        secondary: string;
        disabled: string;
      };
    };
  };
  typography: {
    fontSize: number;
    fontFamily: string;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
  };
  shadows: string[];
  shape: {
    borderRadius: number;
  };
}
