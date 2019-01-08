import { ButtonSize, ButtonVariant } from './types';

export interface IButtonProps {
  height?: number;
  width?: number;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: ButtonVariant;
}
