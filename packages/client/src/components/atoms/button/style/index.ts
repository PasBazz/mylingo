import { styled } from '../../../../themes';
import { IButtonProps } from '../IButtonProps';
import { availableSize } from './availableSize';
import { availableVariant } from './availableVariant';
import { disabled } from './disabled';

export const StyledButton = styled('button')<IButtonProps>`
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: ${(props) => `${props.height}px`};
  width: ${(props) => (props.fullWidth ? '100%' : `${props.width}px`)};
  ${(props) => availableSize[props.size || 'medium']}
  ${(props) => availableVariant[props.variant || 'text']}

  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
  outline: none;

  line-height: inherit;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;

  overflow: hidden;
  vertical-align: middle;
  user-select: none;
  box-sizing: border-box;

  &:active {
    outline: none;
  }

  &:hover {
    cursor: pointer;
  }

  ${(props) => props.disabled && disabled}
`;
