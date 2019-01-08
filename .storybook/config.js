import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import React from 'react';
import { ThemeProvider } from 'styled-components';

import { theme } from '../packages/client/src/themes';

const req = require.context('../packages', true, /.story.tsx?$/);
function loadStories() {
  addDecorator(withKnobs);
  addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);

  req.keys().forEach(req);
}

configure(loadStories, module);
