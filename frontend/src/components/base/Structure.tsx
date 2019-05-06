import React from 'react';
import styled from 'styled-components';
import Header from 'components/base/Header';
import { Children } from 'types/common';

type Props = {
    children: Children;
};

const Main = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 625px;
`;

const Structure = ({ children }: Props) => {
    return (
        <div>
            <Header />
            <Main>{children}</Main>
        </div>
    );
};

export default Structure;
