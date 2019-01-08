import { IButtonProps } from '../IButtonProps';

import { css, utils } from '../../../../themes';

export const availableSize = {
  small: css<IButtonProps>`
    padding: '4px 8px';
    min-height: 30px;
    font-weight: ${({ theme }) => theme.typography.fontWeightLight};
    font-size: ${utils.fontPixelToRem(13)};
  `,

  medium: css<IButtonProps>`
    padding: '6px 16px';
    min-height: 36px;
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: ${utils.fontPixelToRem(14)};
  `,

  large: css<IButtonProps>`
    padding: '8px 24px';
    min-height: 42px;
    font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
    font-size: ${utils.fontPixelToRem(15)};
  `,
};
