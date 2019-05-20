import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query, withApollo, Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import throttle from 'lodash/throttle';
import MemoList from 'components/memo/MemoList';
import MemoCard from 'components/memo/MemoCard';
import { GraphqlData, Memo } from 'types/common';
import { getScrollBottom } from 'lib/common';
import { bindActionCreators } from 'redux';
import { actions as memoActions } from '../store/modules/memo';
import { State } from 'store/modules';

const MEMOS = gql`
    query Memos($page: Int!, $limit: Int!) {
        memos(page: $page, limit: $limit) {
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
            isSubscribed
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

    // const [memos, setMemos] = useState([] as Memo[]);
    // const [isLastPage, setLastPage] = useState(false);
    // const [page, setPage] = useState(1);
    // const [limit, setLimit] = useState(10);

    const onScroll = throttle(() => {
        if (isLastPage) return;
        const scrollBottom = getScrollBottom();
        if (scrollBottom > 100 || isLastPage) return;
        MemoActions.setPage({ page: page + 1 });
        client.query({
            query: gql`
                query Memos($page: Int!, $limit: Int!) {
                    memos(page: $page, limit: $limit) {
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
                const { memos, lastPage } = memosPayload.memos;
                if (memosPayload.memos.length === 0) {
                    MemoActions.setIsLastPage({
                        isLastPage: page === lastPage,
                    });
                    return;
                }

                MemoActions.setMemos({
                    memos,
                });
            }}
        >
            {({ subscribeToMore, data, error, loading }: GraphqlData) => {
                // console.log(loading);
                // if (loading) return null;
                return (
                    <>
                        <MemoList
                            memos={memos}
                            subscribeToMore={() => {
                                subscribeToMore({
                                    document: MEMO_SUBSCRIPTION,
                                    onError: (err: any) => {
                                        console.log('err', err);
                                        if (err.message === 'not logged in') {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    },
                                    updateQuery: (
                                        prev: any,
                                        { subscriptionData }: any
                                    ) => {
                                        console.log(subscriptionData);
                                        MemoActions.setNewMemo({
                                            memo:
                                                subscriptionData.data
                                                    .memoCreated,
                                        });
                                        return {
                                            memos,
                                        };
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
