import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';

const BoxWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 150px;

    /* border: 1px solid #495057; */
    border-radius: 3px;
    margin-top: 1.5rem;
    max-width: 625px;

    padding: 1rem;
    padding-bottom: 0.25rem;

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    background: #ffffff;

    &:hover {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
    }
`;

const MemoTextArea = styled.textarea`
    outline: none;
    border: 1px solid #e9ecef;
    border-radius: 3px;
    resize: none;
    padding: 0.5rem;
    font-size: 1.25rem;
    height: 75px;
`;

const WriteBox = () => {
    return (
        <BoxWrapper>
            <MemoTextArea />
            <Button
                style={{
                    background: '#7048e8',
                    color: '#ffffff',
                    marginLeft: 'auto',
                    marginTop: '1rem',
                }}
            >
                작성하기
            </Button>
        </BoxWrapper>
    );
};

export default WriteBox;
