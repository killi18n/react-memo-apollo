import React, { useState, useEffect } from 'react';
import { Query, withApollo, Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import throttle from 'lodash/throttle';
import MemoList from 'components/memo/MemoList';
import MemoCard from 'components/memo/MemoCard';
import { GraphqlData, Memo } from 'types/common';
import { getScrollBottom } from 'lib/common';

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

const MEMO_SUBSCRIPTION = gql`
    subscription OnMemoCreated {
        memoCreated {
            _id
            content
            writer
            createdAt
            updatedAt
        }
    }
`;

type Props = {
    client: any;
};

const MemoListContainer = ({ client }: Props) => {
    const [memos, setMemos] = useState([] as Memo[]);
    const [isLastPage, setLastPage] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const onScroll = throttle(() => {
        const scrollBottom = getScrollBottom();
        if (scrollBottom > 100 || isLastPage) return;
        setPage(page + 1);
        client.query({
            query: gql`
                query Memos($page: Int!, $limit: Int!) {
                    memos(page: $page, limit: $limit) {
                        _id
                        content
                        writer
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: { page, limit },
        });
    }, 100);

    const listenScroll = () => {
        window.addEventListener('scroll', onScroll);
    };

    const unlistenScroll = () => {
        window.removeEventListener('scroll', onScroll);
    };

    useEffect(() => {
        listenScroll();

        return () => {
            unlistenScroll();
        };
    });

    return (
        <Query
            query={MEMOS}
            variables={{ page, limit }}
            onCompleted={(memosPayload: any) => {
                if (memosPayload.memos.length === 0) {
                    setLastPage(true);
                    return;
                }

                setMemos([...memos, ...memosPayload.memos]);
            }}
        >
            {({ subscribeToMore, data, error, loading }: GraphqlData) => {
                // if (loading) return null;
                return (
                    <>
                        <MemoList
                            memos={memos}
                            subscribeToMore={() => {
                                subscribeToMore({
                                    document: MEMO_SUBSCRIPTION,
                                    variables: {},
                                    updateQuery: (
                                        prev: any,
                                        { subscriptionData }: any
                                    ) => {
                                        setMemos([
                                            subscriptionData.data.memoCreated,
                                            ...prev.memos,
                                        ]);
                                        // return Object.assign({}, prev, {
                                        //     memos: [
                                        //         subscriptionData.data
                                        //             .memoCreated,
                                        //         ...prev.memos,
                                        //     ],
                                        // });
                                    },
                                });
                            }}
                        />
                    </>
                );
            }}
        </Query>
    );
};

export default withApollo(MemoListContainer);
