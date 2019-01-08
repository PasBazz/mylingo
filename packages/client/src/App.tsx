import * as React from 'react';
import { hot } from 'react-hot-loader';

import ReactLogo from './components/ReactLogo';
import { GlobalStyle } from './themes';
import { styled } from './themes/';

const Container = styled.div`
  background-color: ${(props) => props.theme.palette.colors.primary};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: ${(props) => props.theme.palette.text.colors.primary};
  text-align: center;
`;

class App extends React.Component {
  public render() {
    return (
      <div>
        <GlobalStyle />
        <Container>
          <ReactLogo />
          <Title>Progressive Web App with React</Title>
        </Container>
      </div>
    );
  }
}

export default hot(module)(App);
