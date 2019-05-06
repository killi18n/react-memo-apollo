import React from 'react';
import styled from 'styled-components';
import { Children } from 'types/common';

type Props = {
    children: Children;
};

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalWrapper = ({ children }: Props) => {
    return <Wrapper>{children}</Wrapper>;
};

export default ModalWrapper;
