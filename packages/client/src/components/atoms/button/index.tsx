import React from 'react';
import { IButtonProps } from './IButtonProps';
import { StyledButton } from './style';

export const Button: React.SFC<IButtonProps> = (props: IButtonProps) => <StyledButton {...props} />;
