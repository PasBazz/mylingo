import { IButtonProps } from '../IButtonProps';

import { css, utils } from '../../../../themes';

export const availableVariant = {
  text: css<IButtonProps>`
    background: transparent;
    color: ${({ theme }) => theme.palette.colors.secondary};
    border: none;

    &:hover {
      background: ${({ theme }) => utils.colorHexToRGBA(theme.palette.colors.secondary, 0.1)};
    }
  `,

  raised: css<IButtonProps>`
    background: ${({ theme }) => theme.palette.colors.secondary};
    color: ${({ theme }) => theme.palette.text.colors.primary};
    border: none;

    box-shadow: ${({ theme }) => theme.shadows[0]};

    &:hover,
    &:focus {
      @include ${({ theme }) => theme.shadows[3]};
    }

    &:active {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows[7]};
    }
  `,

  unelevated: css<IButtonProps>`
    background: ${({ theme }) => theme.palette.colors.secondary};
    color: ${({ theme }) => theme.palette.text.colors.primary};
    border: none;

    &:hover {
      background: ${({ theme }) => utils.colorHexToRGBA(theme.palette.colors.secondary, 0.8)};
    }
  `,

  outlined: css<IButtonProps>`
    background: transparent;
    color: ${({ theme }) => theme.palette.colors.secondary};
    border-style: solid;
    border-width: 2px;
    border-color: ${({ theme }) => theme.palette.colors.secondary};

    &:hover {
      background: ${({ theme }) => utils.colorHexToRGBA(theme.palette.colors.secondary, 0.1)};
    }
  `,
};
