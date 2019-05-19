import React from 'react';
import styled from 'styled-components';
import { Memo } from 'types/common';
import MemoCard from './MemoCard';

const ListWrapper = styled.div`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

type Props = {
    memos: Memo[];
    subscribeToMore(): void;
};

class MemoList extends React.Component<Props> {
    componentDidMount() {
        this.props.subscribeToMore();
    }
    render() {
        const { memos } = this.props;
        return (
            <ListWrapper>
                {memos.map((memo: any) => (
                    <MemoCard
                        key={memo._id}
                        _id={memo._id}
                        content={memo.content}
                        writer={memo.writer}
                        createdAt={memo.createdAt}
                        updatedAt={memo.updatedAt}
                    />
                ))}
            </ListWrapper>
        );
    }
}

export default MemoList;
