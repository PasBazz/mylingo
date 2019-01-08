import { IButtonProps } from '../IButtonProps';

import { css } from '../../../../themes';

export const disabled = css<IButtonProps>`
  cursor: default;
  pointer-events: none;
  opacity: 0.6;
  box-shadow: none;
  background: ${({ theme }) => theme.palette.colors.disabled};
  color: ${({ theme }) => theme.palette.text.colors.disabled};
`;
