import React from 'react';
import styled from 'styled-components';

const NotFoundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(100vw);
    height: calc(100vh);
    background: #f3d9fa;
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 600;
`;

const NotFound = () => {
    return <NotFoundWrapper>NotFound Page. Please Go Back.</NotFoundWrapper>;
};

export default NotFound;
