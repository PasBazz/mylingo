import { boolean, number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Button } from '.';
import { ButtonSize, ButtonVariant } from './types';

storiesOf('Button', module)
  .add('default', () => <Button>content</Button>)
  .add('with fullWidth', () => <Button fullWidth={boolean('fullWidth', true)}>content</Button>)
  .add('with width', () => <Button width={number('width', 150)}>content</Button>)
  .add('with height', () => <Button height={number('height', 36)}>content</Button>)
  .add('with size', () => <Button size={text('size', 'small') as ButtonSize}>content</Button>)
  .add('with variant', () => <Button variant={text('variant', 'text') as ButtonVariant}>content</Button>)
  .add('with disabled', () => <Button disabled={boolean('disabled', true)}>content</Button>)
  .add('with full settings', () => (
    <Button
      width={number('width', 150)}
      height={number('height', 36)}
      size={text('size', 'medium') as ButtonSize}
      variant={text('variant', 'text') as ButtonVariant}
      fullWidth={boolean('fullWidth', false)}
      disabled={boolean('disabled', false)}>
      content
    </Button>
  ));
