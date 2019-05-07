import React from 'react';
import styled from 'styled-components';
import { Children } from 'types/common';
import HeaderContainer from 'containers/HeaderContainer';

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
            <HeaderContainer />
            <Main>{children}</Main>
        </div>
    );
};

export default Structure;
