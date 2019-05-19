import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
    padding: 1rem;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    & + & {
        margin-top: 1rem;
    }

    &:hover {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
    }

    display: flex;
    flex-direction: column;
`;

const UnderInfo = styled.div`
    margin-top: auto;
    margin-left: auto;
`;

const Writer = styled.div`
    // font-size: 1.25rem;
    font-weight: 600;
`;

const Date = styled.div`
    font-weight: 400;
`;

type Props = {
    _id: string;
    content: string;
    writer: string;
    createdAt: string;
    updatedAt?: string;
};

const MemoCard = ({ _id, content, writer, createdAt, updatedAt }: Props) => {
    return (
        <Card>
            {content}
            <UnderInfo>
                <Writer>{writer}</Writer>
                <Date>{updatedAt ? updatedAt : createdAt}</Date>
            </UnderInfo>
        </Card>
    );
};

export default MemoCard;
