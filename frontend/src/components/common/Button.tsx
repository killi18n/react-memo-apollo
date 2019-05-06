import React from 'react';
import styled from 'styled-components';
import { Children } from 'types/common';

type Props = {
    children: Children;
};

const ButtonWrapper = styled.div`
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border: 1px solid #ffffff;
    border-radius: 3px;
    cursor: pointer;
`;

const Button = ({ children }: Props) => {
    return <ButtonWrapper>{children}</ButtonWrapper>;
};

export default Button;
