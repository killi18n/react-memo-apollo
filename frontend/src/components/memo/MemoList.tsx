import React from 'react';
import styled from 'styled-components';

const ListWrapper = styled.div`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

type Props = {
    children: any;
};

const MemoList = ({ children }: Props) => {
    return <ListWrapper>{children}</ListWrapper>;
};

export default MemoList;
