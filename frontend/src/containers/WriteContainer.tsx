import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { actions as memoActions, ChangeInputPayload } from 'store/modules/memo';
import { State } from 'store/modules';
import WriteBox from 'components/memo/WriteBox';
import { GraphqlData } from 'types/common';

const CREATE_MEMO = gql`
    mutation CreateMemo(
        $content: String!
        $writer: String!
        $createdAt: String!
    ) {
        createMemo(content: $content, writer: $writer, createdAt: $createdAt) {
            _id
            content
            writer
            createdAt
        }
    }
`;

const WriteContainer = () => {
    const dispatch = useDispatch();

    const MemoActions = bindActionCreators(memoActions, dispatch);
    const changeInput = (payload: ChangeInputPayload) =>
        MemoActions.changeInput(payload);

    const memoInput = useSelector(({ memo }: State) => memo.input.memo);

    return (
        <Mutation
            mutation={CREATE_MEMO}
            onCompleted={(createMemoPayload: any) => {
                console.log(createMemoPayload);
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
