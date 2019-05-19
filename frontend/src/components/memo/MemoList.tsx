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

type State = {
    memos: Memo[];
};

class MemoList extends React.Component<Props, State> {
    state = {
        memos: [],
    };
    componentDidMount() {
        this.props.subscribeToMore();
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.memos !== this.props.memos) {
            console.log(this.props.memos[0]);
            if (
                this.props.memos.length === 1 &&
                this.props.memos[0].isSubscribed
            ) {
                this.setState({
                    ...this.state,
                    memos: [this.props.memos[0], ...this.state.memos],
                });
                return;
            }
            if (this.state.memos.length > 0) {
                this.setState({
                    ...this.state,
                    memos: [...this.state.memos, ...this.props.memos],
                });
                return;
            }
            this.setState({
                ...this.state,
                memos: this.props.memos,
            });
        }
    }

    render() {
        const { memos } = this.state;
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
