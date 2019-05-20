import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
    actions as memoActions,
    ChangeInputPayload,
} from '../store/modules/memo';
import { actions as modalActions } from '../store/modules/modal';
import { State } from '../store/modules';
import WriteBox from '../components/memo/WriteBox';
import { GraphqlData } from '../types/common';

const CREATE_MEMO = gql`
    mutation CreateMemo($content: String!, $createdAt: String!) {
        createMemo(content: $content, createdAt: $createdAt) {
            memo {
                _id
                writer
                content
                createdAt
            }
            error
        }
    }
`;

const WriteContainer = () => {
    const dispatch = useDispatch();

    const MemoActions = bindActionCreators(memoActions, dispatch);
    const ModalActions = bindActionCreators(modalActions, dispatch);
    const changeInput = (payload: ChangeInputPayload) =>
        MemoActions.changeInput(payload);
    const initializeInput = () => MemoActions.initializeInput();

    const memoInput = useSelector(({ memo }: State) => memo.input.memo);

    return (
        <Mutation
            mutation={CREATE_MEMO}
            onCompleted={(createMemoPayload: any) => {
                const { error, memo } = createMemoPayload.createMemo;
                if (error && !memo) {
                    ModalActions.showModal({ name: 'login' });
                    return;
                }
                initializeInput();
            }}
        >
            {(createMemo: any, { data, loading, error }: GraphqlData) => {
                return (
                    <WriteBox
                        handleChange={changeInput}
                        memoInput={memoInput}
                        onCreate={createMemo}
                    />
                );
            }}
        </Mutation>
    );
};

export default WriteContainer;
