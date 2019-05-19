import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import MemoList from 'components/memo/MemoList';
import MemoCard from 'components/memo/MemoCard';
import { GraphqlData } from 'types/common';

const MEMOS = gql`
    query Memos($page: Int!, $limit: Int!) {
        memos(page: $page, limit: $limit) {
            _id
            content
            writer
            createdAt
            updatedAt
        }
    }
`;

type State = {
    page: number;
    limit: number;
};

const MemoListContainer = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    return (
        <Query query={MEMOS} variables={{ page, limit }}>
            {({ data, error, loading }: GraphqlData) => {
                console.log(data);
                if (!data.memos || data.memos.length === 0) return null;
                return (
                    <MemoList>
                        {data.memos.map((memo: any) => (
                            <MemoCard
                                key={memo._id}
                                _id={memo._id}
                                content={memo.content}
                                writer={memo.writer}
                                createdAt={memo.createdAt}
                                updatedAt={memo.updatedAt}
                            />
                        ))}
                    </MemoList>
                );
            }}
        </Query>
    );
};

export default MemoListContainer;
