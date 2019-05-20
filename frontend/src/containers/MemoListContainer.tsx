import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import throttle from 'lodash/throttle';
import { bindActionCreators } from 'redux';
import { actions as memoActions } from '../store/modules/memo';
import MemoList from '../components/memo/MemoList';
import { GraphqlData } from '../types/common';
import { getScrollBottom } from '../lib/common';
import { State } from '../store/modules';

const MEMOS = gql`
    query Memos($limit: Int!, $cursor: String) {
        memos(limit: $limit, cursor: $cursor) {
            memos {
                _id
                content
                writer
                createdAt
                updatedAt
            }
            lastPage
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
    const dispatch = useDispatch();

    const MemoActions = bindActionCreators(memoActions, dispatch);
    const memos = useSelector((state: State) => state.memo.memos);
    const page = useSelector((state: State) => state.memo.page);
    const isLastPage = useSelector((state: State) => state.memo.isLastPage);
    const limit = useSelector((state: State) => state.memo.limit);

    const onScroll = throttle(async () => {
        if (isLastPage) return;
        const scrollBottom = getScrollBottom();
        if (scrollBottom > 100 || isLastPage) return;
        MemoActions.setPage({ page: page + 1 });

        const result = await client.query({
            query: gql`
                query Memos($limit: Int!, $cursor: String!) {
                    memos(limit: $limit, cursor: $cursor) {
                        memos {
                            _id
                            content
                            writer
                            createdAt
                            updatedAt
                        }
                        lastPage
                    }
                }
            `,
            variables: { limit, cursor: memos[memos.length - 1]._id },
        });
        const { memos: resultMemos } = result.data.memos;

        MemoActions.setMemos({
            memos: resultMemos,
        });
    }, 1000);

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
            variables={{
                limit: 10,
                cursor: undefined,
            }}
            onCompleted={(memosPayload: any) => {
                const { memos } = memosPayload.memos;

                MemoActions.setMemos({
                    memos,
                });
            }}
        >
            {({ subscribeToMore, data, error, loading }: GraphqlData) => {
                return (
                    <>
                        <MemoList
                            memos={memos}
                            subscribeToMore={() => {
                                subscribeToMore({
                                    document: MEMO_SUBSCRIPTION,
                                    onError: (err: any) => {
                                        if (err.message === 'not logged in') {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    },
                                    updateQuery: (
                                        prev: any,
                                        { subscriptionData }: any
                                    ) => {
                                        MemoActions.setNewMemo({
                                            memo:
                                                subscriptionData.data
                                                    .memoCreated,
                                        });
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
